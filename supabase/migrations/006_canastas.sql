-- Smile — Verdulería
-- Migración 006: canastas administrables (con sus ítems de producto + cantidad)

-- Tabla de canastas
CREATE TABLE IF NOT EXISTS canastas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ítems de cada canasta: producto del catálogo + cantidad (texto libre)
CREATE TABLE IF NOT EXISTS canasta_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canasta_id UUID NOT NULL REFERENCES canastas(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad TEXT NOT NULL DEFAULT '',
  orden INTEGER NOT NULL DEFAULT 0
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_canastas_activo ON canastas(activo);
CREATE INDEX IF NOT EXISTS idx_canastas_orden ON canastas(orden);
CREATE INDEX IF NOT EXISTS idx_canasta_items_canasta ON canasta_items(canasta_id);
CREATE INDEX IF NOT EXISTS idx_canasta_items_producto ON canasta_items(producto_id);

-- RLS
ALTER TABLE canastas ENABLE ROW LEVEL SECURITY;
ALTER TABLE canasta_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública (la home muestra las canastas activas y sus ítems)
CREATE POLICY "Canastas visibles para todos"
  ON canastas FOR SELECT
  USING (true);

CREATE POLICY "Items de canasta visibles para todos"
  ON canasta_items FOR SELECT
  USING (true);

-- Las escrituras las hace el admin vía service_role, que omite RLS.
