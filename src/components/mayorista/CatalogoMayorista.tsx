"use client";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Building2, Truck, Package, BadgePercent } from "lucide-react";
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
            Restaurantes, minimarkets y casinos. Productos por caja, saco y
            malla con precios diferenciados y descuentos por volumen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <Package size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">Formatos por caja, saco y malla</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <BadgePercent size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">Descuentos por volumen</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <Truck size={20} className="text-green-500 shrink-0" />
              <span className="text-sm">Despacho coordinado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla de descuentos */}
      <section className="max-w-7xl mx-auto px-4 py-12">
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
