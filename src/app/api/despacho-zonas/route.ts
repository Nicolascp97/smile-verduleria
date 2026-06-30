import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function adminAuth(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const isAdmin = req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;

  try {
    const supabase = createServerClient();
    let query = supabase
      .from("despacho_zonas")
      .select("*")
      .order("orden")
      .order("nombre");

    if (!isAdmin) {
      query = query.eq("activo", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ zonas: data });
  } catch (err) {
    console.error("[API DespachoZonas] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener zonas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { nombre, costo, orden } = body;

    if (!nombre?.trim()) {
      return NextResponse.json({ error: "El nombre de la comuna es requerido" }, { status: 400 });
    }
    if (costo == null || costo < 0) {
      return NextResponse.json({ error: "El costo debe ser un número válido" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("despacho_zonas")
      .insert({ nombre: nombre.trim(), costo, orden: orden ?? 0, activo: true })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, zona: data });
  } catch (err) {
    console.error("[API DespachoZonas] Error POST:", err);
    return NextResponse.json({ error: "Error al crear zona" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { id, ...fields } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("despacho_zonas")
      .update(fields)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API DespachoZonas] Error PATCH:", err);
    return NextResponse.json({ error: "Error al actualizar zona" }, { status: 500 });
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
    const { error } = await supabase
      .from("despacho_zonas")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API DespachoZonas] Error DELETE:", err);
    return NextResponse.json({ error: "Error al eliminar zona" }, { status: 500 });
  }
}
