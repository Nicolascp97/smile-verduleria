"use client";

import Image from "next/image";

const CLIENTES = [
  { nombre: "Café Lucerna", logo: "/cafe-lucerna.jpeg" },
  { nombre: "Casa China", logo: "/casa-china.jpeg" },
  { nombre: "Punta Brasa", logo: "/punto-brasa.jpeg" },
];

export function ClientMarquee() {
  // Duplicamos la lista para que el scroll sea continuo sin cortes
  const items = [...CLIENTES, ...CLIENTES, ...CLIENTES, ...CLIENTES];

  return (
    <section className="bg-ink py-8 md:py-10 overflow-hidden">
      <p className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-6">
        Confían en nosotros
      </p>

      <div className="relative">
        {/* Gradientes laterales para efecto de fade */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee items-center gap-12 md:gap-20 w-max">
          {items.map((cliente, i) => (
            <div
              key={`${cliente.nombre}-${i}`}
              className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-3"
            >
              <Image
                src={cliente.logo}
                alt={cliente.nombre}
                width={120}
                height={120}
                className="object-contain rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
