"use client";

import { ProductGrid } from "./ProductGrid";
import { ProductCard } from "./ProductCard";
import { Truck } from "lucide-react";
import type { Producto } from "@/lib/supabase/types";

interface CatalogoMinoristaProps {
  productos: Producto[];
}

export function CatalogoMinorista({ productos }: CatalogoMinoristaProps) {
  const destacados = productos.filter((p) => p.destacado);

  return (
    <div>
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-green-700 text-sm font-semibold tracking-widest uppercase mb-3">
            Fresco · Local · Natural
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-4 text-ink">
            Frescura directo
            <br />a tu mesa
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Frutas, verduras, hierbas y más. Arma tu pedido y recíbelo en la
            puerta de tu casa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-150 min-h-[48px]"
            >
              Ver Catálogo
            </a>
            <a
              href="/mayorista"
              className="inline-flex items-center gap-2 border-2 border-border hover:border-ink text-ink font-semibold px-8 py-3.5 rounded-xl transition-colors duration-150 min-h-[48px]"
            >
              Soy Mayorista
            </a>
          </div>
        </div>
      </section>

      {/* Banner de delivery */}
      <section className="bg-accent-warm text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
          <Truck size={24} aria-hidden="true" />
          <p className="font-medium text-sm md:text-base">
            Despacho a domicilio en Región Metropolitana · Consulta zonas y
            costos
          </p>
        </div>
      </section>

      {/* Destacados de la semana */}
      {destacados.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
            Favoritos de la semana
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {destacados.slice(0, 8).map((p) => (
              <div key={p.id}>
                <ProductCard producto={p} tipo="minorista" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catálogo completo */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
          Todos los productos
        </h2>
        <ProductGrid productos={productos} tipo="minorista" />
      </section>
    </div>
  );
}
