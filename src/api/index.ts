import { db } from '../data/db';
import type { Category, Database, Product } from '../data/types';

import { getJSON } from './client';
import { USE_API } from './config';

/**
 * Contracto de endpoints (solo GET) para `USE_API=true`:
 *
 *   GET /categories  → Category[]  (array completo)
 *   GET /products    → Product[]   (catálogo completo, incluye los NO
 *                                   publicables: la capa aplica la regla
 *                                   editorial doc/legal.md 9.6)
 *
 * El facade carga esos dos listados una sola vez por build (memoizado) y
 * calcula el resto —bySlug, byCategory, featured, related, hidden— con la MISMA
 * lógica del modo repo: un solo camino de código para ambos orígenes.
 *
 * Las páginas usan `api.*` (siempre con `await`), nunca `db` (doc/seo.md §3).
 */

// --- Regla editorial (doc/legal.md 9.6): sin registro sanitario NO se publica
const isPublishable = (p: Product) => Boolean(p.registroSanitario);

let warned = false;

async function load(): Promise<Database> {
  const data: Database = USE_API
    ? {
        categories: await getJSON<Category[]>('/categories'),
        products: await getJSON<Product[]>('/products'),
      }
    : db;

  if (!warned) {
    warned = true;
    const hidden = data.products.filter((p) => !isPublishable(p));
    if (hidden.length > 0) {
      console.warn(
        `[data] ${hidden.length} producto(s) sin registro sanitario NO se publicarán:`,
        hidden.map((p) => p.slug).join(', '),
      );
    }
  }
  return data;
}

// Una carga por proceso (rechazos incluidos: sin reintentos durante el build).
let cached: Promise<Database> | undefined;
function catalog(): Promise<Database> {
  cached ??= load();
  return cached;
}

async function published(): Promise<Product[]> {
  return (await catalog()).products.filter(isPublishable);
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
    /** Solo publicables (con registro sanitario), en orden de catálogo. */
    async list(): Promise<Product[]> {
      return published();
    },
    async bySlug(slug: string): Promise<Product | undefined> {
      return (await published()).find((p) => p.slug === slug);
    },
    async byCategory(slug: string): Promise<Product[]> {
      return (await published()).filter((p) => p.category === slug);
    },
    async featured(limit = 6): Promise<Product[]> {
      return (await published()).filter((p) => p.featured).slice(0, limit);
    },
    async related(slug: string, limit = 4): Promise<Product[]> {
      const items = await published();
      const current = items.find((p) => p.slug === slug);
      if (!current) return [];
      return items.filter((p) => p.category === current.category && p.slug !== slug).slice(0, limit);
    },
    /** Auditoría editorial: qué quedó fuera de publicación. */
    async hidden(): Promise<Product[]> {
      return (await catalog()).products.filter((p) => !isPublishable(p));
    },
  },
};
