import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMinorista } from "@/components/catalog/CatalogoMinorista";
import type { Producto, DespachoZona, EspecialidadConConteo } from "@/lib/supabase/types";

// La home lee promociones, el interruptor global y el stock en cada visita,
// para que los cambios hechos desde el panel se reflejen al instante.
export const dynamic = "force-dynamic";

async function getProductos(): Promise<Producto[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("disponible_mayorista", true)
      .order("orden_mayorista")
      .order("nombre");

    if (error) throw error;
    return (data as Producto[]) ?? [];
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

export default async function HomePage() {
  const [productos, especialidades, productosPorEspecialidad, zonas] =
    await Promise.all([
      getProductos(),
      getEspecialidades(),
      getProductosPorEspecialidad(),
      getZonas(),
    ]);

  return (
    <CatalogoMinorista
      productos={productos}
      especialidades={especialidades}
      productosPorEspecialidad={productosPorEspecialidad}
      zonas={zonas}
    />
  );
}
