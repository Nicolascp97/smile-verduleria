"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();
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

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Error en la respuesta");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            } else if (data.type === "cart_action") {
              // El agente agregó algo al carrito — handled on client via Zustand
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
          content: "Lo siento, hubo un error. ¿Puedes intentar de nuevo?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante — personaje Smile */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showBubble && (
            <div className="bg-surface rounded-2xl rounded-br-sm shadow-md border border-border px-4 py-2.5 max-w-[200px] animate-bubble-in">
              <p className="text-sm font-medium text-ink leading-snug">
                ¿Te ayudo con tu pedido?
              </p>
            </div>
          )}
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
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-150"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-ink font-medium mb-1">
                  ¡Hola! Soy tu asistente de Smile
                </p>
                <p className="text-sm text-muted">
                  Pregúntame por productos, precios o arma tu pedido conmigo.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-green-700 text-white rounded-br-md"
                    : "bg-subtle text-ink rounded-bl-md"
                )}
              >
                {msg.content || (
                  <Loader2 size={16} className="animate-spin text-muted" />
                )}
              </div>
            ))}
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
