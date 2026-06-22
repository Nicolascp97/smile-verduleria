import { createServerClient } from "@/lib/supabase/server";
import { CatalogoMinorista } from "@/components/catalog/CatalogoMinorista";
import type { Producto } from "@/lib/supabase/types";

async function getProductos(): Promise<Producto[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("disponible_minorista", true)
      .order("destacado", { ascending: false })
      .order("nombre");

    if (error) throw error;
    return (data as Producto[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const productos = await getProductos();

  return <CatalogoMinorista productos={productos} />;
}
