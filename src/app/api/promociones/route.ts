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
      .from("promociones")
      .select("*, producto:productos(*)")
      .order("orden")
      .order("created_at");

    if (error) throw error;
    return NextResponse.json({ promociones: data });
  } catch (err) {
    console.error("[API Promociones] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener promociones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const {
      producto_id,
      descuento_pct,
      precio_oferta,
      cantidad,
      formato_etiqueta,
      badge_texto,
      orden,
    } = body;

    if (!producto_id) {
      return NextResponse.json({ error: "Debes elegir un producto" }, { status: 400 });
    }
    if (descuento_pct == null && precio_oferta == null) {
      return NextResponse.json(
        { error: "Indica un porcentaje de descuento o un precio de oferta" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("promociones")
      .insert({
        producto_id,
        descuento_pct: descuento_pct ?? null,
        precio_oferta: precio_oferta ?? null,
        cantidad: cantidad ?? null,
        formato_etiqueta: formato_etiqueta || null,
        badge_texto: badge_texto || null,
        orden: orden ?? 0,
        activo: true,
      })
      .select("*, producto:productos(*)")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, promocion: data });
  } catch (err) {
    console.error("[API Promociones] Error POST:", err);
    return NextResponse.json({ error: "Error al crear promoción" }, { status: 500 });
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
      .from("promociones")
      .update(fields)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Promociones] Error PATCH:", err);
    return NextResponse.json({ error: "Error al actualizar promoción" }, { status: 500 });
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
      .from("promociones")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Promociones] Error DELETE:", err);
    return NextResponse.json({ error: "Error al eliminar promoción" }, { status: 500 });
  }
}
