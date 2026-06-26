import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMinorista } from "@/components/catalog/CatalogoMinorista";
import type { Producto, PromocionConProducto } from "@/lib/supabase/types";

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
      .eq("disponible_minorista", true)
      .order("nombre");

    if (error) throw error;
    return (data as Producto[]) ?? [];
  } catch {
    return [];
  }
}

async function getPromociones(): Promise<PromocionConProducto[]> {
  try {
    const supabase = createServerClient();

    // Respeta el interruptor global del admin.
    const { data: config } = await supabase
      .from("configuracion")
      .select("valor")
      .eq("clave", "promociones_activas")
      .maybeSingle();

    if (config?.valor !== "true") return [];

    const { data, error } = await supabase
      .from("promociones")
      .select("*, producto:productos(*)")
      .eq("activo", true)
      .order("orden")
      .order("created_at");

    if (error) throw error;

    // Solo promos cuyo producto siga activo.
    return ((data as PromocionConProducto[]) ?? []).filter(
      (promo) => promo.producto && promo.producto.activo
    );
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [productos, promociones] = await Promise.all([
    getProductos(),
    getPromociones(),
  ]);

  return <CatalogoMinorista productos={productos} promociones={promociones} />;
}
