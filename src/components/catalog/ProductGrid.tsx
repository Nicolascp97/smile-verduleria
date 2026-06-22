"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import type { Producto, Categoria } from "@/lib/supabase/types";

interface ProductGridProps {
  productos: Producto[];
  tipo: "minorista" | "mayorista";
}

export function ProductGrid({ productos, tipo }: ProductGridProps) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");

  const filtrados = useMemo(() => {
    let result = productos;
    if (categoria !== "todas") {
      result = result.filter((p) => p.categoria === categoria);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
      );
    }
    return result;
  }, [productos, busqueda, categoria]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar value={busqueda} onChange={setBusqueda} />
      </div>

      <div className="mb-6">
        <CategoryFilter selected={categoria} onChange={setCategoria} />
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-lg">
            No encontramos productos con esa búsqueda.
          </p>
          <button
            onClick={() => {
              setBusqueda("");
              setCategoria("todas");
            }}
            className="mt-3 text-green-700 underline hover:text-green-600 transition-colors duration-150"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtrados.map((p) => (
            <ProductCard key={p.id} producto={p} tipo={tipo} />
          ))}
        </div>
      )}
    </div>
  );
}
