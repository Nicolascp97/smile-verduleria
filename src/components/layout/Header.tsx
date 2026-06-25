"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Settings } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface sticky top-0 z-40 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-smile.jpeg"
            alt="Smile Fruits"
            width={120}
            height={60}
            className="h-10 w-auto rounded-lg object-contain"
            priority
          />
        </Link>

        <nav
          className={cn(
            "max-md:absolute max-md:top-16 max-md:left-0 max-md:right-0 max-md:bg-surface max-md:border-b max-md:border-border max-md:shadow-md max-md:p-4",
            "md:flex md:items-center md:gap-6",
            menuOpen ? "block" : "max-md:hidden"
          )}
        >
          <Link
            href="/"
            className="block py-2 md:py-0 text-ink hover:text-green-700 font-medium transition-colors duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/mayorista"
            className="block py-2 md:py-0 text-ink hover:text-green-700 font-medium transition-colors duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Mayorista
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/pedidos"
            className="p-2 rounded-lg hover:bg-subtle transition-colors duration-150"
            aria-label="Panel de administración"
          >
            <Settings size={22} className="text-muted" />
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 rounded-lg hover:bg-subtle transition-colors duration-150"
            aria-label={`Carrito de compras, ${itemCount} productos`}
          >
            <ShoppingCart size={24} className="text-ink" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-subtle transition-colors duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? (
              <X size={24} className="text-ink" />
            ) : (
              <Menu size={24} className="text-ink" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
