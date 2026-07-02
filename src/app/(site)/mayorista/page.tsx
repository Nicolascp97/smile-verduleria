import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMayorista } from "@/components/mayorista/CatalogoMayorista";
import type { Producto, DescuentoVolumen, DespachoZona, PromocionConProducto, CanastaConItems } from "@/lib/supabase/types";

// Las promociones leen el interruptor global y el stock en cada visita,
// para que los cambios del panel se reflejen al instante.
export const dynamic = "force-dynamic";

async function getProductosMayorista(): Promise<Producto[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("disponible_minorista", true)
      .order("orden_minorista")
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

async function getCanastas(): Promise<CanastaConItems[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("canastas")
      .select("*, items:canasta_items(*, producto:productos(nombre, formato))")
      .eq("activo", true)
      .order("orden")
      .order("created_at");

    if (error) throw error;

    return ((data as CanastaConItems[]) ?? []).map((c) => ({
      ...c,
      items: (c.items ?? []).slice().sort((a, b) => a.orden - b.orden),
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

export default async function MayoristaPage() {
  const [productos, descuentos, promociones, canastas, zonas] = await Promise.all([
    getProductosMayorista(),
    getDescuentos(),
    getPromociones(),
    getCanastas(),
    getZonas(),
  ]);

  return (
    <CatalogoMayorista
      productos={productos}
      descuentos={descuentos}
      promociones={promociones}
      canastas={canastas}
      zonas={zonas}
    />
  );
}
