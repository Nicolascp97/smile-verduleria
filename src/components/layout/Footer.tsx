import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-3">
              Smile
            </h3>
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
                <span>+56 9 0000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <span>contacto@smile.cl</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" />
                <span>Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-3">
              Horarios
            </h4>
            <ul className="space-y-1 text-sm">
              <li>Lunes a Viernes: 8:00 – 20:00</li>
              <li>Sábado: 8:00 – 18:00</li>
              <li>Domingo: Cerrado</li>
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
