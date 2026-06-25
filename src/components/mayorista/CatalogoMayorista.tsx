"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SpecialtyCarousel } from "@/components/mayorista/SpecialtyCarousel";
import { Building2, Truck, Package, Clock, CalendarDays, MapPin } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import type { Producto, DescuentoVolumen, EspecialidadConConteo } from "@/lib/supabase/types";

interface CatalogoMayoristaProps {
  productos: Producto[];
  descuentos: DescuentoVolumen[];
  especialidades: EspecialidadConConteo[];
  productosPorEspecialidad: Record<string, string[]>;
}

export function CatalogoMayorista({
  productos,
  descuentos,
  especialidades,
  productosPorEspecialidad,
}: CatalogoMayoristaProps) {
  const [especialidadActiva, setEspecialidadActiva] = useState<string | null>(null);

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
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
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

      {/* Días y zonas de despacho */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-ink mb-6">
          Días y zonas de despacho
        </h2>

        <div className="bg-surface rounded-2xl border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={20} className="text-green-700 shrink-0" />
            <h3 className="font-heading font-semibold text-ink">
              {DESPACHO_EMPRESAS.dias}
            </h3>
          </div>
          <div className="flex items-start gap-2 mb-3">
            <MapPin size={16} className="text-muted shrink-0 mt-0.5" />
            <p className="text-sm text-muted">Despacho a todas las comunas: {DESPACHO_EMPRESAS.comunas.join(" · ")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 flex-1">
            <Clock size={20} className="text-green-700 shrink-0" />
            <p className="text-sm text-ink">
              Horario de despacho: <strong>{DESPACHO_EMPRESAS.horario}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 flex-1">
            <Truck size={20} className="text-green-700 shrink-0" />
            <p className="text-sm text-ink">{DESPACHO_EMPRESAS.anticipacion}</p>
          </div>
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

        <ProductGrid productos={productosFiltrados} tipo="mayorista" />
      </section>
    </div>
  );
}
