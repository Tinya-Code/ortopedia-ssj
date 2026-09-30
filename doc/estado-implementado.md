# Estado implementado: páginas, componentes y datos

Inventario *as-built* del sitio **Centro Ortopédico SSJ** (Astro 7 + Tailwind v4, SSG puro).
Sirve para que otro agente —o una persona— sepa **qué existe hoy, cómo está compuesto cada
página y con qué datos reales trabaja**, sin tener que reconstruirlo leyendo el código.

> Documento generado el 30/09/2026 desde el código de `src/`. Si se modifica una página o un
> componente, actualizar este archivo (ver §9).

## Ruta rápida

1. §2 tablas de rutas y componentes → dónde está cada cosa.
2. §3 composición página por página → en qué orden se renderiza y con qué props.
3. §4 datos reales → `SITE`, `LEGAL` y la forma de `api.js`.
4. §6 comandos → verificar que el documento sigue siendo cierto.

---

## 1. Stack y configuración

| Tema | Decisión |
|---|---|
| Framework | Astro 7, output estático (SSG). Sin adaptador, sin SSR. |
| Estilos | Tailwind v4 vía `@tailwindcss/vite`; tokens en `src/styles/global.css` `@theme` |
| Contenido | **No** usa `astro:content` ni content collections: los datos viven en `src/data/api.js` |
| JS en cliente | Solo dos `<script>` inline: handler de submit del libro de reclamaciones y hook `dataLayer`. Cero frameworks (React/Vue) |
| `site` | `https://www.example.com` (placeholder — pendiente dominio real) |
| `trailingSlash` | `'always'`: **toda** URL interna termina en `/` |
| Sitemap | `@astrojs/sitemap` → `sitemap-index.xml` + `sitemap-0.xml` (16 URLs); referenciado en `public/robots.txt` |
| Build | `build: { inlineStylesheets: 'auto' }`, `compressHTML: true` |
| Fuentes | `@fontsource/inter` 400 y 600 (autoalojadas), `font-display: swap` |
| Gate de tipos | `pnpm check` (`astro check` + `typescript@6`) debe dar 0 errores |
| Build | `pnpm build` → 17 HTML (16 páginas + `404.html`) |

### Design tokens (`src/styles/global.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#1d69f0` | `text-primary`, `bg-primary`, títulos de acento, enlaces |
| `--color-secondary` | `#21a7a5` | `bg-secondary` (variante de botón), CTA secundario |
| `--color-accent` | `#f59e0b` | `text-accent` (enlace del Libro de Reclamaciones) |
| `--color-neutral` | `#6b7280` | texto corrido, bordes `border-neutral/20` |
| `--font-body` / `--font-display` | Inter | cuerpo / títulos (`font-display`) |
| `--default-font-family` | `var(--font-body)` | preflight de Tailwind |

Único hex suelto permitido en componentes: `#25d366` (verde WhatsApp) en `WhatsAppButton`.

### Árbol de fuentes

```
src/
├─ layouts/BaseLayout.astro        chrome global + SEO + JSON-LD + WhatsApp flotante
├─ pages/                          10 archivos → 17 HTML
│  ├─ index.astro · 404.astro · contacto.astro
│  ├─ catalogo/{index,[category]}.astro
│  ├─ producto/[slug].astro
│  └─ libro-de-reclamaciones.astro · terminos-y-condiciones.astro
│     politica-de-privacidad.astro · cambios-y-devoluciones.astro
├─ components/
│  ├─ home/       Hero · ServicesGrid · FeaturedCategories · WhyUs · Faq · LocationCta
│  ├─ catalog/    CategoryCard · ProductGrid · ProductCard
│  ├─ product/    ProductGallery · ProductInfo · ProductSpecs · RelatedProducts
│  ├─ legal/      LegalFooter · ReclamacionesLink · ProductLegal · ReclamacionForm
│  ├─ layout/     Header · Footer · Breadcrumbs
│  ├─ seo/        SEO · JsonLd
│  └─ ui/         Button (sin uso) · WhatsAppButton
├─ lib/          site.ts (SITE+LEGAL) · whatsapp.ts · schema.ts · hours.ts
├─ data/api.js   única fuente de datos (3 categorías, 7 productos)
├─ assets/       home/hero.jpg · products/*.jpg  (imágenes de prueba)
└─ styles/global.css
```

---

## 2. Tablas de referencia

### 2.1 Rutas (17 HTML)

