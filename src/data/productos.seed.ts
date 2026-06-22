import { slugify } from "@/lib/utils";

export interface ProductoSeed {
  nombre: string;
  slug: string;
  categoria: string;
  formato: string;
  formato_detalle: string | null;
  stock: number;
  precio_minorista: number | null;
  precio_mayorista: number | null;
  disponible_minorista: boolean;
  disponible_mayorista: boolean;
  imagen_url: string | null;
  destacado: boolean;
  activo: boolean;
}

const raw = [
  { nombre: "Ají Fresco", categoria: "verduras", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Ají Oro", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 18, destacado: false },
  { nombre: "Ajinomoto", categoria: "abarrotes", formato: "kilo", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Ajo", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Ajo", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Apio", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Arveja Partida", categoria: "legumbres_granos", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Betarraga", categoria: "verduras", formato: "paquete", formato_detalle: "5 unidades", stock: 5, destacado: false },
  { nombre: "Brócoli", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 213, destacado: true },
  { nombre: "Cebolla Grande", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 10, destacado: false },
  { nombre: "Cebolla Mediana", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 5, destacado: false },
  { nombre: "Cebolla Morada", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 5, destacado: false },
  { nombre: "Cebolla Morada Perla Grande", categoria: "verduras", formato: "malla", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Cebolla Vieja", categoria: "verduras", formato: "saco", formato_detalle: null, stock: 5, destacado: false },
  { nombre: "Cebollín Primera", categoria: "hierbas", formato: "docena", formato_detalle: null, stock: 55, destacado: true },
  { nombre: "Champiñón Mediano", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 6, destacado: false },
  { nombre: "Ciboulette", categoria: "hierbas", formato: "paquete", formato_detalle: "grande", stock: 2, destacado: false },
  { nombre: "Ciboulette", categoria: "hierbas", formato: "paquete", formato_detalle: "pequeño", stock: 4, destacado: false },
  { nombre: "Cilantro", categoria: "hierbas", formato: "paquete", formato_detalle: "pequeño", stock: 2, destacado: false },
  { nombre: "Cilantro", categoria: "hierbas", formato: "paquete", formato_detalle: "grande", stock: 6, destacado: false },
  { nombre: "Col China", categoria: "verduras", formato: "caja", formato_detalle: "6 unidades", stock: 2, destacado: false },
  { nombre: "Coliflor", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 114, destacado: true },
  { nombre: "Cuscús", categoria: "abarrotes", formato: "bolsa", formato_detalle: "500 gramos", stock: 1, destacado: false },
  { nombre: "Diente de Dragón", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Espinaca", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 7, destacado: false },
  { nombre: "Frutilla", categoria: "frutas", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Garbanzo", categoria: "legumbres_granos", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Huevos Extra Blanco", categoria: "huevos", formato: "bandeja", formato_detalle: "30 unidades", stock: 2, destacado: false },
  { nombre: "Huevos Extra Blanco", categoria: "huevos", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Jengibre", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Kiwi", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Lechuga Costina", categoria: "verduras", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Lechuga Costina", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 4, destacado: false },
  { nombre: "Lechuga Escarola", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Lenteja", categoria: "legumbres_granos", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Limón Amarillo", categoria: "frutas", formato: "malla", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Limón Sutil", categoria: "frutas", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Limón Sutil", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Limón Mediano", categoria: "frutas", formato: "malla", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Mango", categoria: "frutas", formato: "unidad", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Mango Brasilero Maduro", categoria: "frutas", formato: "caja", formato_detalle: null, stock: 10, destacado: false },
  { nombre: "Manzana Fuji", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 7, destacado: false },
  { nombre: "Mote", categoria: "abarrotes", formato: "kilo", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Naranja", categoria: "frutas", formato: "malla", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Pak Choi", categoria: "verduras", formato: "bolsa", formato_detalle: "400 gramos", stock: 2, destacado: false },
  { nombre: "Palta Hass Chilena", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 3.5, destacado: true },
  { nombre: "Papa Lavada Mediana", categoria: "verduras", formato: "saco", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Papa Mediana", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 24, destacado: true },
  { nombre: "Pepino Ensalada", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 4, destacado: false },
  { nombre: "Pera", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Perejil", categoria: "hierbas", formato: "paquete", formato_detalle: "grande", stock: 7, destacado: false },
  { nombre: "Pimentón Rojo", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 17, destacado: false },
  { nombre: "Pimentón Verde", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 23, destacado: false },
  { nombre: "Pimentón Rojo 3*", categoria: "verduras", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Piña Madura", categoria: "frutas", formato: "unidad", formato_detalle: null, stock: 5, destacado: false },
  { nombre: "Piña Pre-Madura Dulce", categoria: "frutas", formato: "caja", formato_detalle: "10 unidades", stock: 1, destacado: false },
  { nombre: "Plátano", categoria: "frutas", formato: "unidad", formato_detalle: null, stock: 25, destacado: true },
  { nombre: "Plátano", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Poroto Burro", categoria: "legumbres_granos", formato: "kilo", formato_detalle: null, stock: 2, destacado: false },
  { nombre: "Poroto Verde", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Repollo Crespo", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 131, destacado: true },
  { nombre: "Repollo Liso", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 7, destacado: false },
  { nombre: "Repollo Morado", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Salsa de Ostras", categoria: "abarrotes", formato: "bolsa", formato_detalle: "500 gramos", stock: 1, destacado: false },
  { nombre: "Tomate", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 12, destacado: false },
  { nombre: "Tomate", categoria: "verduras", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Tomate Cherry", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 1, destacado: false },
  { nombre: "Uva Sin Pepa", categoria: "frutas", formato: "kilo", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Zanahoria Grande", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 55, destacado: true },
  { nombre: "Zanahoria Grande", categoria: "verduras", formato: "saco", formato_detalle: null, stock: 3, destacado: false },
  { nombre: "Zanahoria Mediana", categoria: "verduras", formato: "kilo", formato_detalle: null, stock: 6, destacado: false },
  { nombre: "Zapallo Camote", categoria: "verduras", formato: "trozo", formato_detalle: "1 kilo", stock: 2, destacado: false },
  { nombre: "Zapallo Italiano", categoria: "verduras", formato: "unidad", formato_detalle: null, stock: 31, destacado: true },
  { nombre: "Zapallo Italiano 1*", categoria: "verduras", formato: "caja", formato_detalle: null, stock: 1, destacado: false },
];

function makeUniqueSlug(nombre: string, formato: string, detalle: string | null, index: number, existing: Set<string>): string {
  let base = slugify(nombre);
  if (detalle) base += `-${slugify(detalle)}`;
  else base += `-${slugify(formato)}`;

  let slug = base;
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  existing.add(slug);
  return slug;
}

export function getProductosSeed(): ProductoSeed[] {
  const slugs = new Set<string>();

  return raw.map((r, i) => ({
    nombre: r.nombre,
    slug: makeUniqueSlug(r.nombre, r.formato, r.formato_detalle, i, slugs),
    categoria: r.categoria,
    formato: r.formato,
    formato_detalle: r.formato_detalle,
    stock: r.stock,
    precio_minorista: null,
    precio_mayorista: null,
    disponible_minorista: true,
    disponible_mayorista: true,
    imagen_url: null,
    destacado: r.destacado,
    activo: true,
  }));
}
