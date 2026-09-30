# Astro + SEO: Ecommerce y Centro Ortopédico

Guía de arquitectura para un sitio en **Astro** con tres tipos de página:

1. **Home**: presenta el centro ortopédico y sus servicios.
2. **Categoría**: catálogo filtrado por categoría (rodilleras, bastones, sillas de ruedas, etc.).
3. **Producto**: descripción completa con botón directo a WhatsApp.

Principios: HTML estático (SSG), cero JS innecesario, datos estructurados (JSON-LD) en cada página, componentes con una sola responsabilidad.

---

## 1. Estructura de carpetas

```
/
├─ public/
│  ├─ robots.txt
│  ├─ favicon.svg
│  └─ og-default.jpg
├─ src/
│  ├─ assets/
│  │  └─ products/               # imágenes (Astro las optimiza)
│  ├─ components/
│  │  ├─ seo/
│  │  │  ├─ SEO.astro            # <title>, meta, OG, canonical
│  │  │  └─ JsonLd.astro         # inyector genérico de JSON-LD
│  │  ├─ layout/
│  │  │  ├─ Header.astro
│  │  │  ├─ Footer.astro
│  │  │  └─ Breadcrumbs.astro
│  │  ├─ ui/
│  │  │  ├─ Button.astro
│  │  │  └─ WhatsAppButton.astro
│  │  ├─ home/
│  │  │  ├─ Hero.astro
│  │  │  ├─ ServicesGrid.astro
│  │  │  ├─ WhyUs.astro
│  │  │  ├─ FeaturedCategories.astro
│  │  │  ├─ Faq.astro
│  │  │  └─ LocationCta.astro
│  │  ├─ catalog/
│  │  │  ├─ ProductCard.astro
│  │  │  ├─ ProductGrid.astro
│  │  │  └─ CategoryCard.astro
│  │  └─ product/
│  │     ├─ ProductGallery.astro
│  │     ├─ ProductInfo.astro
│  │     ├─ ProductSpecs.astro
│  │     └─ RelatedProducts.astro
│  ├─ data/
│  │  └─ api.js                  # "API" simulada: un solo archivo con todos los datos
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ lib/
│  │  ├─ site.ts                 # datos del negocio (NAP, redes, WhatsApp)
│  │  ├─ whatsapp.ts             # generador de enlaces
│  │  └─ schema.ts               # generadores de JSON-LD
│  ├─ styles/
│  │  └─ global.css              # design tokens (@theme) + Tailwind
│  └─ pages/
│     ├─ index.astro
│     ├─ catalogo/
│     │  ├─ index.astro          # todas las categorías
│     │  └─ [category].astro     # catálogo por categoría
│     ├─ producto/
│     │  └─ [slug].astro
│     ├─ servicios/
│     │  └─ [slug].astro         # opcional: una página por servicio
│     ├─ 404.astro
│     └─ sitemap-*.xml (generado)
└─ astro.config.mjs
```

**Regla de separación:**
- `pages/` solo orquesta: obtiene datos y compone componentes.
- `components/` solo presenta: recibe props, no consulta datos.
- `lib/` contiene lógica pura (enlaces, schemas, config del sitio).
- `data/` es la única fuente de datos: nada importa `astro:content`.

**Arquitectura por slots (smart / dumb):**
- `pages/*.astro` son **smart**: llaman a `api.*`, arman crumbs y schemas, y componen.
- `components/**` son **dumb**: reciben props mínimas (nada de `api.*` ni `astro:content`).
- `BaseLayout.astro` expone un `<slot />` para el main y **slots con nombre** para regiones opcionales (`<slot name="aside" />`, `<slot name="cta" />`); el layout nunca recibe markup como prop.
- La extensibilidad pasa por slots, no por render props ni por clonar componentes.

| Principio | Cómo se cumple |
|---|---|
| SRP | Un componente renderiza una sola pieza (una card, un breadcrumb). |
| OCP | Nueva región de página = nuevo `<slot name>`, sin tocar el componente. |
| LSP/ISP | Props estructurales mínimas: cada dumb declara solo el slice que usa. |
| DIP | Páginas dependen de la interfaz `api.*`, no de cómo se almacenan los datos. |