| Ruta | Archivo | `<title>` | Qué renderiza |
|---|---|---|---|
| `/` | `pages/index.astro` | Centro ortopédico en Ciudad | Hero → servicios → categorías → por qué elegirnos → FAQ → ubicación |
| `/catalogo/` | `pages/catalogo/index.astro` | Catálogo de productos ortopédicos | Breadcrumbs + h1 + grilla de 3 categorías |
| `/catalogo/rodilleras/` | `pages/catalogo/[category].astro` | Rodilleras ortopédicas | Breadcrumbs + h1 + intro (~150 palabras) + grid de 2 productos + CTA |
| `/catalogo/bastones/` | ídem | Bastones ortopédicos | ídem (2 productos) |
| `/catalogo/sillas-de-ruedas/` | ídem | Sillas de ruedas manuales | ídem (2 productos) |
| `/producto/rodillera-ligamentos/` | `pages/producto/[slug].astro` | Rodillera con soporte de ligamentos | Galería + info + descripción + specs + relacionados + legal |
| `/producto/rodillera-deporte/` | ídem | Rodillera elástica para deporte | ídem (1 imagen, specs de tallas, sin FAQ) |
| `/producto/baston-plegable/` | ídem | Bastón plegable de aluminio | ídem |
| `/producto/baston-cuatro-puntos/` | ídem | Bastón de cuatro puntos de apoyo | ídem |
| `/producto/silla-ruedas-plegable/` | ídem | Silla de ruedas plegable en aluminio | ídem (2 imágenes + FAQ) |
| `/producto/silla-ruedas-aluminio/` | ídem | Silla de ruedas estándar en aluminio | ídem (disponible `PreOrder`) |
| `/contacto/` | `pages/contacto.astro` | Contacto | Breadcrumbs + h1 + párrafo + ubicación (NAP+mapa) |
| `/libro-de-reclamaciones/` | `pages/libro-de-reclamaciones.astro` | Libro de Reclamaciones | Identificación del proveedor + aviso de plazo + formulario |
| `/terminos-y-condiciones/` | `pages/terminos-y-condiciones.astro` | Términos y condiciones | Artículo legal con 9 secciones |
| `/politica-de-privacidad/` | `pages/politica-de-privacidad.astro` | Política de privacidad | Artículo legal con 8 secciones |
| `/cambios-y-devoluciones/` | `pages/cambios-y-devoluciones.astro` | Cambios y devoluciones | Artículo legal con 7 secciones |
| `404.html` | `pages/404.astro` | Página no encontrada | `noindex` + enlaces a categorías + inicio |

**No existen**: `/servicios/[slug]`, `/comprobantes-y-envios/` (decisión de alcance) y la ficha
`rodillera-en-validacion` (filtrada por la regla editorial de registro sanitario).

### 2.2 Componentes

