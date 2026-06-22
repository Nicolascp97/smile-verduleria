export type Categoria =
  | "verduras"
  | "frutas"
  | "hierbas"
  | "legumbres_granos"
  | "huevos"
  | "abarrotes";

export type Formato =
  | "unidad"
  | "kilo"
  | "malla"
  | "caja"
  | "saco"
  | "docena"
  | "paquete"
  | "bandeja"
  | "bolsa"
  | "trozo";

export type EstadoPedido =
  | "nuevo"
  | "confirmado"
  | "preparando"
  | "despachado"
  | "entregado"
  | "cancelado";

export type TipoPedido = "minorista" | "mayorista";
export type CanalPedido = "web" | "agente_ia";

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  categoria: Categoria;
  formato: Formato;
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

export interface PedidoItem {
  producto_id: string;
  nombre: string;
  formato: string;
  cantidad: number;
  precio_unit: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  tipo: TipoPedido;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_direccion: string | null;
  zona_envio: string | null;
  items: PedidoItem[];
  total: number;
  notas: string | null;
  canal: CanalPedido;
  estado: EstadoPedido;
  created_at: string;
}

export interface DescuentoVolumen {
  id: string;
  min_monto: number;
  descuento_pct: number;
  descripcion: string;
}

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: Producto;
        Insert: Omit<Producto, "id">;
        Update: Partial<Omit<Producto, "id">>;
      };
      pedidos: {
        Row: Pedido;
        Insert: Omit<Pedido, "id" | "created_at">;
        Update: Partial<Omit<Pedido, "id" | "created_at">>;
      };
      descuentos_volumen: {
        Row: DescuentoVolumen;
        Insert: Omit<DescuentoVolumen, "id">;
        Update: Partial<Omit<DescuentoVolumen, "id">>;
      };
    };
  };
}