---

## 2. Configuración base

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.tudominio.com', // OBLIGATORIO para canonical y sitemap
  trailingSlash: 'always',           // una sola versión de cada URL
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
```

```bash
npx astro add sitemap
```

### `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://www.tudominio.com/sitemap-index.xml
```

### `src/styles/global.css`

Design tokens de Tailwind en `@theme` (sin `tailwind.config`): colores planos `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral` y **dos** tipografías `--font-body` / `--font-display`, más `--default-font-family: var(--font-body)` para que `<html>` use la tipografía de cuerpo. Utilities: `bg-primary`, `text-secondary`, `border-accent`, `font-body`, `font-display`.

### `src/lib/site.ts`

```ts
export const SITE = {
  name: 'Centro Ortopédico Tu Marca',
  url: 'https://www.tudominio.com',
  description:
    'Centro ortopédico: venta de productos ortopédicos, ortesis, prótesis y servicios de evaluación.',
  phone: '+51 000 000 000',
  whatsapp: '51000000000', // sin + ni espacios
  email: 'contacto@tudominio.com',
  address: {
    street: 'Av. Ejemplo 123',
    city: 'Ciudad',
    region: 'Región',
    postalCode: '00000',
    country: 'PE',
  },
  geo: { lat: -12.0464, lng: -77.0428 },
  hours: [
    { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '19:00' },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
  social: ['https://facebook.com/tumarca', 'https://instagram.com/tumarca'],
  currency: 'PEN',
} as const;
```

---

## 3. Capa de datos (sin Content Collections)

Un solo módulo que **imita la respuesta de una API**: los datos viven en `src/data/api.js`, se importan en build time y exponen una interfaz estable. Cero archivos `.md`, cero `astro:content`, cero `getCollection`.

### `src/data/api.js`

```js
import rodillera1 from '../assets/products/rodillera-1.jpg';

/** Base de datos local. Su forma ES la forma de la respuesta de la API. */
const db = {
  categories: [
    {
      slug: 'rodilleras',
      name: 'Rodilleras',
      seoTitle: 'Rodilleras ortopédicas',
      seoDescription: 'Rodilleras y soportes de rodilla para deporte, lesiones y recuperación.',
      intro: 'Texto SEO único de la categoría (150–300 palabras)...',
      image: rodillera1,
      imageAlt: 'Rodilleras ortopédicas',
      order: 1,
    },
  ],
  products: [
    {
      slug: 'rodillera-ligamentos',
      name: 'Rodillera con soporte de ligamentos',
      category: 'rodilleras',                 // slug de la categoría
      seoTitle: 'Rodillera ortopédica con soporte',   // opcional (≤60 car.)
      seoDescription: 'Rodillera con estabilizadores laterales para lesiones de ligamentos.',
      description: 'Descripción larga (150–300 palabras): indicaciones, beneficios, cuidados y uso.',
      images: [{ src: rodillera1, alt: 'Rodillera con soporte de ligamentos vista frontal' }],
      price: 120,                             // sin precio => "Consultar precio"
      availability: 'InStock',                // InStock | OutOfStock | PreOrder
      brand: 'MarcaX',
      sku: 'ROD-001',
      specs: { Material: 'Neopreno transpirable', Tallas: 'S, M, L, XL' },
      faq: [{ q: '¿Sirve para uso deportivo?', a: 'Sí, ofrece estabilidad lateral.' }],
      featured: true,
    },
  ],
};

export const api = {
  categories: {
    list: () => [...db.categories].sort((a, b) => a.order - b.order),
    bySlug: (slug) => db.categories.find((c) => c.slug === slug),
  },
  products: {
    list: () => db.products,
    bySlug: (slug) => db.products.find((p) => p.slug === slug),
    byCategory: (slug) => db.products.filter((p) => p.category === slug),
    featured: (limit = 6) => db.products.filter((p) => p.featured).slice(0, limit),
    related: (slug, limit = 4) => {
      const current = api.products.bySlug(slug);
      return db.products
        .filter((p) => p.category === current?.category && p.slug !== slug)
        .slice(0, limit);
    },
  },
};
```

**Reglas de la capa de datos:**
- `api.*` es el único punto de acceso a los datos. Páginas y componentes no tocan `db`.
- Las firmas son estables: cuando exista un backend real, cada método se reemplaza por `await fetch(...)` sin tocar nada agu abajo (DIP).
- Los textos largos (`description`, `intro`) son campos string del dato, no Markdown.
- Las imágenes se importan en el módulo (Astro las optimiza); nunca rutas `/src/...` en crudo.

---

## 4. Helpers de lógica

### `src/lib/whatsapp.ts`

```ts
import { SITE } from './site';

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(name: string, url: string) {
  return `Hola, me interesa el producto "${name}". ¿Tienen disponibilidad y precio? ${url}`;
}
```

### `src/lib/schema.ts`

```ts
import { SITE } from './site';

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'Store'],
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/og-default.jpg`,
  telephone: SITE.phone,
  email: SITE.email,
  description: SITE.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHoursSpecification: SITE.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: SITE.social,
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

export const productSchema = (p: {
  name: string; description: string; images: string[]; url: string;
  sku?: string; brand?: string; price?: number; availability: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  description: p.description,
  image: p.images,
  sku: p.sku,
  brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
  // Solo incluir offers si hay precio (Google lo exige para rich results)
  offers: p.price
    ? {
        '@type': 'Offer',
        url: p.url,
        priceCurrency: SITE.currency,
        price: p.price,
        availability: `https://schema.org/${p.availability}`,
        itemCondition: 'https://schema.org/NewCondition',
      }
    : undefined,
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});