| Archivo | Props (tipo = default) | Qué renderiza | Usado en |
|---|---|---|---|
| `layout/Header.astro` | — | Barra superior: logo/marca → nav 4 enlaces (`aria-current`) → `ReclamacionesLink` | BaseLayout |
| `layout/Footer.astro` | — | 2 columnas (`sm:grid-cols-2`): NAP + horario + nav, y `LegalFooter` | BaseLayout |
| `layout/Breadcrumbs.astro` | `items: {name, href?}[]` | `<nav aria-label="Migas de pan">` con `>` separadores; último item sin enlace | catálogo, categoría, producto, contacto |
| `seo/SEO.astro` | `title, description, image?='/og-default.jpg', type?='website', noindex?=false` | `<title>` (agrega `| {SITE.name}` si no viene), description, canonical, `noindex` condicional, OG y Twitter. Avisa en dev si title >60 o description >160 | BaseLayout |
| `seo/JsonLd.astro` | `data: obj \| obj[]` | `<script type="application/ld+json">` con `set:html` | BaseLayout |
| `ui/WhatsAppButton.astro` | `message, label?='Consultar por WhatsApp', variant?='primary'\|'floating', eventName?='whatsapp_click'` | `<a wa.me>` con `target=_blank`, `data-event`, icono SVG inline. Variante `floating` es fijo abajo a la derecha | `LocationCta` (home y contacto), `ProductInfo`, página de categoría, flotante global (BaseLayout) |
| `ui/Button.astro` | `href, label?, variant?='primary'\|'secondary'\|'outline', eventName?, rel?` | Enlace con forma de botón (también acepta `<slot/>`) | **sin uso** (código muerto) |
| `home/Hero.astro` | `title, text?, image: ImageMetadata, imageAlt` | Sección a 2 columnas: `<h1>` + párrafo + `<slot/>` \| imagen LCP (`fetchpriority=high`, `loading=eager`, webp `srcset` 600/1000/1600w) | index |
| `home/ServicesGrid.astro` | `services: {title,text,href}[]` | `<section id="servicios">` con h2 + grid de tarjetas enlazadas a WhatsApp (`target=_blank`) | index |
| `home/FeaturedCategories.astro` | `categories: {slug,name,seoDescription,image,imageAlt}[]` | `<ul>` grid 1/2/3 columnas; cada tarjeta enlaza a `/catalogo/{slug}/` con `<Image>` webp 600×600 lazy | index |
| `home/WhyUs.astro` | — | h2 "Por qué elegirnos" + 4 tarjetas (`sm:grid-cols-2`) con texto fijo dentro del componente | index |
| `home/Faq.astro` | `items: {q,a}[]` | `<dl>` de preguntas/respuestas (solo HTML; el JSON-LD lo arma la página) | index |
| `home/LocationCta.astro` | — | `<section id="ubicacion">`: h2 + `<address>` NAP + horario + correo + WhatsAppButton \| `<iframe>` Google Maps (sin API key, `loading=lazy`) | index, contacto |
| `catalog/CategoryCard.astro` | `category: {slug,name,seoDescription,image,imageAlt}` | Artículo con `<Image>` webp cuadrada + h2 "Ver {categoría}" + descripción | catálogo |
| `catalog/ProductGrid.astro` | `products: {slug,name,price?,images}[]` | `<ul>` grid 1/2/3 columnas; los 4 primeros pasan `priority=true` (eager) | categoría |
| `catalog/ProductCard.astro` | `product: {slug,name,price?,images}, priority?=false` | Tarjeta: `<Image>` webp 400×400 + h2 + precio `S/ X.XX` o "Consultar precio" | ProductGrid |
| `product/ProductGallery.astro` | `images: {src,alt}[]` | Imagen principal (800×800, `fetchpriority=high`) + miniaturas 160×160 lazy | producto |
| `product/ProductInfo.astro` | `name, price?, availability, whatsappMessage` | **`<h1>`** + precio `S/ X.XX` (o "Consulta el precio por WhatsApp") + estado de stock + aviso de IGV + WhatsAppButton (`whatsapp_product`) | producto |
| `product/ProductSpecs.astro` | `specs: Record<string,string>` | `<dl>` de especificaciones con `divide-y`; **no renderiza nada si `specs` está vacío** | producto |
| `product/RelatedProducts.astro` | `products: {slug,name,price?}[]` | h2 "Productos relacionados" + `<ul>` de enlaces simples (sin tarjeta con h2, para no romper jerarquía) | producto |
| `legal/LegalFooter.astro` | — | Razón social + RUC + domicilio + mail/tel, nav legal (3 enlaces + `ReclamacionesLink`), nota de IGV + comprobante + © año | Footer |
| `legal/ReclamacionesLink.astro` | — | Enlace `text-accent` con icono a `/libro-de-reclamaciones/` | Header y LegalFooter (2× por página) |
| `legal/ProductLegal.astro` | `registroSanitario?, claseRiesgo?, titularRegistro?, priceIncludesIGV?=true` | `<aside>` con registro sanitario/clase/titular, aviso de IGV y aviso médico obligatorio | producto |
| `legal/ReclamacionForm.astro` | `endpoint: string` | Hoja de reclamación: 4 campos ocultos del proveedor + 3 fieldsets + consentimiento + botón; manejo de submit (§5.4) | libro-de-reclamaciones |

---

## 3. Composición página por página

Cada página arranca con `BaseLayout`, que siempre renderiza: `<head>` con `SEO` +
`JsonLd` (siempre `organizationSchema()`, esquemas de la página + los que pase la página),
y `<body>` con `Header` → `<main id="main"><slot/></main>` → `Footer` →
**`<slot name="cta"/>` (hoy sin uso en ninguna página)** → WhatsApp flotante global
(`variant="floating"`, `data-event="whatsapp_click"`).

### 3.0 Cómo se distribuye el espacio (reglas globales)

