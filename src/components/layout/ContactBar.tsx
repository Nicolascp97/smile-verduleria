"use client";

import { Clock, Phone, MapPin } from "lucide-react";

export function ContactBar() {
  return (
    <div className="bg-subtle text-muted text-sm py-2 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        <span className="flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" />
          <span>Lun-Sáb 8:00–20:00</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Phone size={14} aria-hidden="true" />
          <a
            href="tel:+56900000000"
            className="hover:text-ink transition-colors duration-150"
          >
            +56 9 0000 0000
          </a>
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} aria-hidden="true" />
          <span>Despacho Región Metropolitana</span>
        </span>
      </div>
    </div>
  );
}
