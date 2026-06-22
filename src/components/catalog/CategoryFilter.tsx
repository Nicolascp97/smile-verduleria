"use client";

import { cn } from "@/lib/utils";
import type { Categoria } from "@/lib/supabase/types";

const CATEGORIAS: { value: Categoria | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "verduras", label: "Verduras" },
  { value: "frutas", label: "Frutas" },
  { value: "hierbas", label: "Hierbas" },
  { value: "legumbres_granos", label: "Legumbres" },
  { value: "huevos", label: "Huevos" },
  { value: "abarrotes", label: "Abarrotes" },
];

interface CategoryFilterProps {
  selected: Categoria | "todas";
  onChange: (cat: Categoria | "todas") => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
            "min-h-[44px] min-w-[44px]",
            selected === cat.value
              ? "bg-ink text-white shadow-sm"
              : "bg-surface text-muted hover:text-ink hover:bg-subtle border border-border"
          )}
          aria-pressed={selected === cat.value}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