export const itemListSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: it.url, name: it.name,
  })),
});
```

---

## 5. Componentes SEO y layout

### `src/components/seo/SEO.astro`

```astro
---
import { SITE } from '../../lib/site';

interface Props {
  title: string;
  description: string;
  image?: string;       // URL absoluta o ruta en /public
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}
const { title, description, image = '/og-default.jpg', type = 'website', noindex = false } = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImage = new URL(image, Astro.site).href;
const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<meta property="og:type" content={type} />
<meta property="og:site_name" content={SITE.name} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:locale" content="es_PE" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

### `src/components/seo/JsonLd.astro`

```astro
---
interface Props { data: Record<string, unknown> | Record<string, unknown>[] }
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

### `src/layouts/BaseLayout.astro`

```astro
---
import SEO from '../components/seo/SEO.astro';
import JsonLd from '../components/seo/JsonLd.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import { organizationSchema } from '../lib/schema';

interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  schemas?: Record<string, unknown>[]; // JSON-LD específico de cada página
  noindex?: boolean;
}
const { title, description, image, type, schemas = [], noindex } = Astro.props;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <SEO {title} {description} {image} {type} {noindex} />
    <JsonLd data={[organizationSchema(), ...schemas]} />
  </head>
  <body>
    <Header />
    <main id="main"><slot /></main>
    <Footer />
    <slot name="cta" />   <!-- región opcional: ej. botón flotante de WhatsApp -->
  </body>
</html>
```

### `src/components/layout/Breadcrumbs.astro`

```astro
---
interface Props { items: { name: string; href?: string }[] }
const { items } = Astro.props;
---
<nav aria-label="Migas de pan">
  <ol class="breadcrumbs">
    {items.map((it, i) => (
      <li>
        {it.href && i < items.length - 1
          ? <a href={it.href}>{it.name}</a>
          : <span aria-current="page">{it.name}</span>}
      </li>
    ))}
  </ol>
</nav>
```

> Usa siempre el mismo array para `Breadcrumbs` y `breadcrumbSchema` para que HTML visible y JSON-LD coincidan.

---

## 6. Componente WhatsApp

### `src/components/ui/WhatsAppButton.astro`

```astro
---
import { whatsappLink } from '../../lib/whatsapp';

