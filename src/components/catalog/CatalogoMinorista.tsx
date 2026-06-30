"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProductGrid } from "./ProductGrid";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { Truck, User, ShoppingBasket, X, Check, MessageCircle } from "lucide-react";
import { FlagIcon } from "@/components/ui/FlagIcon";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ClientMarquee } from "@/components/layout/ClientMarquee";
import { DespachoEmpresasCard } from "./DespachoEmpresasCard";
import type { Producto, PromocionConProducto, CanastaConItems, DespachoZona } from "@/lib/supabase/types";

// Arma el mensaje de WhatsApp con el detalle de una canasta
function mensajeCanastaWhatsApp(canasta: CanastaConItems): string {
  const lineas = canasta.items.map((it) => {
    const nombre = it.producto?.nombre ?? "Producto";
    return it.cantidad ? `• ${nombre} — ${it.cantidad}` : `• ${nombre}`;
  });
  return [
    `*PEDIDO — SMILE* 🧺`,
    ``,
    `¡Hola! Quiero pedir la *${canasta.nombre}* (${formatPrice(canasta.precio)}).`,
    ``,
    `*Incluye:*`,
    ...lineas,
    ``,
    `*Total:* ${formatPrice(canasta.precio)}`,
  ].join("\n");
}

interface CatalogoMinoristaProps {
  productos: Producto[];
  promociones: PromocionConProducto[];
  canastas: CanastaConItems[];
  zonas?: DespachoZona[];
}

export function CatalogoMinorista({ productos, promociones, canastas, zonas }: CatalogoMinoristaProps) {
  const [canastaSel, setCanastaSel] = useState<CanastaConItems | null>(null);

  // Mientras el popup esté abierto, avisa al chat flotante para que se oculte
  useEffect(() => {
    if (!canastaSel) return;
    window.dispatchEvent(new Event("smile:modal-open"));
    return () => {
      window.dispatchEvent(new Event("smile:modal-close"));
    };
  }, [canastaSel]);

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
            <Link
              href="/mayorista?cat=chilena"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <FlagIcon code="cl" label="Bandera de Chile" size={32} />
              <span className="font-semibold text-ink text-sm text-center">Gastronomía Chilena</span>
            </Link>
            <Link
              href="/mayorista?cat=china"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <FlagIcon code="cn" label="Bandera de China" size={32} />
              <span className="font-semibold text-ink text-sm text-center">Gastronomía China Coreana</span>
            </Link>
            <Link
              href="/mayorista?cat=peruana"
              className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <FlagIcon code="pe" label="Bandera de Perú" size={32} />
              <span className="font-semibold text-ink text-sm text-center">Gastronomía Peruana</span>
            </Link>
          </div>

          {/* Canastas predeterminadas (debajo de Particular) */}
          {canastas.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
              {canastas.map((canasta) => (
                <button
                  key={canasta.id}
                  type="button"
                  onClick={() => setCanastaSel(canasta)}
                  className="bg-white/90 backdrop-blur-sm border-2 border-green-700 rounded-2xl px-6 py-5 flex items-center gap-4 flex-1 shadow-sm text-left hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <ShoppingBasket size={32} className="text-green-700 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-ink text-sm">{canasta.nombre}</p>
                    <p className="text-xs text-muted">
                      {canasta.descripcion ? `${canasta.descripcion} · ` : ""}
                      <span className="text-green-700 font-semibold">Ver detalle</span>
                    </p>
                    <p className="font-bold text-green-700 text-lg mt-1">{formatPrice(canasta.precio)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
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
        <ProductGrid productos={productos} tipo="mayorista" />
      </section>

      {/* Popup detalle de canasta */}
      {canastaSel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setCanastaSel(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${canastaSel.nombre}`}
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
                  <h3 className="font-heading text-xl font-bold leading-tight">{canastaSel.nombre}</h3>
                  <p className="text-sm text-white/85">
                    {formatPrice(canastaSel.precio)}
                    {canastaSel.descripcion ? ` · ${canastaSel.descripcion}` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCanastaSel(null)}
                aria-label="Cerrar"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-150"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-muted mb-4">Esto es lo que incluye tu canasta:</p>
              {canastaSel.items.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {canastaSel.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2.5 text-sm text-ink">
                      <span className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Check size={14} className="text-green-700" />
                      </span>
                      <span>
                        {item.producto?.nombre ?? "Producto"}
                        {item.cantidad ? ` — ${item.cantidad}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted italic">Pronto detallaremos el contenido de esta canasta.</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex flex-col gap-2">
              <a
                href={getWhatsAppUrl(mensajeCanastaWhatsApp(canastaSel))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCanastaSel(null)}
                className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-150 min-h-[48px] flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Pedir canasta por WhatsApp
              </a>
              <button
                onClick={() => setCanastaSel(null)}
                className="w-full text-muted py-2 rounded-xl font-medium hover:bg-subtle transition-colors duration-150 text-sm min-h-[40px]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
