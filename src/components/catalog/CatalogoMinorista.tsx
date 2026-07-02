"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ProductGrid } from "./ProductGrid";
import { SpecialtyCarousel } from "@/components/mayorista/SpecialtyCarousel";
import { Truck } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import { ClientMarquee } from "@/components/layout/ClientMarquee";
import { DespachoEmpresasCard } from "./DespachoEmpresasCard";
import type { Producto, DespachoZona, EspecialidadConConteo } from "@/lib/supabase/types";

interface CatalogoMinoristaProps {
  productos: Producto[];
  especialidades: EspecialidadConConteo[];
  productosPorEspecialidad: Record<string, string[]>;
  zonas?: DespachoZona[];
}

export function CatalogoMinorista({
  productos,
  especialidades,
  productosPorEspecialidad,
  zonas,
}: CatalogoMinoristaProps) {
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-white flex items-center">
        <Image
          src="/hero/hero-1.jpeg"
          alt="Frutas y verduras frescas"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto shadow-sm">
            <p className="text-green-700 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Confianza &ndash; Calidad &ndash; Frescura
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5 text-ink">
              Proveedores de Restaurantes,
              <br />Empresas y Particulares
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Arma tu pedido y recíbelo donde lo necesites.
            </p>
          </div>
        </div>
      </section>

      {/* Banner de delivery */}
      <section className="bg-accent-warm text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-3 text-center">
          <Truck size={24} aria-hidden="true" className="shrink-0" />
          <p className="font-medium text-sm md:text-base">
            Despacho a empresas: <strong>{DESPACHO_EMPRESAS.dias.toLowerCase()}</strong> · Gratis sobre {formatPrice(DESPACHO_EMPRESAS.despachoGratisDesde)}
          </p>
        </div>
      </section>

      {/* Clientes que confían en nosotros */}
      <ClientMarquee />

      {/* Despachos */}
      <section id="despachos" className="max-w-7xl mx-auto px-4 py-14 md:py-16">
        <div className="text-center mb-10">
          <p className="text-green-700 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            Cómo funciona
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-3">
            Despachos
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Llevamos frutas y verduras frescas hasta la puerta de tu casa o negocio.
            Revisa los días, horarios y comunas disponibles.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <DespachoEmpresasCard zonas={zonas} />
        </div>
      </section>

      {/* Catálogo completo con selector de especialidades */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
          {especialidadInfo
            ? `Productos para ${especialidadInfo.nombre} ${especialidadInfo.emoji}`
            : "Todos los productos"}
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
