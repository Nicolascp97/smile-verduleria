import { Building2, CalendarDays, MapPin, Clock, Truck, MessageCircle } from "lucide-react";
import { DESPACHO_EMPRESAS } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import type { DespachoZona } from "@/lib/supabase/types";

interface Props {
  zonas?: DespachoZona[];
}

export function DespachoEmpresasCard({ zonas }: Props) {
  const comunas = zonas && zonas.length > 0
    ? zonas.map((z) => z.nombre)
    : DESPACHO_EMPRESAS.comunas;

  return (
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
              {comunas.map((comuna) => (
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
  );
}