| Regla | Detalle |
|---|---|
| Contenedor ancho | `mx-auto max-w-6xl px-4` (1152px) en home, catálogo, categoría, producto y contacto |
| Contenedor estrecho | `mx-auto max-w-3xl px-4` (768px) centrado en los 3 legales, libro de reclamaciones y 404 |
| Medida de texto | párrafos largos con `max-w-prose` (65ch) dentro del contenedor |
| **Apilado → columnas** | todo apila en móvil; `sm:640px` activa 2 columnas de tarjetas, `md:768px` activa las 2 columnas grandes (hero, galería, ubicación), `lg:1024px` activa 3 columnas de tarjetas |
| Bandas de home | fondo alternado: blanco → gris `bg-neutral/5` (servicios) → blanco (categorías) → gris (por qué elegirnos) → blanco (FAQ) → gris (ubicación) |
| Header / Footer | full-bleed (`border-b`/`border-t`, fondo blanco) con contenido interno `max-w-6xl`; footer en `sm:grid-cols-2` |
| Altura de página | `<body class="flex min-h-screen flex-col">` + `<main class="flex-1">` → el **footer queda pegado al piso** aunque el contenido sea corto |
| Fijo | único elemento flotante: botón WhatsApp `fixed bottom-4 right-4 z-50` |
| Ritmo vertical | bandas de sección `py-12`; secciones dentro de una página `py-8`; bloques separados con `mt-8`/`mt-10`; tarjetas `p-4` (catálogo) o `p-6` (home) |

### `/` — `pages/index.astro`
```
BaseLayout (title: "Centro ortopédico en {city}", schemas: faqSchema ×4)
1. Hero          title, text, image=hero.jpg, imageAlt   ← h1 único de la home
2. ServicesGrid  services: 3 objetos con href=wa.me      ← <section id="servicios">
3. FeaturedCategories  categories = api.categories.list() (3 CategoryCard)
4. WhyUs         datos fijos dentro del componente
5. Faq           4 FAQs definidos en la página (una usa LEGAL.pricesIncludeIGV)
6. LocationCta   NAP + iframe de mapa + botón WhatsApp
```
Los datos de servicios y FAQ se definen **en la página** (capa smart), no en `api.js`.
`Hero` expone `<slot/>` pero la home no le pasa contenido (render vacío).

**Distribución**: única página con 6 bandas a ancho completo. El hero es el único lugar con
2 columnas de texto+imagen (izquierda texto, derecha imagen en `md`); el resto son grillas de
tarjetas que apilan en móvil. FAQ y contenido de lectura van en columna angosta centrada.

```
[header  max-w-6xl: marca · nav · libro de reclamaciones    ]  full-bleed
[HERO   md:2col → h1+p+CTA (izq) | imagen 1600x900 (der)   ]  blanco
[SERVICIOS  bg gris · grid sm:2 lg:3 tarjetas enlazadas     ]  id="servicios"
[CATEGORÍAS blanco · grid sm:2 lg:3 tarjetas con imagen     ]
[POR QUÉ     bg gris · grid sm:2 (4 tarjetas = 2×2)         ]
[FAQ         blanco · max-w-3xl centrado · dl apilado       ]
[UBICACIÓN   bg gris · md:2col → NAP+CTA (izq) | mapa (der) ]
[footer sm:2col → NAP+nav | bloque legal ]   [● WhatsApp flotante fijo abajo-dcha]
```

### `/catalogo/` — `pages/catalogo/index.astro`
```
BaseLayout (schemas: breadcrumbSchema + itemListSchema de categorías)
1. Breadcrumbs   [Inicio, Catálogo]
2. section       h1 "Catálogo" + párrafo intro (inline)
3. grid          categories.map → <CategoryCard>   (grid sm:2 / lg:3)
```

**Distribución**: columna única angosta-abierta (no hay 2 columnas grandes); la variedad la
dan las 3 tarjetas cuadradas que pasan de apiladas (móvil) → 2 col (`sm`) → 3 col (`lg`).

### `/catalogo/[category]` — `pages/catalogo/[category].astro`
```
getStaticPaths: api.categories.list() → props { cat, products: api.products.byCategory(cat.slug) }
BaseLayout (title: cat.seoTitle ?? cat.name, schemas: breadcrumb + itemList de productos)
1. Breadcrumbs   [Inicio, Catálogo, {categoría}]
2. section       h1 {cat.name} + párrafo {cat.intro} (~150 palabras, inline)
3. ProductGrid   products (o párrafo fallback si la categoría queda vacía)
4. WhatsAppButton  message=categoryWhatsappMessage(cat.name)
```

