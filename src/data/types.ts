/**
 * Contracto de datos compartido.
 *
 * La forma de `db` (src/data/db.ts) ES la forma del JSON que devuelve la API
 * remota (doc/seo.md §3). Lo validan los dos lados:
 *  - repo: `db ... satisfies Database` en db.ts
 *  - api:  `getJSON<Database>` en src/api/client.ts
 */

export interface Category {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  /** repo: asset local (ImageMetadata) · api: URL remota */
  image: ImageMetadata | string;
  imageAlt: string;
  order: number;
}

export interface ProductImage {
  src: ImageMetadata | string;
  alt: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  /** slug de la categoría */
  category: string;
  seoTitle?: string;
  seoDescription: string;
  description: string;
  images: ProductImage[];
  price: number;
  availability: 'InStock' | 'PreOrder' | 'OutOfStock';
  brand?: string;
  sku: string;
  /** Regla editorial (doc/legal.md 9.6): sin registro verificado NO se publica */
  registroSanitario?: string;
  claseRiesgo?: string;
  titularRegistro?: string;
  condition: 'new' | 'refurbished' | 'used';
  specs?: Record<string, string>;
  faq?: FaqItem[];
  featured: boolean;
}

export interface Database {
  categories: Category[];
  products: Product[];
}
