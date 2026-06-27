import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function adminAuth(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

interface ItemInput {
  producto_id: string;
  cantidad: string;
}

// Reemplaza por completo los ítems de una canasta.
async function replaceItems(
  supabase: ReturnType<typeof createServerClient>,
  canastaId: string,
  items: ItemInput[]
) {
  await supabase.from("canasta_items").delete().eq("canasta_id", canastaId);
  const rows = (items ?? [])
    .filter((i) => i.producto_id)
    .map((i, idx) => ({
      canasta_id: canastaId,
      producto_id: i.producto_id,
      cantidad: i.cantidad || "",
      orden: idx,
    }));
  if (rows.length > 0) {
    const { error } = await supabase.from("canasta_items").insert(rows);
    if (error) throw error;
  }
}

export async function GET(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("canastas")
      .select("*, items:canasta_items(*, producto:productos(nombre, formato))")
      .order("orden")
      .order("created_at");

    if (error) throw error;

    // Ordenar los ítems de cada canasta por su campo orden
    const canastas = (data ?? []).map((c: { items?: { orden: number }[] }) => ({
      ...c,
      items: (c.items ?? []).slice().sort((a, b) => a.orden - b.orden),
    }));

    return NextResponse.json({ canastas });
  } catch (err) {
    console.error("[API Canastas] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener canastas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { nombre, descripcion, precio, orden, items } = body;

    if (!nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("canastas")
      .insert({
        nombre: nombre.trim(),
        descripcion: descripcion || null,
        precio: precio ?? 0,
        orden: orden ?? 0,
        activo: true,
      })
      .select()
      .single();

    if (error) throw error;

    if (Array.isArray(items)) {
      await replaceItems(supabase, data.id, items);
    }

    return NextResponse.json({ ok: true, canasta: data });
  } catch (err) {
    console.error("[API Canastas] Error POST:", err);
    return NextResponse.json({ error: "Error al crear canasta" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { id, items, ...fields } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const supabase = createServerClient();

    if (Object.keys(fields).length > 0) {
      const { error } = await supabase.from("canastas").update(fields).eq("id", id);
      if (error) throw error;
    }

    if (Array.isArray(items)) {
      await replaceItems(supabase, id, items);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Canastas] Error PATCH:", err);
    return NextResponse.json({ error: "Error al actualizar canasta" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("canastas").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Canastas] Error DELETE:", err);
    return NextResponse.json({ error: "Error al eliminar canasta" }, { status: 500 });
  }
}