**Distribución**: lectura vertical en una sola columna dentro de `max-w-6xl`; el `intro` de la
categoría va en medida angosta (`max-w-prose`) y la grilla de productos ocupa todo el ancho
disponible (apilada → 2 col `sm` → 3 col `lg`). El CTA queda suelto debajo, no en columna lateral.

### `/producto/[slug]` — `pages/producto/[slug].astro`
```
getStaticPaths: api.products.list().flatMap(p → si categoría existe, genera ruta)
frontmatter: ogImage = getImage(w1200×h630, format jpg)  ← og:image
             imageUrls = getImage(w1200, format jpg) por imagen ← image del Product schema
BaseLayout (schemas: breadcrumb + product + faq si el producto tiene faq)
1. Breadcrumbs   [Inicio, Catálogo, {categoría}, {producto}]
2. section       grid md:grid-cols-2 → 2.1 ProductGallery   ← imagen principal eager+priority
                                       → 2.2 ProductInfo    ← h1 + precio + stock + IGV + WhatsApp
3. section       h2 "Descripción" + párrafo (inline)
4. ProductSpecs  si product.specs
5. RelatedProducts  related = api.products.related(slug)
6. ProductLegal  registro + clase + titular + IGV + aviso médico
```
El `<h1>` de la ficha vive dentro de `ProductInfo`, no en la página.

**Distribución**: la única página con **galería + datos en paralelo**. En `md` la galería ocupa
la mitad izquierda y la ficha (h1, precio, stock, CTA) la derecha; debajo, todo vuelve a una
columna de lectura: descripción en medida angosta → tabla de specs (cada fila es `sm:3col`:
clave a la izquierda, valor a la derecha) → relacionados en 2 columnas → caja legal con fondo gris.

```
[Breadcrumbs                                              max-w-6xl]
[ md:2col → GALERÍA (img800 + fila miniaturas) | FICHA: h1/precio/CTA ]
[Descripción        h2 + párrafo  max-w-prose                        ]
[Especificaciones   dl: [clave | valor      ] filas sm:3col           ]
[Relacionados       grid sm:2col (enlaces + precio)                   ]
[aside legal        bg gris, borde redondeado, texto chico            ]
```

### `/contacto/` — `pages/contacto.astro`
```
BaseLayout (schemas: ContactPage inline)
1. Breadcrumbs   [Inicio, Contacto]
2. section       h1 + párrafo (inline, con TODO de punto de referencia)
3. LocationCta   mismo componente que en la home
```

**Distribución**: texto corto arriba (columna única) y después reutiliza la misma grilla de
2 columnas `md` de la home: NAP a la izquierda, mapa embebido a la derecha (en móvil el mapa
queda debajo con altura fija `h-80`).

### `/libro-de-reclamaciones/` — `pages/libro-de-reclamaciones.astro`
```
frontmatter: const ENDPOINT = 'https://example.com/api/reclamos'   ← TODO: URL real
BaseLayout
article
1. h1
2. TODO         (comentario): aviso oficial de INDECOPI pendiente de subir
3. p            identificación del proveedor (LEGAL.legalName/RUC/domicilio + SITE phone/email)
4. div aviso    "respondemos en máximo {LEGAL.reclamosResponseDays} días hábiles" + 2 años
5. ReclamacionForm  endpoint={ENDPOINT}
6. p            enlace a WhatsApp
```

**Distribución**: columna estrecha (`max-w-3xl`) centrada, todo apilado. Son 3 fieldsets
numerados, cada uno una caja con borde y `legend` pegada al borde superior: los dos primeros
(1 Identificación, 2 Bien o servicio) usan `grid sm:2col` adentro — nombres/domicilio/email
pares —; el tercero (3 Detalle) es columna única: select de tipo + `textarea detalle` +
`textarea pedido` a ancho completo. Debajo, el checkbox de consentimiento y el botón de envío
sueltos. Al confirmar, **los campos desaparecen y el mensaje de éxito ocupa su lugar**
(mismo bloque `data-status`, sin modal ni redirección).

### Legales — `terminos/`, `politica-de-privacidad/`, `cambios-y-devoluciones/`
Estructura idéntica: `BaseLayout` → `<article class="mx-auto max-w-3xl">` → `h1` →
`<section class="mt-8">` numeradas con `h2`. **Sin breadcrumbs y sin JSON-LD propio**
(solo el de la organización). Contenido en español neutro, datos desde `LEGAL`/`SITE` +
`formatHours()` (horario compartido con footer y LocationCta).

