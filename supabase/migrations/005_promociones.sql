-- Smile — Verdulería
-- Migración 005: promociones + configuración global del sitio

-- Tabla de promociones
-- Cada fila es un producto en promoción con valores propios de oferta.
-- descuento_pct y precio_oferta son mutuamente excluyentes (uno u otro).
CREATE TABLE IF NOT EXISTS promociones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  descuento_pct NUMERIC,
  precio_oferta INTEGER,
  cantidad NUMERIC,
  formato_etiqueta TEXT,
  badge_texto TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de configuración global (clave/valor, reutilizable)
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_promociones_activo ON promociones(activo);
CREATE INDEX IF NOT EXISTS idx_promociones_orden ON promociones(orden);
CREATE INDEX IF NOT EXISTS idx_promociones_producto ON promociones(producto_id);

-- RLS (Row Level Security)
ALTER TABLE promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Lectura pública de promociones activas (la home las muestra)
CREATE POLICY "Promociones activas visibles para todos"
  ON promociones FOR SELECT
  USING (activo = true);

-- Lectura pública de configuración (la home lee el flag promociones_activas)
CREATE POLICY "Configuración visible para todos"
  ON configuracion FOR SELECT
  USING (true);

-- Las escrituras (insert/update/delete) las hace el admin vía service_role,
-- que omite RLS. No se definen policies de escritura para clientes anónimos.

-- Seed: interruptor global de la sección, apagado por defecto
INSERT INTO configuracion (clave, valor) VALUES
  ('promociones_activas', 'false')
ON CONFLICT (clave) DO NOTHING;
