-- Smile — Verdulería
-- Migración 003: Especialidades por tipo de restaurante

-- Tabla de especialidades (tipos de cocina)
CREATE TABLE IF NOT EXISTS especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL DEFAULT '',
  color_from TEXT NOT NULL DEFAULT '#059669',
  color_to TEXT NOT NULL DEFAULT '#10B981',
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

-- Tabla pivote: producto ↔ especialidad
CREATE TABLE IF NOT EXISTS producto_especialidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  especialidad_id UUID NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
  UNIQUE (producto_id, especialidad_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_especialidades_slug ON especialidades(slug);
CREATE INDEX IF NOT EXISTS idx_especialidades_activo ON especialidades(activo);
CREATE INDEX IF NOT EXISTS idx_especialidades_orden ON especialidades(orden);
CREATE INDEX IF NOT EXISTS idx_producto_especialidad_producto ON producto_especialidad(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_especialidad_especialidad ON producto_especialidad(especialidad_id);

-- RLS
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_especialidad ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Especialidades visibles para todos"
  ON especialidades FOR SELECT
  USING (true);

CREATE POLICY "Asociaciones visibles para todos"
  ON producto_especialidad FOR SELECT
  USING (true);