**Distribución**: columna estrecha centrada (`max-w-3xl`) y puramente vertical: `h1` seguido
de secciones numeradas con `h2` y saltos `mt-8` — sin grillas, sin imágenes, sin asides.
Son las páginas más "densas" en texto y las más simples en layout.

| Página | Secciones |
|---|---|
| Términos (544 palabras) | 1 Identificación · 2 Precios · 3 Cómo comprar · 4 Envíos · 5 Comprobante · 6 Disponibilidad y registro · 7 Reclamos · 8 Cambios/devoluciones/datos · 9 Modificaciones |
| Privacidad (472) | 1 Responsable · 2 Datos que recogemos · 3 Finalidad · 4 Conservación · 5 Con quién se comparten · 6 Derechos ARCO · 7 Cookies y analítica · 8 Cambios |
| Cambios y devoluciones (421) | 1 Plazo · 2 Estado · 3 Flete · 4 Excepciones por higiene · 5 Reembolsos y nota de crédito · 6 Garantía · 7 Cómo solicitarlo |

### `404` — `pages/404.astro`
`BaseLayout noindex` → `h1` + párrafo + chips de las 3 categorías (desde `api.categories.list()`)
+ enlace "Volver al inicio".

**Distribución**: columna estrecha centrada con `py-16` (mucho aire arriba y abajo); las
categorías son chips tipo botón con `flex flex-wrap gap-3` que se acomodan en varias filas.

---

## 4. Datos reales (el objeto)

### 4.1 `src/lib/site.ts`

```ts
export const SITE = {
  name: 'Centro Ortopédico SSJ',
  url: 'https://www.example.com',           // TODO: dominio real
  description: 'Centro ortopédico: venta de productos ortopédicos, ortesis, prótesis y servicios de evaluación.',
  phone: '+51 000 000 000',
  whatsapp: '51000000000',                  // sin + ni espacios (formato wa.me)
  email: 'contacto@example.com',
  address: { street: 'Av. Ejemplo 123', city: 'Ciudad', region: 'Región', postalCode: '00000', country: 'PE' },
  geo: { lat: -12.0464, lng: -77.0428 },
  hours: [ { days: ['Monday'..'Friday'], opens: '09:00', closes: '19:00' },
           { days: ['Saturday'], opens: '09:00', closes: '14:00' } ],
  social: ['https://facebook.com/example', 'https://instagram.com/example'],
  currency: 'PEN',
} as const;

export const LEGAL = {
  legalName: 'RAZÓN SOCIAL DE PRUEBA S.A.C.',
  tradeName: 'Centro Ortopédico SSJ',
  ruc: '20000000001',
  fiscalAddress: 'Av. Ejemplo 123, Distrito, Ciudad, Perú',
  email: 'contacto@example.com',
  phone: '+51 000 000 000',
  reclamosEmail: 'reclamos@example.com',
  reclamosResponseDays: 15,                 // [VALIDAR reglamento vigente]
  pricesIncludeIGV: true,
  currency: 'PEN',
} as const;
```

**Son datos de prueba.** Todo lo que se ve en footer, contacto, términos y JSON-LD sale de
estos dos objetos: cambiarlos aquí cambia el sitio completo (coherencia NAP garantizada).

### 4.2 `src/data/api.js` — forma y contenido

Estructura: `db = { categories: [...], products: [...] }` exportado **solo** a través de `api`
(las páginas nunca importan `db`). Importa las imágenes como `ImageMetadata` (import de jpg).

**Categorías** (`api.categories.list()` ordena por `order`):

| slug | name | seoTitle | productos |
|---|---|---|---|
| `rodilleras` | Rodilleras | Rodilleras ortopédicas | 2 publicados (+1 filtrado) |
| `bastones` | Bastones | Bastones ortopédicos | 2 |
| `sillas-de-ruedas` | Sillas de ruedas | Sillas de ruedas manuales | 2 |

Cada categoría: `slug, name, seoTitle, seoDescription, intro (~150 palabras únicas), image
(ImageMetadata), imageAlt, order`.

**Productos** (7 en `db`, **6 publicables**):

