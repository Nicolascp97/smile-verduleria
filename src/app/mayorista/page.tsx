import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMayorista } from "@/components/mayorista/CatalogoMayorista";
import type { Producto, DescuentoVolumen } from "@/lib/supabase/types";

async function getProductosMayorista(): Promise<Producto[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("disponible_mayorista", true)
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

export default async function MayoristaPage() {
  const [productos, descuentos] = await Promise.all([
    getProductosMayorista(),
    getDescuentos(),
  ]);

  return (
    <CatalogoMayorista productos={productos} descuentos={descuentos} />
  );
}
