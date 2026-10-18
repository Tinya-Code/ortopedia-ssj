/**
 * Contrato de datos compartido (fuente única de formas).
 *
 * La forma de `db` (src/api/data/db.ts) ES la forma del JSON que devuelve la
 * API remota (doc/seo.md §3). Lo validan los dos lados:
 *  - repo: `db ... satisfies Database` (o `: Site`, `: Service[]`) en src/api/data/
 *  - api:  `getJSON<T>` en src/api/client.ts
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

/** Paso de instrucciones de uso. */
export interface InstructionStep {
  /** Posición del paso dentro de la lista (arranca en 1). */
  step: number;
  text: string;
}

/** Fila de tabla de talles: 'S' → '38 - 46 cm'. */
export interface SizeGuideRow {
  size: string;
  range: string;
}

/** Una tabla de la guía de tallas (pantorrilla, tobillo, empeine…). */
export interface SizeGuideTable {
  /** Medida que describe la tabla, ej. 'Pantorrilla'. */
  measure: string;
  rows: SizeGuideRow[];
}

/**
 * Producto del catálogo. Schema uniforme: TODOS los objetos llevan TODAS las
 * claves (mismos nombres, mismo orden, mismo cantidad) — no hay opcionales.
 * Los campos sin dato usan centinelas explícitos: `null` en price y `''` en
 * brand / registroSanitario / claseRiesgo / titularRegistro.
 */
export interface Product {
  slug: string;
  name: string;
  /** slug de la categoría */
  category: string;
  /** Título SEO; presente en todos los productos (schema uniforme). */
  seoTitle: string;
  seoDescription: string;
  description: string;
  images: ProductImage[];
  /** null = cotiza, sin precio publicado (la UI muestra "Consultar precio"). */
  price: number | null;
  availability: 'InStock' | 'PreOrder' | 'OutOfStock';
  /** '' = sin marca publicada. */
  brand: string;
  sku: string;
  /** '' = sin registro; el badge se oculta porque '' es falsy. */
  registroSanitario: string;
  /** '' = sin clase de riesgo publicada. */
  claseRiesgo: string;
  /** '' = sin titular de registro publicado. */
  titularRegistro: string;
  condition: 'new' | 'refurbished' | 'used';
  /** {} si el producto no tiene especificaciones documentadas todavía. */
  specs: Record<string, string>;
  /** [] si el producto no tiene preguntas frecuentes todavía. */
  faq: FaqItem[];
  featured: boolean;
  /** [] si el producto no tiene beneficios documentados todavía. */
  benefits: string[];
  /** [] si el producto no tiene instrucciones de uso documentadas todavía. */
  instructions: InstructionStep[];
  /** [] si el producto no tiene guía de tallas todavía. */
  sizeGuide: SizeGuideTable[];
  /** [] si el producto no tiene recomendaciones de cuidado todavía. */
  care: string[];
}

export interface Database {
  categories: Category[];
  products: Product[];
}

/** Tramo semanal de horario del negocio. */
export interface SiteHours {
  /** Días en inglés (formato schema.org), ej. ['Monday', 'Tuesday', …]. */
  days: string[];
  /** Hora de apertura, 'HH:MM'. */
  opens: string;
  /** Hora de cierre, 'HH:MM'. */
  closes: string;
}

/** Redes sociales del negocio (URLs completas del perfil). */
export interface SiteSocial {
  facebook: string;
  tiktok: string;
  instagram: string;
}

/**
 * Identidad del negocio — contrato de GET /site.
 * A diferencia del antiguo `SITE as const`, es un objeto CMS-returnable:
 * sin literales congelados y con las interfaces como fuente de verdad.
 */
export interface Site {
  name: string;
  url: string;
  description: string;
  /** Formato display E.164-ish, ej. '+51 957 850 865'. */
  phone: string;
  /** Dígitos solamente, sin + ni espacios, ej. '51957850865'. */
  whatsapp: string;
  email: string;
  address: { street: string; city: string; region: string; postalCode: string; country: string };
  geo: { lat: number; lng: number };
  hours: SiteHours[];
  social: SiteSocial;
  /** Código ISO de moneda, ej. 'PEN'. */
  currency: string;
}

/** Datos legales (INDECOPI) — contrato de GET /site/legal. Ver doc/legal.md 9.2. */
export interface Legal {
  legalName: string;
  tradeName: string;
  ruc: string;
  fiscalAddress: string;
  email: string;
  phone: string;
  reclamosEmail: string;
  /** Días hábiles de respuesta [VALIDAR reglamento vigente]. */
  reclamosResponseDays: number;
  currency: string;
  /** Última actualización de las páginas legales (una sola fuente para las 3). */
  lastUpdated: string;
}

/** Beneficio de un servicio: etiqueta corta + explicación. */
export interface ServiceBenefit {
  label: string;
  text: string;
}

/** Punto destacado de un servicio (chip con icono). */
export interface ServicePoint {
  /** Clave de IconName del registro src/components/icons (en api viaja como string). */
  icon: string;
  label: string;
}

/**
 * Servicio del negocio — contrato de GET /services.
 * `href` NO viaja crudo de la API: se calcula en la capa de datos con
 * whatsappLink() (ver src/api/data/services.ts).
 */
export interface Service {
  /** Ancla de sección, ej. 'evaluacion-ortopedica'. */
  slug: string;
  title: string;
  description: string;
  /** "¿En qué casos se necesita?" */
  cases: string[];
  solution: { lead?: string; items: ServiceBenefit[] };
  points: ServicePoint[];
  /** CTA de WhatsApp — computado en la capa de datos, no crudo del API. */
  href: string;
  /** repo: asset local (ImageMetadata) · api: URL remota */
  image: ImageMetadata | string;
  imageAlt: string;
  /** background-color de la sección (ej. '#ffffff' o 'rgba(…)'). */
  accent: string;
  /** Orden de columnas en el layout (true = imagen a la izquierda). */
  reverse: boolean;
}