interface Props {
  message: string;
  label?: string;
  variant?: 'primary' | 'floating';
  eventName?: string; // para analytics
}
const { message, label = 'Consultar por WhatsApp', variant = 'primary', eventName = 'whatsapp_click' } = Astro.props;
const href = whatsappLink(message);
---
<a
  href={href}
  class={`wa-btn wa-${variant}`}
  target="_blank"
  rel="noopener noreferrer"
  data-event={eventName}
  aria-label={label}
>
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.300 1.100-1.800 1.200-.5.1-1.100.1-1.800-.1a12 12 0 0 1-5.200-4.100c-.4-.5-1.300-1.800-1.300-3s.6-1.700.9-2c.2-.3.5-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200 0 .4-.1.500l-.4.500c-.1.100-.3.300-.1.600.6 1 1.400 1.800 2.400 2.300.3.200.5.100.6-.1l.7-.9c.2-.2.400-.2.600-.1l1.900.9c.2.100.4.200.4.300.1.200.1.700-.1 1.300Z"/>
  </svg>
  <span>{label}</span>
</a>

<style>
  .wa-btn { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.25rem;
    background:#25d366; color:#fff; border-radius:.5rem; font-weight:600; text-decoration:none; }
  .wa-btn:hover { background:#1ebe5b; }
  .wa-floating { position:fixed; right:1rem; bottom:1rem; z-index:50; border-radius:999px;
    box-shadow:0 4px 12px rgba(0,0,0,.25); }
</style>
```

Uso:

```astro
<WhatsAppButton message={productWhatsappMessage(name, pageUrl)} label="Cotizar por WhatsApp" />
<!-- Botón flotante global en el Footer o BaseLayout -->
<WhatsAppButton variant="floating" label="Escríbenos" message="Hola, quisiera información sobre sus productos y servicios." />
```

---

## 7. Página principal (servicio / centro ortopédico)

**Objetivo SEO:** posicionar por la keyword principal + ubicación (ej. "centro ortopédico en [ciudad]", "productos ortopédicos en [ciudad]").

### `src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
import ServicesGrid from '../components/home/ServicesGrid.astro';
import FeaturedCategories from '../components/home/FeaturedCategories.astro';
import WhyUs from '../components/home/WhyUs.astro';
import Faq from '../components/home/Faq.astro';
import LocationCta from '../components/home/LocationCta.astro';
import { api } from '../data/api';
import { faqSchema } from '../lib/schema';

const categories = api.categories.list();   // ya viene ordenado por `order`

const services = [
  { title: 'Evaluación ortopédica', text: 'Valoración personalizada de tu caso.', href: '/servicios/evaluacion-ortopedica/' },
  { title: 'Ortesis a medida', text: 'Soportes y ortesis adaptados a ti.', href: '/servicios/ortesis-a-medida/' },
  { title: 'Rehabilitación y asesoría', text: 'Acompañamiento en tu recuperación.', href: '/servicios/asesoria/' },
];

const faqs = [
  { q: '¿Atienden con cita previa?', a: 'Puedes visitarnos o agendar tu evaluación por WhatsApp.' },
  { q: '¿Realizan envíos?', a: 'Sí, coordinamos envíos. Consúltanos por WhatsApp.' },
];
---
<BaseLayout
  title="Centro Ortopédico y Productos Ortopédicos en [Ciudad]"
  description="Centro ortopédico con evaluación, ortesis a medida y venta de productos ortopédicos. Atención personalizada. Escríbenos por WhatsApp."
  schemas={[faqSchema(faqs)]}
>
  <Hero />                                  <!-- ÚNICO <h1> de la página -->
  <ServicesGrid services={services} />      <!-- <h2> Servicios -->
  <FeaturedCategories categories={categories} />
  <WhyUs />
  <Faq items={faqs} />
  <LocationCta />
</BaseLayout>
```

**Checklist de la home**
- Un solo `<h1>` con keyword + ciudad (ej: "Centro ortopédico en [Ciudad]").
- `<h2>` por sección: Servicios, Categorías, Por qué elegirnos, Preguntas frecuentes, Ubicación.
- Dirección, teléfono y horario visibles en HTML (coherentes con `LocalBusiness`).
- Enlaces internos hacia cada categoría y servicio con anchor text descriptivo.
- Mapa embebido con `loading="lazy"` en `LocationCta`.
- Imagen del hero con `fetchpriority="high"` y sin `loading="lazy"` (es el LCP).

---

## 8. Catálogo por categoría

**Objetivo SEO:** cada categoría es una landing que posiciona por "comprar [categoría] ortopédica".

### `src/pages/catalogo/[category].astro`

```astro
---
import { api } from '../../data/api';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/layout/Breadcrumbs.astro';
import ProductGrid from '../../components/catalog/ProductGrid.astro';
import WhatsAppButton from '../../components/ui/WhatsAppButton.astro';
import { breadcrumbSchema, itemListSchema } from '../../lib/schema';
import { SITE } from '../../lib/site';

export async function getStaticPaths() {
  return api.categories.list().map((cat) => ({
    params: { category: cat.slug },
    props: { cat, products: api.products.byCategory(cat.slug) },
  }));
}

const { cat, products } = Astro.props;

const crumbs = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalogo/' },
  { name: cat.name },
];
const abs = (p: string) => new URL(p, SITE.url).href;
---
<BaseLayout
  title={cat.seoTitle}
  description={cat.seoDescription}
  schemas={[
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: abs(c.href ?? Astro.url.pathname) }))),
    itemListSchema(products.map((p) => ({ name: p.name, url: abs(`/producto/${p.slug}/`) }))),
  ]}
