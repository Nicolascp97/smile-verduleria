"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { cn, formatPrice } from "@/lib/utils";
import {
  Package,
  LogIn,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type {
  Pedido,
  EstadoPedido,
  PedidoItem,
  Producto,
} from "@/lib/supabase/types";

const ESTADOS: { value: EstadoPedido; label: string; color: string }[] = [
  { value: "nuevo", label: "Nuevo", color: "bg-blue-100 text-blue-800" },
  { value: "confirmado", label: "Confirmado", color: "bg-green-100 text-green-800" },
  { value: "preparando", label: "Preparando", color: "bg-yellow-100 text-yellow-800" },
  { value: "despachado", label: "Despachado", color: "bg-purple-100 text-purple-800" },
  { value: "entregado", label: "Entregado", color: "bg-emerald-100 text-emerald-800" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
];

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | "todos">("todos");
  const [filtroTipo, setFiltroTipo] = useState<"minorista" | "mayorista" | "todos">("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"pedidos" | "productos">("pedidos");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Producto>>({});

  const supabaseRef = useRef(createBrowserClient());

  const fetchPedidos = useCallback(async () => {
    if (!authenticated) return;
    try {
      const res = await fetch("/api/pedidos", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (data.pedidos) setPedidos(data.pedidos);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
    }
  }, [authenticated, password]);

  const fetchProductos = useCallback(async () => {
    const { data } = await supabaseRef.current
      .from("productos")
      .select("*")
      .order("nombre");
    if (data) setProductos(data as Producto[]);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchPedidos();
    if (tab === "productos") fetchProductos();

    const supabase = supabaseRef.current;
    const channel = supabase
      .channel("pedidos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        () => fetchPedidos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authenticated, tab, fetchPedidos, fetchProductos]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) setAuthenticated(true);
  };

  const handleEstadoChange = async (id: string, estado: EstadoPedido) => {
    await fetch("/api/pedidos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, estado }),
    });
    fetchPedidos();
  };

  const handleSaveProduct = async (id: string) => {
    await supabaseRef.current.from("productos").update(editValues).eq("id", id);
    setEditingProduct(null);
    setEditValues({});
    fetchProductos();
  };

  const filteredPedidos = pedidos.filter((p) => {
    if (filtroEstado !== "todos" && p.estado !== filtroEstado) return false;
    if (filtroTipo !== "todos" && p.tipo !== filtroTipo) return false;
    return true;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-subtle p-4">
        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-2xl p-8 shadow-md w-full max-w-sm space-y-4"
        >
          <h1 className="font-heading text-2xl font-bold text-ink text-center">
            Panel Admin
          </h1>
          <div>
            <label htmlFor="admin-pass" className="text-sm font-medium block mb-1">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-green-600"
              placeholder="Contraseña de admin"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-150 flex items-center justify-center gap-2 min-h-[48px]"
          >
            <LogIn size={18} />
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Panel Admin
        </h1>
        <button
          onClick={fetchPedidos}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-subtle text-ink hover:bg-gray-200 transition-colors duration-150"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-green-200">
        <button
          onClick={() => setTab("pedidos")}
          className={cn(
            "px-4 py-2.5 font-medium text-sm border-b-2 transition-colors duration-150 -mb-px",
            tab === "pedidos"
              ? "border-green-700 text-green-800"
              : "border-transparent text-green-600 hover:text-green-800"
          )}
        >
          Pedidos
        </button>
        <button
          onClick={() => setTab("productos")}
          className={cn(
            "px-4 py-2.5 font-medium text-sm border-b-2 transition-colors duration-150 -mb-px",
            tab === "productos"
              ? "border-green-700 text-green-800"
              : "border-transparent text-green-600 hover:text-green-800"
          )}
        >
          Productos
        </button>
      </div>

      {tab === "pedidos" && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoPedido | "todos")}
              className="px-4 py-2 rounded-xl border border-green-200 text-sm bg-surface"
              aria-label="Filtrar por estado"
            >
              <option value="todos">Todos los estados</option>
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as "minorista" | "mayorista" | "todos")}
              className="px-4 py-2 rounded-xl border border-green-200 text-sm bg-surface"
              aria-label="Filtrar por tipo"
            >
              <option value="todos">Todos los tipos</option>
              <option value="minorista">Minorista</option>
              <option value="mayorista">Mayorista</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredPedidos.length === 0 ? (
              <div className="text-center py-12 bg-green-50 rounded-xl">
                <Package size={40} className="mx-auto text-green-400 mb-3" />
                <p className="text-green-700">No hay pedidos con estos filtros</p>
              </div>
            ) : (
              filteredPedidos.map((pedido) => {
                const estado = ESTADOS.find((e) => e.value === pedido.estado);
                const isExpanded = expandedId === pedido.id;
                return (
                  <div key={pedido.id} className="bg-surface rounded-xl border border-green-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pedido.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-green-50/50 transition-colors duration-150 text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold shrink-0", estado?.color)}>
                          {estado?.label}
                        </span>
                        <span className="font-medium text-sm truncate">{pedido.cliente_nombre}</span>
                        <span className="text-xs text-green-600 shrink-0">{pedido.tipo} · {pedido.canal}</span>
                        <span className="text-sm font-semibold text-green-800 ml-auto shrink-0">{formatPrice(pedido.total)}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-green-500 ml-2 shrink-0" /> : <ChevronDown size={16} className="text-green-500 ml-2 shrink-0" />}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-green-100 pt-3 space-y-3 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-green-600">Teléfono:</span> <strong>{pedido.cliente_telefono}</strong></div>
                          <div><span className="text-green-600">Fecha:</span> <strong>{new Date(pedido.created_at).toLocaleString("es-CL")}</strong></div>
                          {pedido.cliente_direccion && <div className="col-span-2"><span className="text-green-600">Dirección:</span> <strong>{pedido.cliente_direccion}</strong></div>}
                          {pedido.notas && <div className="col-span-2"><span className="text-green-600">Notas:</span> <em>{pedido.notas}</em></div>}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-green-800 mb-2">Productos</h4>
                          <ul className="space-y-1">
                            {(pedido.items as PedidoItem[]).map((item, i) => (
                              <li key={i} className="flex justify-between text-sm">
                                <span>{item.cantidad}x {item.nombre} ({item.formato})</span>
                                <span className="font-medium">{formatPrice(item.subtotal)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {ESTADOS.filter((e) => e.value !== pedido.estado).map((e) => (
                            <button key={e.value} onClick={() => handleEstadoChange(pedido.id, e.value)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150", e.color, "hover:opacity-80")}>
                              → {e.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {tab === "productos" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-green-200 text-left">
                <th className="py-3 px-3 font-semibold">Producto</th>
                <th className="py-3 px-3 font-semibold">Categoría</th>
                <th className="py-3 px-3 font-semibold">Formato</th>
                <th className="py-3 px-3 font-semibold">Stock</th>
                <th className="py-3 px-3 font-semibold">Precio Min.</th>
                <th className="py-3 px-3 font-semibold">Precio May.</th>
                <th className="py-3 px-3 font-semibold">Activo</th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const isEditing = editingProduct === p.id;
                return (
                  <tr key={p.id} className="border-b border-green-100 hover:bg-green-50/50 transition-colors duration-150">
                    <td className="py-2 px-3 font-medium">{p.nombre}</td>
                    <td className="py-2 px-3 capitalize">{p.categoria}</td>
                    <td className="py-2 px-3 capitalize">{p.formato}</td>
                    <td className="py-2 px-3">
                      {isEditing ? <input type="number" value={editValues.stock ?? p.stock} onChange={(e) => setEditValues({ ...editValues, stock: Number(e.target.value) })} className="w-20 px-2 py-1 border rounded text-sm" aria-label="Stock" /> : p.stock}
                    </td>
                    <td className="py-2 px-3">
                      {isEditing ? <input type="number" value={editValues.precio_minorista ?? p.precio_minorista ?? ""} onChange={(e) => setEditValues({ ...editValues, precio_minorista: e.target.value ? Number(e.target.value) : null })} className="w-24 px-2 py-1 border rounded text-sm" placeholder="$" aria-label="Precio minorista" /> : formatPrice(p.precio_minorista)}
                    </td>
                    <td className="py-2 px-3">
                      {isEditing ? <input type="number" value={editValues.precio_mayorista ?? p.precio_mayorista ?? ""} onChange={(e) => setEditValues({ ...editValues, precio_mayorista: e.target.value ? Number(e.target.value) : null })} className="w-24 px-2 py-1 border rounded text-sm" placeholder="$" aria-label="Precio mayorista" /> : formatPrice(p.precio_mayorista)}
                    </td>
                    <td className="py-2 px-3">
                      {isEditing ? <input type="checkbox" checked={editValues.activo ?? p.activo} onChange={(e) => setEditValues({ ...editValues, activo: e.target.checked })} className="w-4 h-4" aria-label="Activo" /> : p.activo ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-400" />}
                    </td>
                    <td className="py-2 px-3">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleSaveProduct(p.id)} className="p-1.5 rounded hover:bg-green-200 text-green-700" aria-label="Guardar"><Save size={16} /></button>
                          <button onClick={() => { setEditingProduct(null); setEditValues({}); }} className="p-1.5 rounded hover:bg-red-100 text-red-500" aria-label="Cancelar"><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingProduct(p.id); setEditValues({}); }} className="p-1.5 rounded hover:bg-green-100 text-green-600" aria-label={`Editar ${p.nombre}`}><Edit3 size={16} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