| slug | name | cat | price | availability | sku | registro | featured |
|---|---|---|---|---|---|---|---|
| `rodillera-ligamentos` | Rodillera con soporte de ligamentos | rodilleras | 120 | InStock | ROD-001 | DM-2024-0001 (II) | ✅ |
| `rodillera-deporte` | Rodillera elástica para deporte | rodilleras | 85 | InStock | ROD-002 | DM-2024-0002 (I) | — |
| `baston-plegable` | Bastón plegable de aluminio | bastones | 75 | InStock | BAS-001 | DM-2023-0140 (I) | — |
| `baston-cuatro-puntos` | Bastón de cuatro puntos de apoyo | bastones | 145 | InStock | BAS-002 | DM-2023-0141 (II) | ✅ |
| `silla-ruedas-plegable` | Silla de ruedas plegable | sillas-de-ruedas | 890 | InStock | SRU-001 | DM-2022-0871 (I) | ✅ |
| `silla-ruedas-aluminio` | Silla de ruedas estándar en aluminio | sillas-de-ruedas | 1250 | **PreOrder** | SRU-002 | DM-2022-0872 (I) | — |
| `rodillera-en-validacion` | Rodillera en validación de registro | rodilleras | 99 | OutOfStock | ROD-999 | **sin registro → filtrado** | — |

Campos por producto: `slug, name, category, seoTitle?, seoDescription, description, images[]
({src: ImageMetadata, alt}), price?, availability, brand?, sku, registroSanitario?,
claseRiesgo?, titularRegistro?, condition, specs? (obj), faq? ({q,a}[]), featured`.

**Regla editorial** (corre en cada build):
```js
const isPublishable = (p) => Boolean(p.registroSanitario);
// si hay filtrados: console.warn("[data] N producto(s) sin registro sanitario NO se publicarán: …")
```
`rodillera-en-validacion` **no tiene ruta, no aparece en el sitemap ni en listados**.

**Métodos de `api`:**

| Método | Devuelve |
|---|---|
| `categories.list()` | las 3 categorías ordenadas por `order` |
| `categories.bySlug(slug)` | categoría o `undefined` |
| `products.list()` | solo publicables (6) |
| `products.bySlug(slug)` | producto publicable o `undefined` |
| `products.byCategory(slug)` | publicables de esa categoría |
| `products.featured(limit = 6)` | los marcados `featured: true` |
| `products.related(slug, limit = 4)` | mismos `category`, excluyendo el actual |
| `products.hidden()` | los filtrados (auditoría) |

### 4.3 `src/lib/*`

| Archivo | Exporta | Comportamiento |
|---|---|---|
| `whatsapp.ts` | `whatsappLink(msg)` | `https://wa.me/{SITE.whatsapp}?text=…` (URL-encoded) |
| | `productWhatsappMessage(name, url)` | incluye nombre, URL y "precio final con IGV… boleta o factura" |
| | `categoryWhatsappMessage(name)` / `generalWhatsappMessage()` | mensajes de asesoría / genérico |
| `schema.ts` | `organizationSchema()` | `['MedicalBusiness','Store']` con NAP, geo, horarios, `taxID` (RUC) |
| | `breadcrumbSchema(items)` · `itemListSchema(items)` · `productSchema(p)` · `faqSchema(items)` | builders de JSON-LD; `productSchema.image` recibe URLs absolutas en **jpg** |
| `hours.ts` | `formatHours()` | "Lun, Mar, Mié, Jue, Vie: 09:00–19:00 · Sáb: 09:00–14:00" — fuente única del horario (footer, home, contacto, términos) |
| `site.ts` | `SITE`, `LEGAL` | §4.1 |

### 4.4 JSON-LD emitido por página

| Página | Esquemas |
|---|---|
| **todas** | `MedicalBusiness` + `Store` (organización) |
| `/` | + `FAQPage` (4 preguntas) |
| `/catalogo/` y `/catalogo/[category]/` | + `BreadcrumbList` + `ItemList` |
| `/producto/[slug]/` | + `BreadcrumbList` + `Product` (+`Offer`) + `FAQPage` si el producto tiene `faq` |
| `/contacto/` | + `ContactPage` |
| legales, libro, 404 | solo el de organización |

---

## 5. UI transversal e interacciones

1. **Header**: marca → `Inicio · Catálogo · Servicios (#/servicios) · Contacto` → enlace del
   Libro de Reclamaciones. `aria-current="page"` cuando el `pathname` coincide exactamente.
2. **Footer**: columna 1 = NAP + horario + nav (Inicio/Catálogo/Servicios/Contacto);
   columna 2 = `LegalFooter` (razón social, RUC, domicilio, 4 enlaces legales, nota de IGV,
   comprobante, ©). En 17/17 páginas.
