"use client";

import { X, Trash2, Minus, Plus, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { DESPACHO_PARTICULARES } from "@/lib/despacho";
import { useState } from "react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    clienteNombre,
    clienteTelefono,
    clienteDireccion,
    zonaEnvio,
    notas,
    setClienteNombre,
    setClienteTelefono,
    setClienteDireccion,
    setZonaEnvio,
    setNotas,
  } = useCartStore();

  const [enviando, setEnviando] = useState(false);
  const total = getTotal();

  const handleEnviarWhatsApp = async () => {
    if (!clienteNombre.trim() || !clienteTelefono.trim()) return;

    setEnviando(true);

    try {
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "minorista",
          cliente_nombre: clienteNombre,
          cliente_telefono: clienteTelefono,
          cliente_direccion: clienteDireccion || null,
          zona_envio: zonaEnvio || null,
          items: items.map((i) => ({
            producto_id: i.producto.id,
            nombre: i.producto.nombre,
            formato: i.producto.formato,
            cantidad: i.cantidad,
            precio_unit: i.producto.precio_minorista ?? 0,
            subtotal: (i.producto.precio_minorista ?? 0) * i.cantidad,
          })),
          total,
          notas: notas || null,
          canal: "web",
        }),
      });
    } catch {
      // El pedido se guardará en WhatsApp de todas formas
    }

    const mensaje = buildWhatsAppMessage({
      items,
      total,
      clienteNombre,
      clienteTelefono,
      clienteDireccion,
      zonaEnvio,
      notas,
      tipo: "minorista",
    });

    window.open(getWhatsAppUrl(mensaje), "_blank");
    clearCart();
    closeCart();
    setEnviando(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface z-50 flex flex-col animate-slide-in-right shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-xl font-bold text-ink">
            Tu Pedido
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-subtle transition-colors duration-150"
            aria-label="Cerrar carrito"
          >
            <X size={24} className="text-ink" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="mt-3 text-green-700 underline hover:text-green-600"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex items-center gap-3 bg-subtle rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">
                      {item.producto.nombre}
                    </p>
                    <p className="text-xs text-muted capitalize">
                      {item.producto.formato}
                    </p>
                    <p className="text-sm font-semibold text-ink mt-0.5">
                      {formatPrice(
                        (item.producto.precio_minorista ?? 0) * item.cantidad
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        item.cantidad === 1
                          ? removeItem(item.producto.id)
                          : updateQuantity(
                              item.producto.id,
                              item.cantidad - 1
                            )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-150"
                      aria-label="Menos"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.producto.id, item.cantidad + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-150"
                      aria-label="Más"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.producto.id)}
                    className="p-1.5 text-error/60 hover:text-error transition-colors duration-150"
                    aria-label={`Eliminar ${item.producto.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="font-heading font-semibold text-ink">
                  Datos para el pedido
                </h3>
                <div>
                  <label htmlFor="cart-nombre" className="text-sm font-medium text-ink block mb-1">
                    Nombre *
                  </label>
                  <input
                    id="cart-nombre"
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-green-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cart-telefono" className="text-sm font-medium text-ink block mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="cart-telefono"
                    type="tel"
                    value={clienteTelefono}
                    onChange={(e) => setClienteTelefono(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-green-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cart-direccion" className="text-sm font-medium text-ink block mb-1">
                    Dirección
                  </label>
                  <input
                    id="cart-direccion"
                    type="text"
                    value={clienteDireccion}
                    onChange={(e) => setClienteDireccion(e.target.value)}
                    placeholder="Calle, número, comuna"
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="cart-zona" className="text-sm font-medium text-ink block mb-1">
                    Comuna de despacho
                  </label>
                  <select
                    id="cart-zona"
                    value={zonaEnvio}
                    onChange={(e) => setZonaEnvio(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-green-600 bg-surface"
                  >
                    <option value="">Seleccionar comuna</option>
                    {DESPACHO_PARTICULARES.comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1.5 flex items-start gap-1">
                    <span aria-hidden="true">🚚</span>
                    Despacho a domicilio los <strong>{DESPACHO_PARTICULARES.dia.toLowerCase()}s</strong> ·{" "}
                    {formatPrice(DESPACHO_PARTICULARES.costo)}
                  </p>
                </div>
                <div>
                  <label htmlFor="cart-notas" className="text-sm font-medium text-ink block mb-1">
                    Notas
                  </label>
                  <textarea
                    id="cart-notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Indicaciones especiales..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-green-600 resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-heading text-lg font-bold text-ink">
                Total
              </span>
              <span className="font-heading text-xl font-bold text-ink">
                {formatPrice(total)}
              </span>
            </div>

            <button
              onClick={handleEnviarWhatsApp}
              disabled={
                enviando || !clienteNombre.trim() || !clienteTelefono.trim()
              }
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-150",
                "min-h-[48px]",
                enviando || !clienteNombre.trim() || !clienteTelefono.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-600 active:scale-[0.97]"
              )}
            >
              <MessageCircle size={20} aria-hidden="true" />
              {enviando ? "Enviando..." : "Enviar pedido por WhatsApp"}
            </button>

            {(!clienteNombre.trim() || !clienteTelefono.trim()) && (
              <p className="text-xs text-error text-center">
                Completa nombre y teléfono para enviar
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
