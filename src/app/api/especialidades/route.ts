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
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const supabase = createServerClient();

    const { data: especialidades, error: espError } = await supabase
      .from("especialidades")
      .select("*")
      .order("orden");

    if (espError) throw espError;

    const { data: asociaciones, error: asocError } = await supabase
      .from("producto_especialidad")
      .select("producto_id, especialidad_id");

    if (asocError) throw asocError;

    const productosPorEspecialidad: Record<string, string[]> = {};
    for (const a of asociaciones ?? []) {
      if (!productosPorEspecialidad[a.especialidad_id]) {
        productosPorEspecialidad[a.especialidad_id] = [];
      }
      productosPorEspecialidad[a.especialidad_id].push(a.producto_id);
    }

    return NextResponse.json({
      especialidades: especialidades ?? [],
      productosPorEspecialidad,
    });
  } catch (err) {
    console.error("[API Especialidades] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener especialidades" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { producto_id, especialidad_id, action } = await req.json();

    if (!producto_id || !especialidad_id || !action) {
      return NextResponse.json(
        { error: "producto_id, especialidad_id y action son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    if (action === "add") {
      const { error } = await supabase
        .from("producto_especialidad")
        .insert({ producto_id, especialidad_id });

      if (error && error.code !== "23505") throw error;
    } else if (action === "remove") {
      const { error } = await supabase
        .from("producto_especialidad")
        .delete()
        .eq("producto_id", producto_id)
        .eq("especialidad_id", especialidad_id);

      if (error) throw error;
    } else {
      return NextResponse.json({ error: "action debe ser 'add' o 'remove'" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Especialidades] Error POST:", err);
    return NextResponse.json({ error: "Error al modificar asociación" }, { status: 500 });
  }
}
