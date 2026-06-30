import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMayorista } from "@/components/mayorista/CatalogoMayorista";
import type { Producto, DescuentoVolumen, EspecialidadConConteo, DespachoZona } from "@/lib/supabase/types";

async function getProductosMayorista(): Promise<Producto[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("disponible_minorista", true)
      .order("categoria")
      .order("nombre");

    if (error) throw error;
    return (data as Producto[]) ?? [];
  } catch {
    return [];
  }
}

async function getDescuentos(): Promise<DescuentoVolumen[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("descuentos_volumen")
      .select("*")
      .order("min_monto");

    if (error) throw error;
    return (data as DescuentoVolumen[]) ?? [];
  } catch {
    return [];
  }
}

async function getEspecialidades(): Promise<EspecialidadConConteo[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("especialidades")
      .select("*, producto_especialidad(count)")
      .eq("activo", true)
      .order("orden");

    if (error) throw error;
    if (!data) return [];

    return data.map((e: Record<string, unknown>) => ({
      ...(e as unknown as EspecialidadConConteo),
      producto_count:
        Array.isArray(e.producto_especialidad) && e.producto_especialidad.length > 0
          ? (e.producto_especialidad[0] as { count: number }).count
          : 0,
    }));
  } catch {
    return [];
  }
}

async function getZonas(): Promise<DespachoZona[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("despacho_zonas")
      .select("*")
      .eq("activo", true)
      .order("orden")
      .order("nombre");
    if (error) throw error;
    return (data as DespachoZona[]) ?? [];
  } catch {
    return [];
  }
}

async function getProductosPorEspecialidad(): Promise<Record<string, string[]>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("producto_especialidad")
      .select("producto_id, especialidad:especialidades(slug)");

    if (error) throw error;
    if (!data) return {};

    const map: Record<string, string[]> = {};
    for (const row of data as unknown as Array<{ producto_id: string; especialidad: { slug: string } | { slug: string }[] | null }>) {
      const esp = row.especialidad;
      const slug = Array.isArray(esp) ? esp[0]?.slug : esp?.slug;
      if (!slug) continue;
      if (!map[slug]) map[slug] = [];
      map[slug].push(row.producto_id);
    }
    return map;
  } catch {
    return {};
  }
}

export default async function MayoristaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const [{ cat }, productos, descuentos, especialidades, productosPorEspecialidad, zonas] =
    await Promise.all([
      searchParams,
      getProductosMayorista(),
      getDescuentos(),
      getEspecialidades(),
      getProductosPorEspecialidad(),
      getZonas(),
    ]);

  return (
    <CatalogoMayorista
      productos={productos}
      descuentos={descuentos}
      especialidades={especialidades}
      productosPorEspecialidad={productosPorEspecialidad}
      initialSlug={cat ?? null}
      zonas={zonas}
    />
  );
}
