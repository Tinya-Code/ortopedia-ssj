import { db } from '../data/db';
import type { Category, Database, Product } from '../data/types';

import { getJSON } from './client';
import { USE_API } from './config';

/**
 * Contracto de endpoints (solo GET) para `USE_API=true`:
 *
 *   GET /categories  → Category[]  (array completo)
 *   GET /products    → Product[]   (catálogo completo)
 *
 * El facade carga esos dos listados una sola vez por build (memoizado) y
 * calcula el resto —bySlug, byCategory, featured, related— con la MISMA
 * lógica del modo repo: un solo camino de código para ambos orígenes.
 *
 * Las páginas usan `api.*` (siempre con `await`), nunca `db` (doc/seo.md §3).
 *
 * Nota: `registroSanitario` es opcional. Todos los productos se publican y el
 * badge de registro (ProductInfo) se oculta solo cuando el dato no existe.
 */

async function load(): Promise<Database> {
  return USE_API
    ? {
        categories: await getJSON<Category[]>('/categories'),
        products: await getJSON<Product[]>('/products'),
      }
    : db;
}

// Una carga por proceso (rechazos incluidos: sin reintentos durante el build).
let cached: Promise<Database> | undefined;
function catalog(): Promise<Database> {
  cached ??= load();
  return cached;
}

export const api = {
  categories: {
    async list(): Promise<Category[]> {
      const items = (await catalog()).categories;
      return [...items].sort((a, b) => a.order - b.order);
    },
    async bySlug(slug: string): Promise<Category | undefined> {
      return (await catalog()).categories.find((c) => c.slug === slug);
    },
  },
  products: {
    /** Catálogo completo, en orden de catálogo. */
    async list(): Promise<Product[]> {
      return (await catalog()).products;
    },
    async bySlug(slug: string): Promise<Product | undefined> {
      return (await catalog()).products.find((p) => p.slug === slug);
    },
    async byCategory(slug: string): Promise<Product[]> {
      return (await catalog()).products.filter((p) => p.category === slug);
    },
    async featured(limit = 6): Promise<Product[]> {
      return (await catalog()).products.filter((p) => p.featured).slice(0, limit);
    },
    async related(slug: string, limit = 4): Promise<Product[]> {
      const items = await catalog();
      const current = items.products.find((p) => p.slug === slug);
      if (!current) return [];
      return items.products
        .filter((p) => p.category === current.category && p.slug !== slug)
        .slice(0, limit);
    },
  },
};
