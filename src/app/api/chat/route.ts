import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase/server";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { AI_TOOLS } from "@/lib/ai/tools";
import type { Producto } from "@/lib/supabase/types";

const anthropic = new Anthropic();
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function normalizarBusqueda(query: string): string {
  let q = query.trim().toLowerCase();
  if (q.endsWith("ces")) {
    q = q.slice(0, -3) + "z";
  } else if (q.endsWith("es")) {
    q = q.slice(0, -2);
  } else if (q.endsWith("s")) {
    q = q.slice(0, -1);
  }
  return q;
}

type ToolOutcome = {
  // Lo que ve el modelo (JSON string)
  forModel: string;
  // Evento opcional para el cliente (tarjetas o carrito)
  clientEvent?: Record<string, unknown>;
};

async function handleToolCall(
  name: string,
  input: Record<string, unknown>
): Promise<ToolOutcome> {
  const supabase = createServerClient();

  switch (name) {
    case "buscar_productos": {
      let productos: Producto[] = [];

      if (input.query) {
        const raw = (input.query as string).trim();
        const normalizado = normalizarBusqueda(raw);
        const variantes = [raw, ...(normalizado !== raw.toLowerCase() ? [normalizado] : [])];

        for (const termino of variantes) {
          let q = supabase.from("productos").select("*").eq("activo", true);
          if (input.categoria) q = q.eq("categoria", input.categoria as string);
          q = q.ilike("nombre", `%${termino}%`);
          const { data, error } = await q.limit(8);
          if (error) return { forModel: JSON.stringify({ error: error.message }) };
          if (data?.length) {
            productos = data as Producto[];
            break;
          }
        }
      } else {
        let query = supabase.from("productos").select("*").eq("activo", true);
        if (input.categoria) query = query.eq("categoria", input.categoria as string);
        const { data, error } = await query.limit(8);
        if (error) return { forModel: JSON.stringify({ error: error.message }) };
        productos = (data as Producto[]) ?? [];
      }

      if (productos.length === 0) {
        return { forModel: JSON.stringify({ mensaje: "No se encontraron productos con esa búsqueda." }) };
      }

      // Resumen liviano para el modelo
      const paraModelo = productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        formato: p.formato,
        formato_detalle: p.formato_detalle,
        stock: p.stock,
        precio_minorista: p.precio_minorista,
        disponible_minorista: p.disponible_minorista,
      }));

      return {
        forModel: JSON.stringify(paraModelo),
        // Productos completos para renderizar tarjetas y poder agregarlos al carrito
        clientEvent: { type: "products", productos },
      };
    }

    case "agregar_al_carrito": {
      const items = (input.items as Array<{ producto_id: string; cantidad: number }>) ?? [];
      const ids = items.map((i) => i.producto_id);

      if (ids.length === 0) {
        return { forModel: JSON.stringify({ error: "No se indicaron productos." }) };
      }

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .in("id", ids);

      if (error) return { forModel: JSON.stringify({ error: error.message }) };

      const productosById = new Map((data as Producto[]).map((p) => [p.id, p]));
      const agregados = items
        .map((i) => {
          const producto = productosById.get(i.producto_id);
          if (!producto) return null;
          return { producto, cantidad: Math.max(1, Math.floor(i.cantidad)) };
        })
        .filter((x): x is { producto: Producto; cantidad: number } => x !== null);

      if (agregados.length === 0) {
        return { forModel: JSON.stringify({ error: "Los productos indicados no existen." }) };
      }

      return {
        forModel: JSON.stringify({
          ok: true,
          agregados: agregados.map((a) => ({ nombre: a.producto.nombre, cantidad: a.cantidad })),
        }),
        clientEvent: { type: "cart_action", agregados },
      };
    }

    case "crear_pedido": {
      const items = input.items as Array<Record<string, unknown>>;
      const total = items.reduce(
        (sum, i) => sum + ((i.subtotal as number) || 0),
        0
      );

      const { data, error } = await supabase
        .from("pedidos")
        .insert({
          tipo: "minorista",
          cliente_nombre: input.cliente_nombre as string,
          cliente_telefono: input.cliente_telefono as string,
          cliente_direccion: (input.cliente_direccion as string) || null,
          zona_envio: null,
          items,
          total,
          notas: (input.notas as string) || null,
          canal: "agente_ia",
          estado: "nuevo",
        })
        .select()
        .single();

      if (error) return { forModel: JSON.stringify({ error: error.message }) };
      return {
        forModel: JSON.stringify({
          ok: true,
          pedido_id: data.id,
          mensaje: "Pedido creado exitosamente.",
        }),
      };
    }

    default:
      return { forModel: JSON.stringify({ error: "Herramienta no reconocida" }) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: "Sin mensajes" }), {
        status: 400,
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        };

        try {
          let currentMessages = messages.map(
            (m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })
          );

          let continueLoop = true;

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: MODEL,
              max_tokens: 1024,
              system: SYSTEM_PROMPT,
              tools: AI_TOOLS,
              messages: currentMessages,
            });

            const toolUses: Array<{
              id: string;
              name: string;
              input: Record<string, unknown>;
            }> = [];

            for (const block of response.content) {
              if (block.type === "text") {
                send({ type: "text", content: block.text });
              } else if (block.type === "tool_use") {
                toolUses.push({
                  id: block.id,
                  name: block.name,
                  input: block.input as Record<string, unknown>,
                });
              }
            }

            if (toolUses.length > 0) {
              currentMessages = [
                ...currentMessages,
                { role: "assistant" as const, content: response.content },
                {
                  role: "user" as const,
                  content: await Promise.all(
                    toolUses.map(async (tu) => {
                      const outcome = await handleToolCall(tu.name, tu.input);

                      if (outcome.clientEvent) {
                        send(outcome.clientEvent);
                      }

                      return {
                        type: "tool_result" as const,
                        tool_use_id: tu.id,
                        content: outcome.forModel,
                      };
                    })
                  ),
                },
              ];
            } else {
              continueLoop = false;
            }
          }

          send({ type: "done" });
          controller.close();
        } catch (error) {
          console.error("[Chat API] Error:", error);
          send({
            type: "error",
            content: "Error procesando tu mensaje. Intenta de nuevo.",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}
