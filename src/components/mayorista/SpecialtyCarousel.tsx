"use client";

import { cn } from "@/lib/utils";
import { FlagIcon, ESPECIALIDAD_FLAG } from "@/components/ui/FlagIcon";
import type { EspecialidadConConteo } from "@/lib/supabase/types";

interface SpecialtyCarouselProps {
  especialidades: EspecialidadConConteo[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function SpecialtyCarousel({
  especialidades,
  selected,
  onSelect,
}: SpecialtyCarouselProps) {
  if (especialidades.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
      <div className="flex gap-3 snap-x snap-mandatory">
        {/* Tarjeta "Todas" */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "snap-start shrink-0 min-w-[160px] sm:min-w-[200px] min-h-[88px] rounded-2xl px-5 py-4 flex items-center gap-3 transition-all duration-200 cursor-pointer",
            selected === null
              ? "ring-2 ring-white scale-105 shadow-lg"
              : "hover:scale-[1.02]"
          )}
          style={{
            background: selected === null
              ? "linear-gradient(135deg, #374151, #1F2937)"
              : "linear-gradient(135deg, #6B7280, #4B5563)",
          }}
        >
          <span className="text-2xl">🛒</span>
          <div className="text-left text-white">
            <span className="block font-semibold text-sm leading-tight">Todas</span>
            <span className="block text-xs opacity-80 mt-0.5">Ver todo</span>
          </div>
        </button>

        {/* Tarjetas de especialidades */}
        {especialidades.map((esp) => {
          const isActive = selected === esp.slug;
          return (
            <button
              key={esp.slug}
              onClick={() => onSelect(esp.slug)}
              className={cn(
                "snap-start shrink-0 min-w-[160px] sm:min-w-[200px] min-h-[88px] rounded-2xl px-5 py-4 flex items-center gap-3 transition-all duration-200 cursor-pointer",
                isActive
                  ? "ring-2 ring-white scale-105 shadow-lg"
                  : "hover:scale-[1.02]"
              )}
              style={{
                background: `linear-gradient(135deg, ${esp.color_from}, ${esp.color_to})`,
              }}
            >
              {ESPECIALIDAD_FLAG[esp.slug] ? (
                <FlagIcon code={ESPECIALIDAD_FLAG[esp.slug]} label={esp.nombre} size={28} />
              ) : (
                <span className="text-2xl">{esp.emoji}</span>
              )}
              <div className="text-left text-white">
                <span className="block font-semibold text-sm leading-tight">
                  {esp.nombre}
                </span>
                {esp.producto_count > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-[11px] font-medium">
                    {esp.producto_count} productos
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
