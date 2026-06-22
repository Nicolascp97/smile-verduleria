import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      tipo,
      cliente_nombre,
      cliente_telefono,
      cliente_direccion,
      zona_envio,
      items,
      total,
      notas,
      canal,
    } = body;

    if (!cliente_nombre || !cliente_telefono || !items?.length) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        tipo: tipo || "minorista",
        cliente_nombre,
        cliente_telefono,
        cliente_direccion: cliente_direccion || null,
        zona_envio: zona_envio || null,
        items,
        total: total || 0,
        notas: notas || null,
        canal: canal || "web",
        estado: "nuevo",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, pedido: data });
  } catch (err) {
    console.error("[API Pedidos] Error:", err);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const url = new URL(req.url);
    const estado = url.searchParams.get("estado");
    const tipo = url.searchParams.get("tipo");

    let query = supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (estado) query = query.eq("estado", estado);
    if (tipo) query = query.eq("tipo", tipo);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ pedidos: data });
  } catch (err) {
    console.error("[API Pedidos] Error GET:", err);
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, estado } = await req.json();
    if (!id || !estado) {
      return NextResponse.json(
        { error: "Faltan id o estado" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("pedidos")
      .update({ estado })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Pedidos] Error PATCH:", err);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}
