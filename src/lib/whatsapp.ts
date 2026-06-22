import type { CartItem } from "@/store/cart";
import { formatPrice } from "./utils";

interface PedidoData {
  items: CartItem[];
  total: number;
  clienteNombre: string;
  clienteTelefono: string;
  clienteDireccion: string;
  zonaEnvio: string;
  notas: string;
  tipo: "minorista" | "mayorista";
}

export function buildWhatsAppMessage(data: PedidoData): string {
  const lineas = data.items.map((item) => {
    const formato = item.producto.formato_detalle
      ? `${item.producto.formato} (${item.producto.formato_detalle})`
      : item.producto.formato;
    const precio =
      data.tipo === "mayorista"
        ? item.producto.precio_mayorista
        : item.producto.precio_minorista;
    return `• ${item.cantidad}x ${item.producto.nombre} (${formato}) — ${formatPrice(precio)}`;
  });

  const mensaje = [
    `*PEDIDO ${data.tipo.toUpperCase()} — SMILE*`,
    ``,
    `*Cliente:* ${data.clienteNombre}`,
    `*Teléfono:* ${data.clienteTelefono}`,
    data.clienteDireccion ? `*Dirección:* ${data.clienteDireccion}` : null,
    data.zonaEnvio ? `*Zona de envío:* ${data.zonaEnvio}` : null,
    ``,
    `*Productos:*`,
    ...lineas,
    ``,
    `*Total:* ${formatPrice(data.total)}`,
    data.notas ? `\n*Notas:* ${data.notas}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return mensaje;
}

export function getWhatsAppUrl(message: string): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO || "56900000000";
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
