import { User, CalendarDays, Clock, Truck, MapPin, Info } from "lucide-react";
import { DESPACHO_PARTICULARES } from "@/lib/despacho";
import { formatPrice } from "@/lib/utils";
import type { DespachoZona } from "@/lib/supabase/types";

interface Props {
  zonas?: DespachoZona[];
}

export function DespachoParticularesCard({ zonas }: Props) {
  const comunas = zonas && zonas.length > 0
    ? zonas.map((z) => z.nombre)
    : DESPACHO_PARTICULARES.comunas;

  return (
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
              {comunas.map((comuna) => (
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
  );
}
