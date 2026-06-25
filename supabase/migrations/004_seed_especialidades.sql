-- Smile — Verdulería
-- Migración 004: Seed de productos nuevos + especialidades + asociaciones

-- ============================================================
-- 1. Productos nuevos que no existen en la base actual
-- ============================================================

INSERT INTO productos (nombre, slug, categoria, formato, stock, precio_minorista, precio_mayorista, activo)
VALUES
  ('Papa Camote', 'papa-camote-malla', 'verduras', 'malla', 0, NULL, NULL, true),
  ('Choclo Peruano Congelado', 'choclo-peruano-congelado-bolsa', 'verduras', 'bolsa', 0, NULL, NULL, true),
  ('Lechuga Hidropónica Verde', 'lechuga-hidroponica-verde-unidad', 'verduras', 'unidad', 0, NULL, NULL, true),
  ('Champiñón Grande', 'champinon-grande-kilo', 'verduras', 'kilo', 0, NULL, NULL, true),
  ('Nabos', 'nabos-kilo', 'verduras', 'kilo', 0, NULL, NULL, true),
  ('Pimentón Verde (caja)', 'pimenton-verde-caja', 'verduras', 'caja', 0, NULL, NULL, true),
  ('Cebolla Morada Chilena', 'cebolla-morada-chilena-malla', 'verduras', 'malla', 0, NULL, NULL, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. Las 5 especialidades
-- ============================================================

INSERT INTO especialidades (nombre, slug, emoji, color_from, color_to, descripcion, orden, activo)
VALUES
  ('Comida Peruana',   'peruana',   '🇵🇪', '#DC2626', '#FBBF24', 'Ingredientes esenciales para cocina peruana',    1, true),
  ('Comida China',     'china',     '🥢',  '#DC2626', '#991B1B', 'Verduras y condimentos para cocina china',       2, true),
  ('Comida Chilena',   'chilena',   '🇨🇱', '#1D4ED8', '#DC2626', 'Los clásicos de la cocina chilena',              3, true),
  ('Comida Japonesa',  'japonesa',  '🍣',  '#111827', '#DC2626', 'Ingredientes para cocina japonesa',              4, true),
  ('Comida Mexicana',  'mexicana',  '🌮',  '#15803D', '#DC2626', 'Ingredientes para cocina mexicana',              5, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 3. Asociaciones producto ↔ especialidad
-- ============================================================

-- Helper: insertar asociación solo si ambos registros existen
-- Usamos subqueries para resolver IDs por slug

-- ---------- PERUANA ----------
INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-perla-grande-malla' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'limon-sutil-caja' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'papa-camote-malla' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'papa-lavada-mediana-saco' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-vieja-saco' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'choclo-peruano-congelado-bolsa' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lechuga-hidroponica-verde-unidad' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'aji-fresco-caja' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'aji-oro-kilo' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cilantro-grande' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'limon-sutil-kilo' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-kilo' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'tomate-kilo' AND e.slug = 'peruana'
ON CONFLICT DO NOTHING;

-- ---------- CHINA ----------
INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'brocoli-unidad' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'coliflor-unidad' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'repollo-crespo-unidad' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'repollo-liso-unidad' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zanahoria-grande-saco' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebollin-primera-docena' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zapallo-italiano-1-caja' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'papa-lavada-mediana-saco' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-vieja-saco' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'champinon-grande-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'champinon-mediano-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'diente-de-dragon-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'nabos-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-rojo-3-caja' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-verde-caja' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-perla-grande-malla' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-chilena-malla' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pak-choi-400-gramos' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'jengibre-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'col-china-6-unidades' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'ajo-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'salsa-de-ostras-500-gramos' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'ajinomoto-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'espinaca-kilo' AND e.slug = 'china'
ON CONFLICT DO NOTHING;

-- ---------- CHILENA ----------
INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'papa-lavada-mediana-saco' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'papa-mediana-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-vieja-saco' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-grande-unidad' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zanahoria-grande-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zanahoria-grande-saco' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zapallo-camote-1-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'poroto-verde-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'poroto-burro-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cilantro-grande' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'perejil-grande' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'tomate-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'tomate-caja' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lechuga-costina-unidad' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lechuga-costina-caja' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'betarraga-5-unidades' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'apio-unidad' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'arveja-partida-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lenteja-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'mote-kilo' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'aji-fresco-caja' AND e.slug = 'chilena'
ON CONFLICT DO NOTHING;

-- ---------- JAPONESA ----------
INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'jengibre-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'palta-hass-chilena-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pepino-ensalada-unidad' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pak-choi-400-gramos' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebollin-primera-docena' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'limon-sutil-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'espinaca-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'zanahoria-grande-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'repollo-morado-unidad' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'ciboulette-grande' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'ajo-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'champinon-mediano-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'champinon-grande-kilo' AND e.slug = 'japonesa'
ON CONFLICT DO NOTHING;

-- ---------- MEXICANA ----------
INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'limon-sutil-kilo' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'limon-sutil-caja' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-kilo' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-morada-perla-grande-malla' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-vieja-saco' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cilantro-grande' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'aji-fresco-caja' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'aji-oro-kilo' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'tomate-kilo' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'tomate-caja' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-rojo-3-caja' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-rojo-unidad' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-verde-unidad' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'pimenton-verde-caja' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'palta-hass-chilena-kilo' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lechuga-costina-unidad' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'lechuga-escarola-unidad' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;

INSERT INTO producto_especialidad (producto_id, especialidad_id)
SELECT p.id, e.id FROM productos p, especialidades e
WHERE p.slug = 'cebolla-grande-unidad' AND e.slug = 'mexicana'
ON CONFLICT DO NOTHING;
