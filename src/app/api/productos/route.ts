import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

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
      .from("productos")
      .select("*")
      .order("nombre");

    if (error) throw error;
    return NextResponse.json({ productos: data });
  } catch (err) {
    console.error("[API Productos] Error GET:", err);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { nombre, categoria, formato, formato_detalle, stock, precio_minorista, precio_mayorista } = body;

    if (!nombre?.trim() || !categoria || !formato) {
      return NextResponse.json({ error: "Nombre, categoría y formato son obligatorios" }, { status: 400 });
    }

    const supabase = createServerClient();

    const baseSlug = formato_detalle
      ? `${slugify(nombre)}-${slugify(formato_detalle)}`
      : `${slugify(nombre)}-${slugify(formato)}`;

    const { data: existing } = await supabase
      .from("productos")
      .select("slug")
      .like("slug", `${baseSlug}%`);

    const usedSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
    let slug = baseSlug;
    let counter = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre: nombre.trim(),
        slug,
        categoria,
        formato,
        formato_detalle: formato_detalle || null,
        stock: stock ?? 0,
        precio_minorista: precio_minorista ?? null,
        precio_mayorista: precio_mayorista ?? null,
        disponible_minorista: true,
        disponible_mayorista: true,
        imagen_url: null,
        destacado: false,
        activo: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, producto: data });
  } catch (err) {
    console.error("[API Productos] Error POST:", err);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
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
      .from("productos")
      .update(fields)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Productos] Error PATCH:", err);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const denied = adminAuth(req);
  if (denied) return denied;

  try {
    const { catalogo, ids } = await req.json();

    if (catalogo !== "mayorista" && catalogo !== "minorista") {
      return NextResponse.json({ error: "Catálogo inválido" }, { status: 400 });
    }
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "Falta el arreglo de ids" }, { status: 400 });
    }

    const col = catalogo === "mayorista" ? "orden_mayorista" : "orden_minorista";
    const supabase = createServerClient();

    // Persiste el nuevo orden: la posición en el arreglo es el valor de orden.
    for (let i = 0; i < ids.length; i++) {
      const { error } = await supabase
        .from("productos")
        .update({ [col]: i + 1 })
        .eq("id", ids[i]);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Productos] Error PUT:", err);
    return NextResponse.json({ error: "Error al reordenar productos" }, { status: 500 });
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
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API Productos] Error DELETE:", err);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
