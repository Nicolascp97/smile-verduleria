"use client";

import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn, precioPromocion } from "@/lib/utils";
import type { Producto, PromocionConProducto } from "@/lib/supabase/types";
import Image from "next/image";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  verduras: "/placeholders/verduras.svg",
  frutas: "/placeholders/frutas.svg",
  hierbas: "/placeholders/hierbas.svg",
  legumbres_granos: "/placeholders/legumbres.svg",
  huevos: "/placeholders/huevos.svg",
  abarrotes: "/placeholders/abarrotes.svg",
};

interface ProductCardProps {
  producto: Producto;
  tipo: "minorista" | "mayorista";
  promo?: PromocionConProducto;
}

export function ProductCard({ producto, tipo, promo }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.producto.id === producto.id);
  const cantidad = cartItem?.cantidad ?? 0;

  const precioBase =
    tipo === "mayorista"
      ? producto.precio_mayorista
      : producto.precio_minorista;

  // Si hay promo, el precio final viene del cálculo de oferta (solo minorista).
  const promoCalc =
    promo && tipo === "minorista"
      ? precioPromocion(promo, producto)
      : null;
  const precio = promoCalc ? promoCalc.precioFinal : precioBase;

  // Etiqueta de formato: la promo puede sobreescribirla.
  const formatoPromo =
    promo?.formato_etiqueta ||
    (promo?.cantidad ? `${promo.cantidad} ${producto.formato}` : null);
  const formatoDisplay = promo
    ? formatoPromo ?? producto.formato
    : producto.formato_detalle
      ? `${producto.formato} · ${producto.formato_detalle}`
      : producto.formato;

  const imageSrc = producto.imagen_url || PLACEHOLDER_IMAGES[producto.categoria] || "/placeholders/verduras.svg";

  const sinStock = producto.stock <= 0;

  // Producto que se agrega al carrito: con promo, refleja el precio de oferta
  // y la etiqueta de la promoción para el resumen del pedido.
  const productoCarrito: Producto = promoCalc
    ? {
        ...producto,
        precio_minorista: precio,
        formato_detalle: formatoPromo ?? producto.formato_detalle,
      }
    : producto;

  return (
    <article
      className={cn(
        "bg-surface rounded-2xl overflow-hidden border border-border",
        "hover:shadow-md transition-all duration-200",
        "flex flex-col",
        sinStock && "opacity-50"
      )}
    >
      <div className="relative aspect-square bg-subtle overflow-hidden">
        <Image
          src={imageSrc}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        {promo && (
          <span className="absolute top-2 left-2 bg-accent-warm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {promo.badge_texto || "Promoción"}
          </span>
        )}
        {promoCalc?.pctMostrar ? (
          <span className="absolute top-2 right-2 bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{promoCalc.pctMostrar}%
          </span>
        ) : sinStock ? (
          <span className="absolute top-2 right-2 bg-error text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Sin stock
          </span>
        ) : null}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-ink text-base leading-tight">
          {producto.nombre}
        </h3>
        <p className="text-sm text-muted mt-1 capitalize">{formatoDisplay}</p>

        <div className="mt-auto pt-3">
          {promoCalc && promoCalc.precioOriginal != null && promoCalc.precioOriginal !== precio ? (
            <div className="flex items-baseline gap-2">
              <p className="font-heading text-lg font-bold text-ink">
                {formatPrice(precio)}
              </p>
              <p className="text-sm text-muted line-through">
                {formatPrice(promoCalc.precioOriginal)}
              </p>
            </div>
          ) : (
            <p className="font-heading text-lg font-bold text-ink">
              {formatPrice(precio)}
            </p>
          )}

          {cantidad === 0 ? (
            <button
              onClick={() => !sinStock && addItem(productoCarrito, tipo)}
              disabled={sinStock}
              className={cn(
                "mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-150",
                "min-h-[44px]",
                sinStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-600 active:scale-[0.97]"
              )}
              aria-label={`Agregar ${producto.nombre} al carrito`}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              Agregar
            </button>
          ) : (
            <div className="mt-2 flex items-center justify-between bg-subtle rounded-xl p-1">
              <button
                onClick={() =>
                  cantidad === 1
                    ? removeItem(producto.id)
                    : updateQuantity(producto.id, cantidad - 1)
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-150"
                aria-label={`Disminuir cantidad de ${producto.nombre}`}
              >
                <Minus size={18} />
              </button>
              <span className="font-semibold text-ink min-w-[32px] text-center">
                {cantidad}
              </span>
              <button
                onClick={() => updateQuantity(producto.id, cantidad + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-150"
                aria-label={`Aumentar cantidad de ${producto.nombre}`}
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