>
  <Breadcrumbs items={crumbs} />
  <h1>{cat.name}</h1>
  <p class="category-intro">{cat.intro}</p>   <!-- texto SEO único de la categoría -->
  <ProductGrid products={products} />
  <WhatsAppButton message={`Hola, quiero información sobre ${cat.name}.`} label="Asesoría gratuita por WhatsApp" />
</BaseLayout>
```

### `src/components/catalog/ProductGrid.astro`

```astro
---
import ProductCard from './ProductCard.astro';
type CardProduct = {
  slug: string;
  name: string;
  price?: number;
  images: { src: ImageMetadata; alt: string }[];
};
interface Props { products: CardProduct[] }   // slice que consume, no la entidad entera
const { products } = Astro.props;
---
<ul class="product-grid" role="list">
  {products.map((p, i) => (
    <li><ProductCard product={p} priority={i < 4} /></li>
  ))}
</ul>
```

### `src/components/catalog/ProductCard.astro`

```astro
---
import { Image } from 'astro:assets';
interface Props {
  product: {                      // slice mínimo: ISP, no el objeto entero
    slug: string;
    name: string;
    price?: number;
    images: { src: ImageMetadata; alt: string }[];
  };
  priority?: boolean;
}
const { product, priority = false } = Astro.props;
const { slug, name, price, images } = product;
---
<article class="card">
  <a href={`/producto/${slug}/`}>
    <Image
      src={images[0].src}
      alt={images[0].alt}
      width={400}
      height={400}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      format="webp"
    />
    <h2>{name}</h2>
  </a>
  <p class="price">{price ? `S/ ${price}` : 'Consultar precio'}</p>
</article>
```

**Checklist de categoría**
- `<h1>` = nombre de la categoría; cada tarjeta usa `<h2>`.
- Texto introductorio único (150–300 palabras) arriba o abajo del grid.
- Paginación con URLs limpias (`/catalogo/rodilleras/2/`) si supera ~24 productos, usando `paginate()` de Astro, con `rel="canonical"` propio por página.
- Evita URLs con parámetros de filtro indexables (`?color=negro`); si necesitas filtros, hazlos con JS cliente.

---

## 9. Página de producto

**Objetivo SEO:** posicionar por el nombre + intención ("rodillera para ligamentos comprar"), con rich results de Producto.

### `src/pages/producto/[slug].astro`

```astro
---
import { api } from '../../data/api';
import { getImage } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/layout/Breadcrumbs.astro';
import ProductGallery from '../../components/product/ProductGallery.astro';
import ProductInfo from '../../components/product/ProductInfo.astro';
import ProductSpecs from '../../components/product/ProductSpecs.astro';
import RelatedProducts from '../../components/product/RelatedProducts.astro';
import { breadcrumbSchema, productSchema, faqSchema } from '../../lib/schema';
import { productWhatsappMessage } from '../../lib/whatsapp';
import { SITE } from '../../lib/site';

