# Smile — Verdulería Digital

Plataforma de catálogo y pedidos para **Smile**, verdulería chilena con canal minorista y mayorista.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** con tokens de diseño en CSS variables
- **Supabase** (Postgres + Realtime + Storage)
- **Zustand** para estado del carrito
- **Anthropic SDK** para agente IA con tool calling
- **Playwright** para tests e2e

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local
# Completar con tus credenciales de Supabase y Anthropic

# 3. Crear tablas en Supabase
# Ejecutar en orden en el SQL Editor de Supabase:
#   supabase/migrations/001_initial_schema.sql
#   supabase/migrations/002_seed_productos.sql

# 4. Iniciar dev server
npm run dev
```

## Estructura

```
src/
  app/
    page.tsx                  # Catálogo minorista (home)
    mayorista/page.tsx        # Catálogo mayorista B2B
    admin/pedidos/page.tsx    # Panel admin (protegido)
    api/
      chat/route.ts           # Agente IA (streaming)
      pedidos/route.ts        # CRUD pedidos
  components/
    catalog/                  # Grid, ProductCard, filtros, buscador
    cart/                     # Drawer carrito + WhatsApp
    chat/                     # Widget IA flotante
    layout/                   # Header, Footer, ContactBar
    mayorista/                # Catálogo mayorista + descuentos
  lib/
    supabase/                 # Clientes server/browser + tipos
    ai/                       # System prompt + tools del agente
    whatsapp.ts               # Builder de mensaje WhatsApp
    onedate.ts                # Stub API One Date (facturación)
    utils.ts                  # cn, formatPrice, slugify
  store/
    cart.ts                   # Zustand
  data/
    productos.seed.ts         # Seed TypeScript
supabase/
  migrations/                 # SQL del esquema + seed
```

## Funcionalidades

- Catálogo minorista con hero, búsqueda en tiempo real, filtros por categoría
- Catálogo mayorista con tabla de descuentos por volumen
- Carrito visual con drawer lateral y salida a WhatsApp
- Agente IA 24/7 con tool calling (buscar productos, armar pedidos)
- Panel admin con pedidos en tiempo real (Supabase Realtime) + edición de productos

## Deploy

Optimizado para **Vercel**. Configurar las variables de entorno en el dashboard de Vercel.

---

Desarrollado con IA · nico.agenteia
