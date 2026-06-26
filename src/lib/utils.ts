import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Promocion, Producto } from "@/lib/supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return "Precio pendiente";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Calcula el precio de una promoción a partir del producto base.
 * - Si la promo trae `precio_oferta`, ese es el precio final.
 * - Si no, y trae `descuento_pct`, se aplica sobre `precio_minorista`.
 * `pctMostrar` es el porcentaje a mostrar en el badge (calculado si hace falta).
 */
export function precioPromocion(
  promo: Pick<Promocion, "descuento_pct" | "precio_oferta">,
  producto: Pick<Producto, "precio_minorista">
): { precioFinal: number | null; precioOriginal: number | null; pctMostrar: number | null } {
  const precioOriginal = producto.precio_minorista;

  if (promo.precio_oferta != null) {
    const pctMostrar =
      precioOriginal && precioOriginal > 0
        ? Math.round((1 - promo.precio_oferta / precioOriginal) * 100)
        : null;
    return {
      precioFinal: promo.precio_oferta,
      precioOriginal,
      pctMostrar: pctMostrar && pctMostrar > 0 ? pctMostrar : null,
    };
  }

  if (promo.descuento_pct != null && precioOriginal != null) {
    return {
      precioFinal: Math.round(precioOriginal * (1 - promo.descuento_pct / 100)),
      precioOriginal,
      pctMostrar: Math.round(promo.descuento_pct),
    };
  }

  // Sin descuento válido: se muestra el precio base sin rebaja.
  return { precioFinal: precioOriginal, precioOriginal, pctMostrar: null };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