export async function getStaticPaths() {
  return api.products.list().map((product) => ({
    params: { slug: product.slug },
    props: {
      product,
      category: api.categories.bySlug(product.category),
      related: api.products.related(product.slug),
    },
  }));
}

const { product, category, related } = Astro.props;
const { name, seoTitle, seoDescription, description, images, price, availability, sku, brand, faq, specs } = product;

const pageUrl = new URL(Astro.url.pathname, SITE.url).href;
const ogImg = await getImage({ src: images[0].src, width: 1200, height: 630, format: 'jpg' });
const imageUrls = await Promise.all(
  images.map(async (i) => new URL((await getImage({ src: i.src, width: 1200, format: 'jpg' })).src, SITE.url).href)
);

const crumbs = [
  { name: 'Inicio', href: '/' },
  { name: category.name, href: `/catalogo/${category.slug}/` },
  { name },
];
---
<BaseLayout
  title={seoTitle ?? name}
  description={seoDescription}
  image={ogImg.src}
  type="product"
  schemas={[
    breadcrumbSchema(crumbs.map((c) => ({ name: c.name, url: new URL(c.href ?? Astro.url.pathname, SITE.url).href }))),
    productSchema({
      name, description: seoDescription, images: imageUrls, url: pageUrl,
      sku, brand, price, availability,
    }),
    ...(faq ? [faqSchema(faq)] : []),
  ]}
>
  <Breadcrumbs items={crumbs} />

  <div class="product-layout">
    <ProductGallery images={images} />
    <ProductInfo
      {name}
      {price}
      {availability}
      whatsappMessage={productWhatsappMessage(name, pageUrl)}
    />
  </div>

  <section class="product-description">
    <h2>Descripción</h2>
    <p>{description}</p>          <!-- texto propio, no Markdown -->
  </section>

  {specs && <ProductSpecs {specs} />}

  <RelatedProducts products={related} />
</BaseLayout>
```

### `src/components/product/ProductInfo.astro`

```astro
---
import WhatsAppButton from '../ui/WhatsAppButton.astro';
interface Props {
  name: string; price?: number; availability: string; whatsappMessage: string;
}
const { name, price, availability, whatsappMessage } = Astro.props;
const stock = { InStock: 'Disponible', OutOfStock: 'Agotado', PreOrder: 'Por encargo' } as const;
---
<section class="product-info">
  <h1>{name}</h1>
  <p class="price">{price ? `S/ ${price}` : 'Consulta el precio por WhatsApp'}</p>
  <p class="stock">{stock[availability as keyof typeof stock]}</p>
  <WhatsAppButton message={whatsappMessage} label="Pedir por WhatsApp" eventName="whatsapp_product" />
</section>
```

### `src/components/product/ProductGallery.astro`

```astro
---
import { Image } from 'astro:assets';
interface Props { images: { src: ImageMetadata; alt: string }[] }
const { images } = Astro.props;
---
<div class="gallery">
  <Image src={images[0].src} alt={images[0].alt} width={800} height={800}
         loading="eager" fetchpriority="high" format="webp" />
  <ul class="thumbs" role="list">
    {images.slice(1).map((img) => (
      <li><Image src={img.src} alt={img.alt} width={160} height={160} loading="lazy" format="webp" /></li>
    ))}
  </ul>
