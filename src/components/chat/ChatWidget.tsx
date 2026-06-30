"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Plus, ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/store/cart";
import type { Producto } from "@/lib/supabase/types";

interface Message {
  role: "user" | "assistant";
  content: string; // lo que se envía a la API
  displayText?: string; // lo que se muestra (si difiere del content)
  products?: Producto[]; // tarjetas tocables bajo el mensaje
  addedToCart?: { nombre: string; cantidad: number; formato: string }[];
}

// Placeholder por categoría cuando el producto no tiene foto
const PLACEHOLDER_CAT: Record<string, string> = {
  verduras: "verduras",
  frutas: "frutas",
  hierbas: "hierbas",
  legumbres_granos: "legumbres",
  huevos: "huevos",
  abarrotes: "abarrotes",
};

function imagenProducto(p: Producto): string {
  if (p.imagen_url) return p.imagen_url;
  const cat = PLACEHOLDER_CAT[p.categoria] ?? "verduras";
  return `/placeholders/${cat}.svg`;
}

function ProductMiniCard({ producto, onAdd }: { producto: Producto; onAdd: () => void }) {
  const sinPrecio = !producto.precio_minorista || producto.precio_minorista <= 0;
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full flex items-center gap-3 bg-white border border-border rounded-xl p-2 mt-2 text-left hover:border-green-600 hover:bg-green-50/50 transition-colors duration-150 group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenProducto(producto)}
        alt={producto.nombre}
        width={44}
        height={44}
        className="w-11 h-11 rounded-lg object-cover bg-subtle shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{producto.nombre}</p>
        <p className="text-xs text-green-700 font-medium">
          {sinPrecio ? "Precio a confirmar" : `${formatPrice(producto.precio_minorista!)} / ${producto.formato}`}
        </p>
      </div>
      <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 group-hover:bg-green-200 rounded-full px-2.5 py-1.5 transition-colors duration-150">
        <Plus size={13} strokeWidth={3} />
        Agregar
      </span>
    </button>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.cantidad, 0)
  );
  const bubbleTriggered = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (bubbleTriggered.current) return;

    const timer = setTimeout(() => {
      if (!bubbleTriggered.current) {
        bubbleTriggered.current = true;
        setShowBubble(true);
      }
    }, 3000);

    const onScroll = () => {
      if (!bubbleTriggered.current && window.scrollY > 100) {
        bubbleTriggered.current = true;
        setShowBubble(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // La burbuja se esconde sola unos segundos después de aparecer
  useEffect(() => {
    if (!showBubble) return;
    const timer = setTimeout(() => setShowBubble(false), 8000);
    return () => clearTimeout(timer);
  }, [showBubble]);

  // Se oculta cuando hay un popup/modal abierto (para no tapar contenido)
  const [hiddenByModal, setHiddenByModal] = useState(false);
  useEffect(() => {
    const onOpen = () => setHiddenByModal(true);
    const onClose = () => setHiddenByModal(false);
    window.addEventListener("smile:modal-open", onOpen);
    window.addEventListener("smile:modal-close", onClose);
    return () => {
      window.removeEventListener("smile:modal-open", onOpen);
      window.removeEventListener("smile:modal-close", onClose);
    };
  }, []);

  // Suma una cantidad al carrito sumando sobre lo que ya exista
  const sumarAlCarrito = (producto: Producto, cantidad: number) => {
    const { items, addItem, updateQuantity } = useCartStore.getState();
    const existing = items.find((i) => i.producto.id === producto.id);
    if (existing) {
      updateQuantity(producto.id, existing.cantidad + cantidad);
    } else {
      addItem(producto, "mayorista");
      if (cantidad > 1) updateQuantity(producto.id, cantidad);
    }
  };

  // El cliente tocó una tarjeta de producto
  const handleSelectProduct = (producto: Producto) => {
    sumarAlCarrito(producto, 1);
    sendMessage(`[agregué: ${producto.nombre}]`, `🛒 Agregué ${producto.nombre} al carrito`);
  };

  const sendMessage = async (apiText: string, displayText?: string) => {
    if (loading) return;

    const userMessage: Message = {
      role: "user",
      content: apiText,
      ...(displayText ? { displayText } : {}),
    };

    // Para la API solo importan role + content de todo el historial
    const history = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("Error en la respuesta");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let assistantText = "";

      // Mensaje del asistente que iremos completando
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Adjunta datos al último mensaje (el del asistente en curso)
      const patchLast = (patch: Partial<Message>) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, ...patch };
          return updated;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "text") {
              assistantText += data.content;
              patchLast({ content: assistantText });
            } else if (data.type === "products") {
              const productos = data.productos as Producto[];
              patchLast({ products: productos });
            } else if (data.type === "cart_action") {
              const agregados = data.agregados as { producto: Producto; cantidad: number }[];
              agregados.forEach(({ producto, cantidad }) => sumarAlCarrito(producto, cantidad));
              patchLast({
                addedToCart: agregados.map(({ producto, cantidad }) => ({
                  nombre: producto.nombre,
                  cantidad,
                  formato: producto.formato,
                })),
              });
            }
          } catch {
            // línea incompleta, ignorar
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          displayText: "Lo siento, hubo un error. ¿Puedes intentar de nuevo?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    sendMessage(text);
  };

  if (hiddenByModal) return null;

  return (
    <>
      {/* Botones flotantes — WhatsApp + personaje Smile */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showBubble && (
            <div className="bg-surface rounded-2xl rounded-br-sm shadow-md border border-border px-4 py-2.5 max-w-[200px] animate-bubble-in">
              <p className="text-sm font-medium text-ink leading-snug">
                ¿Te ayudo con tu pedido?
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            {/* Botón WhatsApp */}
            <a
              href={getWhatsAppUrl("¡Hola Smile! Quiero hacer una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform duration-150"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.672 4.831 1.846 6.84L2 30l7.338-1.822A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5c-2.32 0-4.484-.65-6.32-1.773l-.453-.27-4.354 1.082 1.104-4.244-.296-.464A11.47 11.47 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.61c-.345-.173-2.04-1.006-2.356-1.12-.315-.115-.544-.173-.773.173-.23.345-.889 1.12-1.09 1.35-.2.23-.4.26-.745.086-.345-.173-1.455-.536-2.77-1.71-1.023-.912-1.714-2.04-1.914-2.385-.2-.345-.022-.531.15-.703.156-.155.345-.403.517-.604.173-.2.23-.345.345-.575.115-.23.058-.432-.029-.604-.086-.173-.773-1.862-1.06-2.55-.278-.668-.56-.577-.773-.587-.2-.01-.43-.012-.66-.012-.23 0-.604.086-.92.432-.316.345-1.204 1.177-1.204 2.867 0 1.69 1.233 3.322 1.405 3.552.173.23 2.428 3.708 5.886 5.198.823.355 1.465.567 1.965.726.826.263 1.578.226 2.172.137.662-.099 2.04-.834 2.327-1.639.287-.804.287-1.493.2-1.637-.086-.144-.316-.23-.66-.403z"/>
              </svg>
            </a>
            {/* Botón Smile */}
            <button
              onClick={() => setOpen(true)}
              className="group relative w-16 h-16 active:scale-90 transition-transform duration-150 cursor-pointer animate-smile-bounce"
              aria-label="Abrir chat de asistencia"
            >
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                {/* Sombra suave */}
                <ellipse cx="40" cy="74" rx="22" ry="4" fill="#000" opacity="0.08" />
                {/* Cuerpo — naranja cálida */}
                <circle cx="40" cy="42" r="28" fill="#F97316" />
                <circle cx="40" cy="42" r="28" fill="url(#smileGrad)" />
                {/* Brillo */}
                <ellipse cx="32" cy="32" rx="10" ry="8" fill="white" opacity="0.18" transform="rotate(-20 32 32)" />
                {/* Hojitas */}
                <path d="M40 14 C38 8 42 2 48 4 C46 10 44 14 40 14Z" fill="#059669" />
                <path d="M40 14 C36 10 30 6 28 8 C30 12 36 14 40 14Z" fill="#10B981" />
                {/* Tallo */}
                <rect x="39" y="12" width="2.5" height="5" rx="1" fill="#065F46" />
                {/* Ojos */}
                <circle cx="32" cy="40" r="3.5" fill="#1C1917" />
                <circle cx="48" cy="40" r="3.5" fill="#1C1917" />
                {/* Brillitos ojos */}
                <circle cx="33.5" cy="38.5" r="1.2" fill="white" />
                <circle cx="49.5" cy="38.5" r="1.2" fill="white" />
                {/* Sonrisa grande — Smile! */}
                <path d="M30 49 Q34 57 40 57 Q46 57 50 49" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Mejillas rosadas */}
                <circle cx="26" cy="48" r="4" fill="#FB923C" opacity="0.5" />
                <circle cx="54" cy="48" r="4" fill="#FB923C" opacity="0.5" />
                {/* Gradiente */}
                <defs>
                  <radialGradient id="smileGrad" cx="0.4" cy="0.35" r="0.65">
                    <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Panel de chat */}
      {open && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)]",
            "bg-surface rounded-2xl shadow-lg border border-border",
            "flex flex-col overflow-hidden",
            "animate-fade-in"
          )}
          role="dialog"
          aria-modal="false"
          aria-label="Chat de asistencia Smile"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-700 text-white rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 80 80" fill="none" className="w-7 h-7 shrink-0" aria-hidden="true">
                <circle cx="40" cy="42" r="28" fill="#F97316" />
                <path d="M40 14 C38 8 42 2 48 4 C46 10 44 14 40 14Z" fill="#34D399" />
                <path d="M40 14 C36 10 30 6 28 8 C30 12 36 14 40 14Z" fill="#6EE7B7" />
                <rect x="39" y="12" width="2.5" height="5" rx="1" fill="#065F46" />
                <circle cx="32" cy="40" r="3" fill="#1C1917" />
                <circle cx="48" cy="40" r="3" fill="#1C1917" />
                <circle cx="33.2" cy="38.8" r="1" fill="white" />
                <circle cx="49.2" cy="38.8" r="1" fill="white" />
                <path d="M30 49 Q34 57 40 57 Q46 57 50 49" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
              <span className="font-heading font-semibold text-sm">
                Smile
              </span>
            </div>
            <div className="flex items-center gap-1">
              {itemCount > 0 && (
                <button
                  onClick={openCart}
                  className="relative p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-150"
                  aria-label="Ver carrito"
                >
                  <ShoppingCart size={18} />
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-warm text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-150"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex items-start">
                <div className="max-w-[85%] bg-subtle text-ink rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed">
                  ¡Hola! Soy Smile 🥬 Cuéntame qué necesitas y te ayudo a armar tu pedido al tiro.
                </div>
              </div>
            )}
            {messages.map((msg, i) => {
              const text = msg.displayText ?? msg.content;
              const isUser = msg.role === "user";
              return (
                <div key={i} className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
                  {(text || (!isUser && !msg.products)) && (
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isUser
                          ? "bg-green-700 text-white rounded-br-md"
                          : "bg-subtle text-ink rounded-bl-md"
                      )}
                    >
                      {text || <Loader2 size={16} className="animate-spin text-muted" />}
                    </div>
                  )}

                  {/* Tarjetas de producto tocables */}
                  {!isUser && msg.products && msg.products.length > 0 && (
                    <div className="w-[90%] max-w-[85%]">
                      {msg.products.map((p) => (
                        <ProductMiniCard
                          key={p.id}
                          producto={p}
                          onAdd={() => handleSelectProduct(p)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Confirmación de agregado */}
                  {!isUser && msg.addedToCart && msg.addedToCart.length > 0 && (
                    <div className="mt-2 max-w-[85%] bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <p className="text-[11px] font-bold text-green-700 uppercase tracking-wide mb-0.5">
                        ✓ Agregado al carrito
                      </p>
                      {msg.addedToCart.map((it, k) => (
                        <p key={k} className="text-xs text-ink">
                          {it.nombre} × {it.cantidad}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-start">
                <div className="bg-subtle rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-muted" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                disabled={loading}
                aria-label="Mensaje"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-150",
                  "min-w-[44px] min-h-[44px] flex items-center justify-center",
                  loading || !input.trim()
                    ? "bg-gray-200 text-gray-400"
                    : "bg-green-700 text-white hover:bg-green-600 active:scale-95"
                )}
                aria-label="Enviar mensaje"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
