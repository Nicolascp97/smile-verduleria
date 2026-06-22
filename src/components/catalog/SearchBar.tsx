"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Buscar productos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-surface text-ink placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all duration-150 text-base"
        aria-label="Buscar productos"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-subtle transition-colors duration-150"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} className="text-muted" />
        </button>
      )}
    </div>
  );
}