</div>
```

**Checklist de producto**
- `<h1>` único = nombre del producto.
- `alt` descriptivo y distinto por imagen.
- Descripción original, sin copiar del proveedor (evita contenido duplicado).
- JSON-LD `Product` + `BreadcrumbList` (+ `FAQPage` si hay preguntas visibles en la página).
- El schema debe reflejar lo que ve el usuario (mismo precio, misma disponibilidad).
- Productos agotados: mantener la URL, cambiar disponibilidad y sugerir alternativas (no borrar ni redirigir sin motivo).
- Productos descontinuados: redirección 301 a la categoría.

---

## 10. Estructura de URLs

| Página | URL |
|---|---|
| Home | `/` |
| Todas las categorías | `/catalogo/` |
| Categoría | `/catalogo/rodilleras/` |
| Producto | `/producto/rodillera-ligamentos/` |
| Servicio | `/servicios/ortesis-a-medida/` |

Reglas: minúsculas, guiones, sin tildes ni `ñ`, sin fechas, estables en el tiempo.

---

## 11. Rendimiento (Core Web Vitals)

- Todas las imágenes con `astro:assets` (`<Image />`): WebP/AVIF, `width` y `height` para evitar CLS.
- Solo la imagen LCP con `loading="eager"` y `fetchpriority="high"`.
- Fuentes: autoalojadas (`@fontsource`) con `font-display: swap`, máximo 2 pesos.
- Sin frameworks JS (React/Vue) salvo que una isla realmente lo necesite; si lo usas, `client:visible` o `client:idle`.
- CSS con `<style>` de Astro (scoped) o un único stylesheet global pequeño.
- Objetivos: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.

---

## 12. SEO local y de negocio

- Alta y verificación en **Google Business Profile** (misma dirección, teléfono y horario que la web, exactamente igual).
- Datos NAP consistentes en footer, página de contacto y `LocalBusiness`.
- Página de contacto con mapa, cómo llegar y botón de WhatsApp.
- Reseñas reales enlazadas (no marcar reseñas como `AggregateRating` si no son visibles y verificables).
- Páginas de servicio individuales con contenido propio (500+ palabras): qué es, para quién, cómo funciona, FAQ.

---

## 13. Medición

Rastrear clics en WhatsApp como conversión (Google Analytics 4 o similar):

```astro
<script>
  document.querySelectorAll<HTMLAnchorElement>('a[data-event]').forEach((a) => {
    a.addEventListener('click', () => {
      // @ts-ignore
      window.gtag?.('event', a.dataset.event, { link_url: a.href, page_path: location.pathname });
    });
  });
</script>
```

Herramientas: Google Search Console (enviar `sitemap-index.xml`), PageSpeed Insights, Rich Results Test.

---

## 14. Checklist final antes de publicar

- [ ] `site` configurado en `astro.config.mjs` con el dominio real.
- [ ] Un solo `<h1>` por página y jerarquía `h2 > h3` coherente.
- [ ] `title` (≤ 60 car.) y `description` (≤ 160 car.) únicos por página.
- [ ] Canonical correcto y `trailingSlash` consistente.
- [ ] JSON-LD validado en Rich Results Test (Organization, Product, Breadcrumb, FAQ).
- [ ] Sitemap y robots.txt accesibles.
- [ ] Imágenes con `alt`, dimensiones y formato moderno.
- [ ] Enlaces internos: home → categorías → productos → categoría relacionada.
- [ ] Botón de WhatsApp con mensaje prellenado incluyendo nombre y URL del producto.
- [ ] Página 404 útil con enlaces a categorías.
- [ ] Certificado HTTPS y redirección `www` ↔ sin `www` (una sola versión).
- [ ] Search Console y analítica conectados.

---

## 15. Nota de contenido (YMYL)

Los productos ortopédicos son del sector salud. Para ganar confianza:
- Evita prometer curas o resultados médicos; usa lenguaje como "ayuda a", "brinda soporte".
- Muestra quién está detrás del centro (profesionales, credenciales, años de experiencia) en una página "Nosotros".
- Indica que la elección del producto debe ser guiada por un profesional de la salud.