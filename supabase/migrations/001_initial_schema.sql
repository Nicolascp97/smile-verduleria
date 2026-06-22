-- Smile — Verdulería
-- Migración inicial: productos, pedidos, descuentos_volumen

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('verduras', 'frutas', 'hierbas', 'legumbres_granos', 'huevos', 'abarrotes')),
  formato TEXT NOT NULL CHECK (formato IN ('unidad', 'kilo', 'malla', 'caja', 'saco', 'docena', 'paquete', 'bandeja', 'bolsa', 'trozo')),
  formato_detalle TEXT,
  stock NUMERIC NOT NULL DEFAULT 0,
  precio_minorista INTEGER,
  precio_mayorista INTEGER,
  disponible_minorista BOOLEAN NOT NULL DEFAULT true,
  disponible_mayorista BOOLEAN NOT NULL DEFAULT true,
  imagen_url TEXT,
  destacado BOOLEAN NOT NULL DEFAULT false,
  activo BOOLEAN NOT NULL DEFAULT true
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('minorista', 'mayorista')),
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_direccion TEXT,
  zona_envio TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  notas TEXT,
  canal TEXT NOT NULL CHECK (canal IN ('web', 'agente_ia')),
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'confirmado', 'preparando', 'despachado', 'entregado', 'cancelado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de descuentos por volumen
CREATE TABLE IF NOT EXISTS descuentos_volumen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_monto NUMERIC NOT NULL,
  descuento_pct NUMERIC NOT NULL,
  descripcion TEXT NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_slug ON productos(slug);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_tipo ON pedidos(tipo);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE descuentos_volumen ENABLE ROW LEVEL SECURITY;

-- Lectura pública de productos activos
CREATE POLICY "Productos activos visibles para todos"
  ON productos FOR SELECT
  USING (activo = true);

-- Escritura de pedidos: cualquiera puede insertar (desde la web)
CREATE POLICY "Cualquiera puede crear pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (true);

-- Lectura de pedidos solo vía service role (admin)
CREATE POLICY "Solo service role lee pedidos"
  ON pedidos FOR SELECT
  USING (auth.role() = 'service_role');

-- Actualización de pedidos solo vía service role
CREATE POLICY "Solo service role actualiza pedidos"
  ON pedidos FOR UPDATE
  USING (auth.role() = 'service_role');

-- Descuentos públicos
CREATE POLICY "Descuentos visibles para todos"
  ON descuentos_volumen FOR SELECT
  USING (true);

-- Habilitar Realtime en pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;

-- Seed descuentos por volumen (placeholder)
INSERT INTO descuentos_volumen (min_monto, descuento_pct, descripcion) VALUES
  (50000, 5, 'Pedidos sobre $50.000'),
  (100000, 10, 'Pedidos sobre $100.000'),
  (200000, 15, 'Pedidos sobre $200.000');
