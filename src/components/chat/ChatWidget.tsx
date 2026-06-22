"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();

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
      {/* Botón flotante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full bg-green-700 text-white shadow-lg",
            "hover:bg-green-600 active:scale-95",
            "flex items-center justify-center",
            "transition-all duration-200"
          )}
          aria-label="Abrir chat de asistencia"
        >
          <MessageCircle size={24} />
        </button>
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
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-100 animate-pulse" />
              <span className="font-heading font-semibold text-sm">
                Asistente Smile
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
