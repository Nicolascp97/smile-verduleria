"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SpecialtyCarousel } from "@/components/mayorista/SpecialtyCarousel";
import { Building2, Truck, Package, CalendarDays } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import { DespachoParticularesCard } from "@/components/catalog/DespachoParticularesCard";
import type { Producto, DescuentoVolumen, EspecialidadConConteo, DespachoZona } from "@/lib/supabase/types";

interface CatalogoMayoristaProps {
  productos: Producto[];
  descuentos: DescuentoVolumen[];
  especialidades: EspecialidadConConteo[];
  productosPorEspecialidad: Record<string, string[]>;
  initialSlug?: string | null;
  zonas?: DespachoZona[];
}

export function CatalogoMayorista({
  productos,
  descuentos,
  especialidades,
  productosPorEspecialidad,
  initialSlug,
  zonas,
}: CatalogoMayoristaProps) {
  const [especialidadActiva, setEspecialidadActiva] = useState<string | null>(
    () => (initialSlug && especialidades.some((e) => e.slug === initialSlug) ? initialSlug : null)
  );

  const productosFiltrados = useMemo(() => {
    if (!especialidadActiva) return productos;
    const ids = productosPorEspecialidad[especialidadActiva];
    if (!ids || ids.length === 0) return [];
    const idSet = new Set(ids);
    return productos.filter((p) => idSet.has(p.id));
  }, [productos, especialidadActiva, productosPorEspecialidad]);

  const especialidadInfo = especialidades.find((e) => e.slug === especialidadActiva);

  return (
    <div>
      {/* Hero mayorista */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <Image
          src="/hero/hero-08-elegant-dark-produce.webp"
          alt="Verduras frescas sobre fondo oscuro"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
          quality={85}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={28} className="text-green-500" />
            <span className="text-gray-400 text-sm font-medium tracking-widest uppercase">
              Canal Mayorista
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">
            Abastecimiento fresco
            <br />
            para tu negocio
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-8">
            {DESPACHO_EMPRESAS.perfiles}. Productos por caja, saco y malla con
            precios diferenciados y despacho a tu negocio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <Package size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">Formatos por caja, saco y malla</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <Truck size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">
                Despacho gratis sobre {formatPrice(DESPACHO_EMPRESAS.despachoGratisDesde)}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <CalendarDays size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">Reparto {DESPACHO_EMPRESAS.dias.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Despacho a Particulares */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <DespachoParticularesCard zonas={zonas} />
        </div>
      </section>

      {/* Catálogo mayorista */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
          {especialidadInfo
            ? `Productos para ${especialidadInfo.nombre} ${especialidadInfo.emoji}`
            : "Todos los productos disponibles"}
        </h2>

        {especialidades.length > 0 && (
          <div className="mb-8">
            <SpecialtyCarousel
              especialidades={especialidades}
              selected={especialidadActiva}
              onSelect={setEspecialidadActiva}
            />
          </div>
        )}

        <ProductGrid productos={productosFiltrados} tipo="minorista" />
      </section>
    </div>
  );
}
