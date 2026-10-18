import { db } from './data/db';
import { services } from './data/services';
import { legal, site } from './data/site';
import type { Category, Database, Legal, Product, Service, Site } from './types';

import { getJSONSafe } from './client';
import { USE_API } from './config';

/**
 * Contracto de endpoints (solo GET) para `USE_API=true`:
 *
 *   GET /categories    → Category[]  (array completo)
 *   GET /products      → Product[]   (catálogo completo)
 *   GET /services      → Service[]   (servicios del negocio)
 *   GET /site          → Site        (identidad del negocio)
 *   GET /site/legal    → Legal       (datos legales INDECOPI)
 *
 * El facade carga los listados una sola vez por build (memoizado) y
 * calcula el resto —bySlug, byCategory, featured, related— con la MISMA
 * lógica del modo repo: un solo camino de código para ambos orígenes.
 *
 * Si un endpoint remoto falla, el facade NO rompe el build: devuelve un
 * vacío tipado (ver EMPTY_* más abajo) y client.ts imprime un banner
 * [api] ERROR inignorable. La página se construye vacía a la vista —
 * error visible, nunca silencioso.
 *
 * Las páginas usan `api.*` (siempre con `await`), nunca los mocks de
 * src/api/data/* (doc/seo.md §3).
 *
 * Nota: `registroSanitario` es un string requerido con centinela '' = sin
 * registro. Todos los productos se publican y el badge de registro
 * (ProductInfo) se oculta solo cuando el dato está vacío ('' es falsy).
 */

/**
 * Vacíos tipados por endpoint: si el fetch remoto falla se devuelve esto en
 * lugar de lanzar (decisión explícita: build en pie + error LOUD en log,
 * nunca build roto ni fallback silencioso al mock local).
 * Cadenas '' y no undefined para que schema.ts/los layouts no revienten y
 * la página renderice VISIBLEMENTE en blanco; geo 0/0 deja el mapa
 * obviamente mal — también a propósito.
 */
const EMPTY_SITE: Site = {
  name: '',
  url: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: { street: '', city: '', region: '', postalCode: '', country: '' },
  geo: { lat: 0, lng: 0 },
  hours: [],
  social: { facebook: '', tiktok: '', instagram: '' },
  currency: '',
};

const EMPTY_LEGAL: Legal = {
  legalName: '',
  tradeName: '',
  ruc: '',
  fiscalAddress: '',
  email: '',
  phone: '',
  reclamosEmail: '',
  reclamosResponseDays: 0,
  currency: '',
  lastUpdated: '',
};

async function load(): Promise<Database> {
  return USE_API
    ? {
        categories: await getJSONSafe<Category[]>('/categories', []),
        products: await getJSONSafe<Product[]>('/products', []),
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
  site: {
    /** Identidad del negocio. Repo: mock local · api: getJSONSafe('/site', EMPTY_SITE). */
    async get(): Promise<Site> {
      return USE_API ? await getJSONSafe<Site>('/site', EMPTY_SITE) : site;
    },
    async legal(): Promise<Legal> {
      return USE_API ? await getJSONSafe<Legal>('/site/legal', EMPTY_LEGAL) : legal;
    },
  },
  services: {
    async list(): Promise<Service[]> {
      return USE_API ? await getJSONSafe<Service[]>('/services', []) : services;
    },
    async bySlug(slug: string): Promise<Service | undefined> {
      return (await this.list()).find((s) => s.slug === slug);
    },
  },
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
