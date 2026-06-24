"use client";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Building2, Truck, Package, Clock, CalendarDays, MapPin } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import type { Producto, DescuentoVolumen } from "@/lib/supabase/types";

interface CatalogoMayoristaProps {
  productos: Producto[];
  descuentos: DescuentoVolumen[];
}

export function CatalogoMayorista({
  productos,
  descuentos,
}: CatalogoMayoristaProps) {
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
              <span className="text-sm">Reparto martes, miércoles y viernes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Días y zonas de despacho */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-ink mb-6">
          Días y zonas de despacho
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {DESPACHO_EMPRESAS.rutas.map((ruta) => (
            <div
              key={ruta.dias}
              className="bg-surface rounded-2xl border border-border p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={20} className="text-green-700 shrink-0" />
                <h3 className="font-heading font-semibold text-ink">
                  {ruta.dias}
                </h3>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted shrink-0 mt-0.5" />
                <p className="text-sm text-muted">{ruta.comunas.join(" · ")}</p>
              </div>
            </div>
          ))}
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

      {/* Tabla de descuentos */}
      <section className="max-w-7xl mx-auto px-4 py-12 pt-0">
        <h2 className="font-heading text-2xl font-bold text-ink mb-6">
          Descuentos por volumen
        </h2>

        {descuentos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="py-3 px-4 font-heading font-semibold text-ink">
                    Monto mínimo
                  </th>
                  <th className="py-3 px-4 font-heading font-semibold text-ink">
                    Descuento
                  </th>
                  <th className="py-3 px-4 font-heading font-semibold text-ink">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {descuentos.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-border hover:bg-subtle transition-colors duration-150"
                  >
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                      }).format(d.min_monto)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-700">
                      {d.descuento_pct}%
                    </td>
                    <td className="py-3 px-4 text-muted">
                      {d.descripcion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-subtle rounded-xl p-6 max-w-2xl">
            <p className="text-muted">
              Los descuentos por volumen serán configurados próximamente.
              Consulta directamente por WhatsApp para cotizaciones mayoristas.
            </p>
          </div>
        )}

        {/* Tabla de equivalencias de formatos */}
        <div className="mt-10">
          <h3 className="font-heading text-xl font-semibold text-ink mb-4">
            Equivalencias de formatos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="py-3 px-4 font-heading font-semibold text-ink">
                    Formato
                  </th>
                  <th className="py-3 px-4 font-heading font-semibold text-ink">
                    Equivalencia aproximada
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["Caja", "Varía por producto (6–30 unidades)"],
                  ["Saco", "20–50 kg según producto"],
                  ["Malla", "5–15 kg según producto"],
                  ["Bandeja", "30 unidades (huevos)"],
                  ["Docena", "12 unidades"],
                  ["Paquete", "Variable (ver detalle del producto)"],
                ].map(([formato, equiv]) => (
                  <tr
                    key={formato}
                    className="border-b border-border hover:bg-subtle transition-colors duration-150"
                  >
                    <td className="py-3 px-4 font-medium">{formato}</td>
                    <td className="py-3 px-4 text-muted">{equiv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Catálogo mayorista */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
          Productos disponibles
        </h2>
        <ProductGrid productos={productos} tipo="mayorista" />
      </section>
    </div>
  );
}
