"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { cn, formatPrice } from "@/lib/utils";
import {
  Package,
  LogIn,
  LogOut,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  ShoppingBag,
  Boxes,
  PackageX,
  Tag,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import type {
  Pedido,
  EstadoPedido,
  PedidoItem,
  Producto,
  Categoria,
  Formato,
} from "@/lib/supabase/types";

const ESTADOS: { value: EstadoPedido; label: string; color: string }[] = [
  { value: "nuevo", label: "Nuevo", color: "bg-blue-100 text-blue-800" },
  { value: "confirmado", label: "Confirmado", color: "bg-green-100 text-green-800" },
  { value: "preparando", label: "Preparando", color: "bg-yellow-100 text-yellow-800" },
  { value: "despachado", label: "Despachado", color: "bg-purple-100 text-purple-800" },
  { value: "entregado", label: "Entregado", color: "bg-emerald-100 text-emerald-800" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
];

const CATEGORIAS: Categoria[] = ["verduras", "frutas", "hierbas", "legumbres_granos", "huevos", "abarrotes"];
const FORMATOS: Formato[] = ["unidad", "kilo", "malla", "caja", "saco", "docena", "paquete", "bandeja", "bolsa", "trozo"];

const CATEGORIA_META: Record<Categoria, { label: string; color: string }> = {
  verduras: { label: "Verduras", color: "bg-green-100 text-green-700" },
  frutas: { label: "Frutas", color: "bg-orange-100 text-orange-700" },
  hierbas: { label: "Hierbas", color: "bg-emerald-100 text-emerald-700" },
  legumbres_granos: { label: "Legumbres", color: "bg-amber-100 text-amber-700" },
  huevos: { label: "Huevos", color: "bg-yellow-100 text-yellow-700" },
  abarrotes: { label: "Abarrotes", color: "bg-stone-200 text-stone-700" },
};

const EMPTY_NEW_PRODUCT = {
  nombre: "",
  categoria: "verduras" as Categoria,
  formato: "unidad" as Formato,
  formato_detalle: "",
  stock: 0,
  precio_minorista: "" as string | number,
  precio_mayorista: "" as string | number,
};

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_NEW_PRODUCT);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busquedaProd, setBusquedaProd] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas">("todas");

  const supabaseRef = useRef(createBrowserClient());

  const adminHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "x-admin-password": password,
  }), [password]);

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
    if (!authenticated) return;
    try {
      const res = await fetch("/api/productos", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (data.productos) setProductos(data.productos);
    } catch (err) {
      console.error("Error fetching productos:", err);
    }
  }, [authenticated, password]);

  useEffect(() => {
    if (!authenticated) return;
    fetchPedidos();
    fetchProductos();

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
  }, [authenticated, fetchPedidos, fetchProductos]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) setAuthenticated(true);
  };

  const handleEstadoChange = async (id: string, estado: EstadoPedido) => {
    await fetch("/api/pedidos", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, estado }),
    });
    fetchPedidos();
  };

  const handleSaveProduct = async (id: string) => {
    await fetch("/api/productos", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, ...editValues }),
    });
    setEditingProduct(null);
    setEditValues({});
    fetchProductos();
  };

  const handleAddProduct = async () => {
    if (!newProduct.nombre.trim()) return;
    await fetch("/api/productos", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({
        ...newProduct,
        formato_detalle: newProduct.formato_detalle || null,
        precio_minorista: newProduct.precio_minorista !== "" ? Number(newProduct.precio_minorista) : null,
        precio_mayorista: newProduct.precio_mayorista !== "" ? Number(newProduct.precio_mayorista) : null,
      }),
    });
    setShowAddForm(false);
    setNewProduct(EMPTY_NEW_PRODUCT);
    fetchProductos();
  };

  const handleDeleteProduct = async (id: string) => {
    await fetch("/api/productos", {
      method: "DELETE",
      headers: adminHeaders(),
      body: JSON.stringify({ id }),
    });
    setConfirmDelete(null);
    fetchProductos();
  };

  const handleToggleStock = async (id: string, currentStock: number) => {
    await fetch("/api/productos", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, stock: currentStock > 0 ? 0 : 1 }),
    });
    fetchProductos();
  };

  const filteredPedidos = pedidos.filter((p) => {
    if (filtroEstado !== "todos" && p.estado !== filtroEstado) return false;
    if (filtroTipo !== "todos" && p.tipo !== filtroTipo) return false;
    return true;
  });

  const filteredProductos = useMemo(() => {
    let result = productos;
    if (filtroCategoria !== "todas") {
      result = result.filter((p) => p.categoria === filtroCategoria);
    }
    if (busquedaProd.trim()) {
      const q = busquedaProd.toLowerCase().trim();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    return result;
  }, [productos, busquedaProd, filtroCategoria]);

  const stats = useMemo(() => ({
    pedidosNuevos: pedidos.filter((p) => p.estado === "nuevo").length,
    totalProductos: productos.length,
    sinStock: productos.filter((p) => p.stock <= 0).length,
    sinPrecio: productos.filter((p) => p.precio_minorista == null).length,
  }), [pedidos, productos]);

  // ---------- Login ----------
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-subtle p-4">
        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-2xl p-8 shadow-md w-full max-w-sm space-y-4 border border-border"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl" role="img" aria-label="Hoja verde">🌿</span>
            <h1 className="font-heading text-2xl font-bold text-ink text-center">
              Panel Smile
            </h1>
            <p className="text-sm text-muted text-center">Ingresa para gestionar tu tienda</p>
          </div>
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

  // ---------- Dashboard ----------
  return (
    <div className="min-h-screen bg-subtle">
      {/* Top bar */}
      <header className="bg-surface border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0" role="img" aria-label="Hoja verde">🌿</span>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-ink truncate">
              Panel Smile
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { fetchPedidos(); fetchProductos(); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-subtle text-ink hover:bg-gray-200 transition-colors duration-150 text-sm min-h-[40px]"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted hover:text-error hover:bg-red-50 transition-colors duration-150 min-h-[40px]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<ShoppingBag size={20} />}
            label="Pedidos nuevos"
            value={stats.pedidosNuevos}
            tone="blue"
            onClick={() => { setTab("pedidos"); setFiltroEstado("nuevo"); }}
          />
          <StatCard
            icon={<Boxes size={20} />}
            label="Productos"
            value={stats.totalProductos}
            tone="green"
            onClick={() => { setTab("productos"); setFiltroCategoria("todas"); setBusquedaProd(""); }}
          />
          <StatCard
            icon={<PackageX size={20} />}
            label="Sin stock"
            value={stats.sinStock}
            tone="red"
            onClick={() => setTab("productos")}
          />
          <StatCard
            icon={<Tag size={20} />}
            label="Sin precio"
            value={stats.sinPrecio}
            tone="amber"
            onClick={() => setTab("productos")}
          />
        </div>

        {/* Segmented tabs */}
        <div className="inline-flex bg-surface border border-border rounded-xl p-1 mb-6 w-full sm:w-auto">
          <button
            onClick={() => setTab("pedidos")}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-colors duration-150 min-h-[40px]",
              tab === "pedidos" ? "bg-green-700 text-white" : "text-muted hover:text-ink"
            )}
          >
            <ShoppingBag size={16} />
            Pedidos
          </button>
          <button
            onClick={() => setTab("productos")}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-colors duration-150 min-h-[40px]",
              tab === "productos" ? "bg-green-700 text-white" : "text-muted hover:text-ink"
            )}
          >
            <Boxes size={16} />
            Productos
          </button>
        </div>

        {tab === "pedidos" && (
          <PedidosView
            pedidos={filteredPedidos}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onEstadoChange={handleEstadoChange}
          />
        )}

        {tab === "productos" && (
          <ProductosView
            productos={filteredProductos}
            totalProductos={productos.length}
            busqueda={busquedaProd}
            setBusqueda={setBusquedaProd}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            onAddProduct={handleAddProduct}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            editValues={editValues}
            setEditValues={setEditValues}
            onSaveProduct={handleSaveProduct}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            onDeleteProduct={handleDeleteProduct}
            onToggleStock={handleToggleStock}
          />
        )}
      </div>
    </div>
  );
}