3. **WhatsApp**: siempre `wa.me` con mensaje prellenado; `data-event` (`whatsapp_click` en
   genéricos, `whatsapp_product` en la ficha). El flotante global lo inyecta `BaseLayout`.
4. **Libro de reclamaciones**: `<form method="post" action={ENDPOINT}>` con
   `data-reclamacion`. Con JS: `fetch` con `URLSearchParams(FormData)` → si `ok`, oculta los
   campos y muestra **"Tu hoja fue enviada"**; si falla, muestra "No pudimos **confirmar** el
   envío" (redacción deliberada: un endpoint sin CORS entrega el request igual). Sin JS: POST
   nativo. Campos ocultos: `proveedor_razon_social`, `proveedor_ruc`, `proveedor_domicilio`,
   `proveedor_sitio`. Correlativo/fecha: responsabilidad del endpoint.
5. **Eventos**: handler global en `BaseLayout` que hace `dataLayer.push({event, href})` en
   cualquier clic sobre `a[data-event]`. **No carga analítica**: al instalar GA4/GTM hay que
   añadir aviso de cookies (`legal.md 8.4`).

---

## 6. Cómo verificar que este documento sigue siendo cierto

```bash
pnpm build && pnpm check          # 17 HTML, 0 errores de tipos
find src -type f | sort           # árbol real de fuentes
for f in $(find dist -name '*.html'); do echo "$f $(grep -o '<h1' $f | wc -l)"; done   # 1 cada uno
grep -o '<loc>[^<]*' dist/sitemap-0.xml | wc -l                 # 16 URLs
grep -rl 'href="/libro-de-reclamaciones/"' dist | wc -l          # 17 (enlace legal visible)
```

- [ ] El árbol de §1 coincide con `find src -type f`
- [ ] La tabla de rutas de §2.1 coincide con `dist/`
- [ ] Los valores de §4.1 coinciden con `src/lib/site.ts`
- [ ] La tabla de productos de §4.2 coincide con `src/data/api.js`

## 7. Gotchas para un agente nuevo

1. **`pages/` smart, `components/` dumb**: los componentes reciben *slices* de props, no la
   entidad completa; los datos viven en `api.js` y `site.ts`, nunca dentro de componentes.
2. **`<Image>` necesita el `ImageMetadata`, no el string**. Pasar `image.src` (string) hace
   que Astro **no** transforme y entregue el jpg ignorando `format="webp"` (bug ya corregido
   en `CategoryCard`/`FeaturedCategories`; no reintroducirlo).
3. **Todo href interno termina en `/`** (`trailingSlash: 'always'`); anclas van como `/#servicios`.
4. **Sin `astro:content`**: agregar contenido = tocar `api.js` o la página.
5. **Sin frameworks JS**: solo los dos `<script>` descritos en §5.4/§5.5.
6. **Tokens planos**: no existen escalas `primary-500` ni `blue-600`; usar `text-primary`,
   `bg-neutral/5`, `border-neutral/20`. Hex permitido: solo `#25d366`.
7. **Copy en español neutro peruano** (sin voseo, sin anglicismos), lenguaje YMYL: nada de
   "cura", "garantizado" ni testimonios médicos (`legal.md 8.3`).
8. **Sin registro sanitario no hay publicación**: `api.js` filtra en build y avisa por consola.
9. **`ui/Button.astro` está sin usar**; hay que eliminarlo o usarlo conscientemente.
10. **`<slot name="cta"/>` de BaseLayout no lo usa ninguna página** (existe para CTAs de campaña).
11. **Gate**: `pnpm check` debe quedar en 0 — atrapa errores que `pnpm build` aprueba.
12. **Imágenes de prueba** en `src/assets/` (jpg): reemplazar por fotos con derechos (Previas).

## 8. Pendientes conocidos (detalle en `doc/plan-implementacion.md`)

Dominio/HTTPS · datos reales en `site.ts` · endpoint real + aviso INDECOPI · Google Business
Profile · Search Console y PageSpeed · decisión de analítica (+cookies) · 4 `[VALIDAR]` con el
abogado · fotos con derechos · commit del trabajo (solo existe el `Initial commit`).

## 9. Mantenimiento de este documento

Actualizarlo al: añadir/quitar una ruta, cambiar el orden de componentes de una página,
modificar `SITE`/`LEGAL`, agregar un producto/categoría, o tocar `astro.config.mjs`.
