import Image from "next/image";
import { Phone, AtSign, MapPin } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/despacho";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logo-smile.jpeg"
              alt="Smile Fruits"
              width={160}
              height={80}
              className="h-14 w-auto rounded-xl object-contain mb-3"
            />
            <p className="text-sm leading-relaxed">
              Frutas y verduras frescas directo a tu casa. Calidad garantizada
              para familias y empresas.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} aria-hidden="true" />
                <span>+56 9 5693 6847</span>
              </li>
              <li className="flex items-center gap-2">
                <AtSign size={14} aria-hidden="true" />
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" />
                <span>Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-3">
              Despacho
            </h4>
            <ul className="space-y-1 text-sm">
              <li>Particulares: sábado</li>
              <li>Empresas: martes, miércoles, viernes y sábado</li>
              <li>Horario: 9:00 – 17:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Smile Verdulería. Todos los derechos
            reservados.
          </p>
          <p className="mt-1">Desarrollado con IA · nico.agenteia</p>
        </div>
      </div>
    </footer>
  );
}