// ============ Stat Card ============
function StatCard({
  icon, label, value, tone, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "blue" | "green" | "red" | "amber";
  onClick?: () => void;
}) {
  const tones = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-700 bg-green-50",
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
  };
  return (
    <button
      onClick={onClick}
      className="bg-surface rounded-2xl border border-border p-4 text-left hover:shadow-md transition-shadow duration-150 flex items-center gap-3"
    >
      <span className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", tones[tone])}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-heading text-2xl font-bold text-ink leading-none">{value}</span>
        <span className="block text-xs text-muted mt-1 truncate">{label}</span>
      </span>
    </button>
  );
}

// ============ Pedidos View ============
function PedidosView({
  pedidos, filtroEstado, setFiltroEstado, filtroTipo, setFiltroTipo,
  expandedId, setExpandedId, onEstadoChange,
}: {
  pedidos: Pedido[];
  filtroEstado: EstadoPedido | "todos";
  setFiltroEstado: (v: EstadoPedido | "todos") => void;
  filtroTipo: "minorista" | "mayorista" | "todos";
  setFiltroTipo: (v: "minorista" | "mayorista" | "todos") => void;
  expandedId: string | null;
  setExpandedId: (v: string | null) => void;
  onEstadoChange: (id: string, estado: EstadoPedido) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoPedido | "todos")}
          className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface min-h-[44px] flex-1 sm:flex-none"
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
          className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface min-h-[44px] flex-1 sm:flex-none"
          aria-label="Filtrar por tipo"
        >
          <option value="todos">Todos los tipos</option>
          <option value="minorista">Minorista</option>
          <option value="mayorista">Mayorista</option>
        </select>
      </div>

      <div className="space-y-3">
        {pedidos.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border">
            <Package size={40} className="mx-auto text-muted mb-3" />
            <p className="text-muted">No hay pedidos con estos filtros</p>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const estado = ESTADOS.find((e) => e.value === pedido.estado);
            const isExpanded = expandedId === pedido.id;
            return (
              <div key={pedido.id} className="bg-surface rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : pedido.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-subtle transition-colors duration-150 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold shrink-0", estado?.color)}>
                        {estado?.label}
                      </span>
                      <span className="font-semibold text-sm truncate">{pedido.cliente_nombre}</span>
                    </div>
                    <span className="text-xs text-muted capitalize">{pedido.tipo} · {pedido.canal === "agente_ia" ? "asistente" : "web"}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-ink">{formatPrice(pedido.total)}</span>
                    {isExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1.5"><Phone size={14} className="text-muted shrink-0" /> <strong>{pedido.cliente_telefono}</strong></div>
                      <div className="flex items-center gap-1.5"><Clock size={14} className="text-muted shrink-0" /> {new Date(pedido.created_at).toLocaleString("es-CL")}</div>
                      {pedido.cliente_direccion && <div className="flex items-center gap-1.5 sm:col-span-2"><MapPin size={14} className="text-muted shrink-0" /> {pedido.cliente_direccion}{pedido.zona_envio ? ` · ${pedido.zona_envio}` : ""}</div>}
                      {pedido.notas && <div className="sm:col-span-2 text-muted"><em>“{pedido.notas}”</em></div>}
                    </div>
                    <div className="bg-subtle rounded-xl p-3">
                      <h4 className="font-semibold text-sm text-ink mb-2">Productos</h4>
                      <ul className="space-y-1">
                        {(pedido.items as PedidoItem[]).map((item, i) => (
                          <li key={i} className="flex justify-between text-sm gap-2">
                            <span className="min-w-0"><span className="font-medium">{item.cantidad}x</span> {item.nombre} <span className="text-muted">({item.formato})</span></span>
                            <span className="font-medium shrink-0">{formatPrice(item.subtotal)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1.5">Cambiar estado:</p>
                      <div className="flex gap-2 flex-wrap">
                        {ESTADOS.filter((e) => e.value !== pedido.estado).map((e) => (
                          <button key={e.value} onClick={() => onEstadoChange(pedido.id, e.value)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity duration-150 min-h-[36px]", e.color, "hover:opacity-80")}>
                            {e.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// ============ Productos View ============
type NewProductState = typeof EMPTY_NEW_PRODUCT;

function ProductosView({
  productos, totalProductos, busqueda, setBusqueda, filtroCategoria, setFiltroCategoria,
  showAddForm, setShowAddForm, newProduct, setNewProduct, onAddProduct,
  editingProduct, setEditingProduct, editValues, setEditValues, onSaveProduct,
  confirmDelete, setConfirmDelete, onDeleteProduct, onToggleStock,
}: {
  productos: Producto[];
  totalProductos: number;
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroCategoria: Categoria | "todas";
  setFiltroCategoria: (v: Categoria | "todas") => void;
  showAddForm: boolean;
  setShowAddForm: (v: boolean) => void;
  newProduct: NewProductState;
  setNewProduct: (v: NewProductState) => void;
  onAddProduct: () => void;
  editingProduct: string | null;
  setEditingProduct: (v: string | null) => void;
  editValues: Partial<Producto>;
  setEditValues: (v: Partial<Producto>) => void;
  onSaveProduct: (id: string) => void;
  confirmDelete: string | null;
  setConfirmDelete: (v: string | null) => void;
  onDeleteProduct: (id: string) => void;
  onToggleStock: (id: string, stock: number) => void;
}) {
  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm bg-surface min-h-[44px]"
            aria-label="Buscar producto"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value as Categoria | "todas")}
          className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface min-h-[44px] capitalize"
          aria-label="Filtrar por categoría"
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{CATEGORIA_META[c].label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 min-h-[44px] shrink-0",
            showAddForm ? "bg-gray-200 text-ink" : "bg-green-700 text-white hover:bg-green-600"
          )}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Cancelar" : "Agregar"}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-surface rounded-2xl border border-border p-5 mb-5 space-y-3 animate-fade-in">
          <h3 className="font-heading font-semibold text-ink flex items-center gap-2">
            <Plus size={18} className="text-green-700" /> Nuevo producto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Field label="Nombre *">
              <input type="text" value={newProduct.nombre} onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })} className="admin-input" placeholder="Ej: Tomate Cherry" />
            </Field>
            <Field label="Categoría *">
              <select value={newProduct.categoria} onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value as Categoria })} className="admin-input capitalize">
                {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_META[c].label}</option>)}
              </select>
            </Field>
            <Field label="Formato *">
              <select value={newProduct.formato} onChange={(e) => setNewProduct({ ...newProduct, formato: e.target.value as Formato })} className="admin-input capitalize">
                {FORMATOS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Detalle formato">
              <input type="text" value={newProduct.formato_detalle} onChange={(e) => setNewProduct({ ...newProduct, formato_detalle: e.target.value })} className="admin-input" placeholder="Ej: 5 unidades" />
            </Field>
            <Field label="Stock">
              <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="admin-input" min={0} />
            </Field>
            <Field label="Precio minorista">
              <input type="number" value={newProduct.precio_minorista} onChange={(e) => setNewProduct({ ...newProduct, precio_minorista: e.target.value })} className="admin-input" placeholder="$" />
            </Field>
            <Field label="Precio mayorista">
              <input type="number" value={newProduct.precio_mayorista} onChange={(e) => setNewProduct({ ...newProduct, precio_mayorista: e.target.value })} className="admin-input" placeholder="$" />
            </Field>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onAddProduct}
              disabled={!newProduct.nombre.trim()}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 min-h-[44px]",
                !newProduct.nombre.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-700 text-white hover:bg-green-600"
              )}
            >
              Guardar producto
            </button>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted mb-3">
        {productos.length} de {totalProductos} productos
      </p>

      {/* Product cards grid */}
      {productos.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-border">
          <Boxes size={40} className="mx-auto text-muted mb-3" />
          <p className="text-muted">No hay productos que coincidan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {productos.map((p) => (
            <ProductoCard
              key={p.id}
              producto={p}
              isEditing={editingProduct === p.id}
              isDeleting={confirmDelete === p.id}
              editValues={editValues}
              setEditValues={setEditValues}
              onStartEdit={() => { setEditingProduct(p.id); setEditValues({}); }}
              onCancelEdit={() => { setEditingProduct(null); setEditValues({}); }}
              onSave={() => onSaveProduct(p.id)}
              onAskDelete={() => setConfirmDelete(p.id)}
              onCancelDelete={() => setConfirmDelete(null)}
              onConfirmDelete={() => onDeleteProduct(p.id)}
              onToggleStock={() => onToggleStock(p.id, p.stock)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted block mb-1">{label}</span>
      {children}
    </label>
  );
}

// ============ Producto Card ============
function ProductoCard({
  producto: p, isEditing, isDeleting, editValues, setEditValues,
  onStartEdit, onCancelEdit, onSave, onAskDelete, onCancelDelete, onConfirmDelete, onToggleStock,
}: {
  producto: Producto;
  isEditing: boolean;
  isDeleting: boolean;
  editValues: Partial<Producto>;
  setEditValues: (v: Partial<Producto>) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onToggleStock: () => void;
}) {
  const cat = CATEGORIA_META[p.categoria];
  const sinStock = p.stock <= 0;

  return (
    <div className={cn(
      "bg-surface rounded-2xl border p-4 flex flex-col gap-3 transition-colors duration-150",
      sinStock ? "border-red-200" : "border-border"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink leading-tight">{p.nombre}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", cat.color)}>{cat.label}</span>
            <span className="text-xs text-muted capitalize">
              {p.formato}{p.formato_detalle ? ` · ${p.formato_detalle}` : ""}
            </span>
          </div>
        </div>
        {p.activo
          ? <CheckCircle size={18} className="text-green-600 shrink-0" aria-label="Activo" />
          : <XCircle size={18} className="text-red-400 shrink-0" aria-label="Inactivo" />}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Stock">
            <input type="number" value={editValues.stock ?? p.stock} onChange={(e) => setEditValues({ ...editValues, stock: Number(e.target.value) })} className="admin-input" />
          </Field>
          <label className="flex items-end pb-2.5 gap-2">
            <input type="checkbox" checked={editValues.activo ?? p.activo} onChange={(e) => setEditValues({ ...editValues, activo: e.target.checked })} className="w-4 h-4" />
            <span className="text-xs font-medium text-muted">Activo</span>
          </label>
          <Field label="Precio min.">
            <input type="number" value={editValues.precio_minorista ?? p.precio_minorista ?? ""} onChange={(e) => setEditValues({ ...editValues, precio_minorista: e.target.value ? Number(e.target.value) : null })} className="admin-input" placeholder="$" />
          </Field>
          <Field label="Precio may.">
            <input type="number" value={editValues.precio_mayorista ?? p.precio_mayorista ?? ""} onChange={(e) => setEditValues({ ...editValues, precio_mayorista: e.target.value ? Number(e.target.value) : null })} className="admin-input" placeholder="$" />
          </Field>
          <div className="col-span-2 flex gap-2 pt-1">
            <button onClick={onSave} className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 min-h-[40px]">
              <Save size={15} /> Guardar
            </button>
            <button onClick={onCancelEdit} className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-subtle min-h-[40px]">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stock + precios */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onToggleStock}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 min-h-[36px]",
                sinStock
                  ? "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
                  : "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
              )}
              title={sinStock ? "Click para reponer" : "Click para marcar sin stock"}
            >
              {sinStock ? "Sin stock" : `Stock: ${p.stock}`}
            </button>
            <div className="text-right text-sm">
              <div className={cn(p.precio_minorista == null && "text-muted italic")}>
                Min: <span className="font-semibold">{formatPrice(p.precio_minorista)}</span>
              </div>
              <div className={cn("text-xs", p.precio_mayorista == null ? "text-muted italic" : "text-muted")}>
                May: <span className="font-medium">{formatPrice(p.precio_mayorista)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isDeleting ? (
            <div className="flex items-center justify-between gap-2 bg-red-50 rounded-xl px-3 py-2">
              <span className="text-sm text-red-700 font-medium">¿Eliminar este producto?</span>
              <div className="flex gap-2">
                <button onClick={onConfirmDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 min-h-[36px]">Sí, eliminar</button>
                <button onClick={onCancelDelete} className="px-3 py-1.5 rounded-lg bg-gray-200 text-ink text-xs font-medium hover:bg-gray-300 min-h-[36px]">No</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pt-1 border-t border-border mt-1">
              <button onClick={onStartEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-ink hover:bg-subtle min-h-[40px] mt-1">
                <Edit3 size={15} /> Editar
              </button>
              <button onClick={onAskDelete} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm text-muted hover:text-red-600 hover:bg-red-50 min-h-[40px] mt-1">
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
