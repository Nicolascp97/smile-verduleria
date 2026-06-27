"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductGrid } from "./ProductGrid";
import { ProductCard } from "./ProductCard";
import { Truck, CalendarDays, MapPin, Clock, User, Info, ShoppingBasket, X, Check } from "lucide-react";
import { DESPACHO_PARTICULARES } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import { ClientMarquee } from "@/components/layout/ClientMarquee";
import type { Producto, PromocionConProducto } from "@/lib/supabase/types";

// Contenido de la Canasta Básica (según productos-unificado.md)
const CANASTA_BASICA = [
  "Papa — 5 kilos",
  "Cebolla — 2 kilos",
  "Ajo — 3 unidades",
  "Tomate — 2 kilos",
  "Zanahoria — 1 kilo",
  "Palta — 1 kilo",
  "Lechuga — 2 unidades",
  "Zapallo camote — 1 corte",
  "Pimentón rojo — 1 unidad",
  "Cilantro — 1 atado",
  "Cebollín — 1 atado",
  "Brócoli — 1 unidad",
  "Plátano — 2 kilos",
  "Naranja — 2 kilos",
  "Manzana — 1 kilo",
  "Kiwi — 1 kilo",
];

interface CatalogoMinoristaProps {
  productos: Producto[];
  promociones: PromocionConProducto[];
}

export function CatalogoMinorista({ productos, promociones }: CatalogoMinoristaProps) {
  const [canastaOpen, setCanastaOpen] = useState(false);

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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto mb-10 shadow-sm">
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

          {/* Categorías */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <a
              href="#catalogo"
              className="bg-white/90 backdrop-blur-sm border-2 border-green-700 rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <User size={28} className="text-green-700" />
              <span className="font-semibold text-ink text-sm">Particular</span>
            </a>
            <a
              href="/mayorista"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <span className="text-2xl">🇨🇱</span>
              <span className="font-semibold text-ink text-sm text-center">Gastronomía Chilena</span>
            </a>
            <a
              href="/mayorista"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <span className="text-2xl">🇨🇳🇰🇷</span>
              <span className="font-semibold text-ink text-sm text-center">Gastronomía China Coreana</span>
            </a>
            <a
              href="/mayorista"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <span className="text-2xl">🇵🇪</span>
              <span className="font-semibold text-ink text-sm text-center">Gastronomía Peruana</span>
            </a>
          </div>

          {/* Canastas predeterminadas (debajo de Particular) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setCanastaOpen(true)}
              className="bg-white/90 backdrop-blur-sm border-2 border-green-700 rounded-2xl px-6 py-5 flex items-center gap-4 flex-1 shadow-sm text-left hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <ShoppingBasket size={32} className="text-green-700 shrink-0" />
              <div className="text-left">
                <p className="font-bold text-ink text-sm">Canasta Básica</p>
                <p className="text-xs text-muted">Un poco de todo · <span className="text-green-700 font-semibold">Ver detalle</span></p>
                <p className="font-bold text-green-700 text-lg mt-1">{formatPrice(35000)}</p>
              </div>
            </button>
            <div className="bg-white/90 backdrop-blur-sm border-2 border-green-700 rounded-2xl px-6 py-5 flex items-center gap-4 flex-1 shadow-sm">
              <ShoppingBasket size={32} className="text-green-700 shrink-0" />
              <div className="text-left">
                <p className="font-bold text-ink text-sm">Canasta Completa</p>
                <p className="text-xs text-muted">Más variedad y cantidad</p>
                <p className="font-bold text-green-700 text-lg mt-1">{formatPrice(50000)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de delivery */}
      <section className="bg-accent-warm text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-3 text-center">
          <Truck size={24} aria-hidden="true" className="shrink-0" />
          <p className="font-medium text-sm md:text-base">
            Despacho a domicilio los <strong>{DESPACHO_PARTICULARES.dia.toLowerCase()}s</strong> ·{" "}
            {formatPrice(DESPACHO_PARTICULARES.costo)} · {DESPACHO_PARTICULARES.comunas.length} comunas
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
          {/* Particulares */}
          <div className="bg-surface rounded-2xl border-2 border-green-700 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-700 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-xl">
              Personas
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <User size={24} className="text-green-700" />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold text-ink">
                  Despacho a Particulares
                </h3>
                <p className="text-sm text-muted">Para tu hogar</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-green-50 rounded-xl px-4 py-3">
                <CalendarDays size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">Solo los días {DESPACHO_PARTICULARES.dia.toLowerCase()}s</p>
                  <p className="text-xs text-muted mt-0.5">Único día de reparto para hogares</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">Horario: {DESPACHO_PARTICULARES.horario}</p>
                  <p className="text-xs text-muted mt-0.5">Recibe tu pedido durante la mañana o tarde</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm">Costo de despacho: {formatPrice(DESPACHO_PARTICULARES.costo)}</p>
                  <p className="text-xs text-muted mt-0.5">Tarifa fija por pedido</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Comunas disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DESPACHO_PARTICULARES.comunas.map((comuna) => (
                      <span
                        key={comuna}
                        className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {comuna}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-muted shrink-0 mt-0.5" />
                <p className="text-xs text-muted leading-relaxed">
                  Si tu comuna no aparece en la lista, por ahora no llegamos a esa zona,
                  pero estamos ampliando la cobertura. Escríbenos por WhatsApp para más info.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promociones (administrable desde el panel) */}
      {promociones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
            Promociones
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {promociones.map((promo) => (
              <div key={promo.id}>
                <ProductCard producto={promo.producto} tipo="minorista" promo={promo} />
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

      {/* Popup detalle Canasta Básica */}
      {canastaOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setCanastaOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Detalle de la Canasta Básica"
        >
          <div
            className="bg-surface rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-700 text-white px-6 py-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShoppingBasket size={28} className="shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-bold leading-tight">Canasta Básica</h3>
                  <p className="text-sm text-white/85">{formatPrice(35000)} · Un poco de todo</p>
                </div>
              </div>
              <button
                onClick={() => setCanastaOpen(false)}
                aria-label="Cerrar"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-150"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-muted mb-4">Esto es lo que incluye tu canasta:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {CANASTA_BASICA.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
                    <span className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-green-700" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border">
              <button
                onClick={() => setCanastaOpen(false)}
                className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-150 min-h-[48px]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
