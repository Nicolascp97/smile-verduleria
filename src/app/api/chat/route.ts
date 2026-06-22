import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase/server";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { AI_TOOLS } from "@/lib/ai/tools";

const anthropic = new Anthropic();
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

async function handleToolCall(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  const supabase = createServerClient();

  switch (name) {
    case "buscar_productos": {
      let query = supabase
        .from("productos")
        .select("id,nombre,categoria,formato,formato_detalle,stock,precio_minorista,precio_mayorista,disponible_minorista,disponible_mayorista")
        .eq("activo", true);

      if (input.categoria) {
        query = query.eq("categoria", input.categoria as string);
      }

      if (input.query) {
        query = query.ilike("nombre", `%${input.query}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) return JSON.stringify({ error: error.message });
      if (!data?.length) return JSON.stringify({ mensaje: "No se encontraron productos con esa búsqueda." });
      return JSON.stringify(data);
    }

    case "agregar_al_carrito": {
      return JSON.stringify({
        accion: "agregar_al_carrito",
        producto_id: input.producto_id,
        cantidad: input.cantidad,
        mensaje: "Producto agregado al carrito del cliente.",
      });
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

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        ok: true,
        pedido_id: data.id,
        mensaje: "Pedido creado exitosamente.",
      });
    }

    default:
      return JSON.stringify({ error: "Herramienta no reconocida" });
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

            let assistantText = "";
            const toolUses: Array<{
              id: string;
              name: string;
              input: Record<string, unknown>;
            }> = [];

            for (const block of response.content) {
              if (block.type === "text") {
                assistantText += block.text;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`
                  )
                );
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
                      const result = await handleToolCall(tu.name, tu.input);
                      const parsed = JSON.parse(result);

                      if (
                        tu.name === "agregar_al_carrito" &&
                        parsed.accion === "agregar_al_carrito"
                      ) {
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({ type: "cart_action", ...parsed })}\n\n`
                          )
                        );
                      }

                      return {
                        type: "tool_result" as const,
                        tool_use_id: tu.id,
                        content: result,
                      };
                    })
                  ),
                },
              ];
            } else {
              continueLoop = false;
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("[Chat API] Error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", content: "Error procesando tu mensaje. Intenta de nuevo." })}\n\n`
            )
          );
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
