import { create } from "zustand";
import type { Producto, TipoPedido } from "@/lib/supabase/types";

export interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnit: number;
  tipo: TipoPedido;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  clienteNombre: string;
  clienteTelefono: string;
  clienteDireccion: string;
  zonaEnvio: string;
  notas: string;

  addItem: (producto: Producto, tipo: TipoPedido) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setClienteNombre: (nombre: string) => void;
  setClienteTelefono: (telefono: string) => void;
  setClienteDireccion: (direccion: string) => void;
  setZonaEnvio: (zona: string) => void;
  setNotas: (notas: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
  getTipoPedido: () => TipoPedido;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  clienteNombre: "",
  clienteTelefono: "",
  clienteDireccion: "",
  zonaEnvio: "",
  notas: "",

  addItem: (producto, tipo) => {
    const precioUnit =
      tipo === "mayorista"
        ? (producto.precio_mayorista ?? 0)
        : (producto.precio_minorista ?? 0);
    const { items } = get();
    const existing = items.find((i) => i.producto.id === producto.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        ),
      });
    } else {
      set({ items: [...items, { producto, cantidad: 1, precioUnit, tipo }] });
    }
  },

  removeItem: (productoId) => {
    set({ items: get().items.filter((i) => i.producto.id !== productoId) });
  },

  updateQuantity: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(productoId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      ),
    });
  },

  clearCart: () =>
    set({
      items: [],
      clienteNombre: "",
      clienteTelefono: "",
      clienteDireccion: "",
      zonaEnvio: "",
      notas: "",
    }),

  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  setClienteNombre: (nombre) => set({ clienteNombre: nombre }),
  setClienteTelefono: (telefono) => set({ clienteTelefono: telefono }),
  setClienteDireccion: (direccion) => set({ clienteDireccion: direccion }),
  setZonaEnvio: (zona) => set({ zonaEnvio: zona }),
  setNotas: (notas) => set({ notas }),

  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.precioUnit * item.cantidad, 0),

  getItemCount: () =>
    get().items.reduce((sum, item) => sum + item.cantidad, 0),

  getTipoPedido: () =>
    get().items[0]?.tipo ?? "mayorista",
}));
