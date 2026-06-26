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
    const { data, error } = await supabase
      .from("configuracion")
      .select("clave, valor");

    if (error) throw error;

    const config: Record<string, string> = {};
    for (const row of data ?? []) {
      config[row.clave] = row.valor;
    }

    return NextResponse.json({ config });
  } catch (err) {
    console.error("[API Configuracion] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { clave, valor } = await req.json();
    if (!clave) {
      return NextResponse.json({ error: "Falta clave" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("configuracion")
      .upsert({ clave, valor: String(valor) }, { onConflict: "clave" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Configuracion] Error PATCH:", err);
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}
