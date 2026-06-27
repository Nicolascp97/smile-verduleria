"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SpecialtyCarousel } from "@/components/mayorista/SpecialtyCarousel";
import { Building2, Truck, Package, Clock, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import type { Producto, DescuentoVolumen, EspecialidadConConteo } from "@/lib/supabase/types";

interface CatalogoMayoristaProps {
  productos: Producto[];
  descuentos: DescuentoVolumen[];
  especialidades: EspecialidadConConteo[];
  productosPorEspecialidad: Record<string, string[]>;
  initialSlug?: string | null;
}

export function CatalogoMayorista({
  productos,
  descuentos,
  especialidades,
  productosPorEspecialidad,
  initialSlug,
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

      {/* Despacho a Empresas */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gray-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-xl">
              Empresas
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 size={24} className="text-gray-700" />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold text-ink">
                  Despacho a Empresas
                </h3>
                <p className="text-sm text-muted">{DESPACHO_EMPRESAS.perfiles}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-subtle rounded-xl px-4 py-3">
                <CalendarDays size={20} className="text-gray-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">{DESPACHO_EMPRESAS.dias}</p>
                  <p className="text-xs text-muted mt-0.5">Despacho a todas las comunas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Comunas disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DESPACHO_EMPRESAS.comunas.map((comuna) => (
                      <span
                        key={comuna}
                        className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {comuna}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">Horario: {DESPACHO_EMPRESAS.horario}</p>
                  <p className="text-xs text-muted mt-0.5">{DESPACHO_EMPRESAS.anticipacion}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={20} className="text-gray-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">
                    Gratis en pedidos sobre {formatPrice(DESPACHO_EMPRESAS.despachoGratisDesde)}
                  </p>
                  <p className="text-xs text-muted mt-0.5">Sin costo de despacho para nuestros clientes frecuentes</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <MessageCircle size={20} className="text-green-700 shrink-0 mt-0.5" />
                <p className="font-semibold text-green-700 text-sm">
                  Coordine entrega y horario directamente con nuestro vendedor por WhatsApp
                </p>
              </div>
            </div>
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
