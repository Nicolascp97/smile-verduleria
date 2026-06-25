// Información de despacho de Smile — fuente única de verdad.
// La usan el carrito, los banners, la página mayorista y el agente IA.

export const DESPACHO_PARTICULARES = {
  dia: "Sábado",
  horario: "9:00 a 17:00",
  costo: 2990,
  // Pendiente de confirmar: anticipación del pedido para particulares.
  comunas: [
    "Huechuraba",
    "Recoleta",
    "Ñuñoa",
    "Providencia",
    "Las Condes",
    "Vitacura",
    "Santiago Centro",
  ],
} as const;

export const DESPACHO_EMPRESAS = {
  perfiles: "Restaurantes, cafeterías, procesadoras de alimentos y residencias de ancianos",
  horario: "9:00 a 17:00",
  despachoGratisDesde: 50000,
  anticipacion: "El pedido se hace con 1 día de anticipación, antes de las 15:00",
  dias: "Martes, miércoles, jueves y sábado",
  comunas: [
    "Huechuraba",
    "Recoleta",
    "Conchalí",
    "La Cisterna",
    "La Florida",
    "Puente Alto",
    "Santiago Centro",
    "Providencia",
    "Las Condes",
  ],
} as const;

export const INSTAGRAM_URL = "https://www.instagram.com/smile.verdurasenruta";
export const INSTAGRAM_HANDLE = "@smile.verdurasenruta";
