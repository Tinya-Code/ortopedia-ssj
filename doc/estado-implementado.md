# Estado implementado: páginas, componentes y datos

Inventario *as-built* del sitio **Centro Ortopédico SSJ** (Astro 7 + Tailwind v4, SSG puro).
Sirve para que otro agente —o una persona— sepa **qué existe hoy, cómo está compuesto cada
página y con qué datos reales trabaja**, sin tener que reconstruirlo leyendo el código.

> Actualizado el 30/09/2026 tras las mejoras UI/UX M1–M9 (`doc/plan-mejoras.md`). Si se
> modifica una página o un componente, actualizar este archivo (ver §9).

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
| `--color-primary` | `#1d69f0` | `text-primary`, `bg-primary`, títulos de acento, enlaces, contorno de foco |
| `--color-secondary` | `#167f7d` | íconos/enlaces de acento (WhyUs, ServicesGrid) y variante `secondary` de Button (oscurecido en M1 a 4.81:1 con blanco) |
| `--color-accent` | `#f59e0b` | solo decorativo: íconos (nunca como fondo de texto) |
| `--color-accent-text` | `#b45309` | texto/enlaces ámbar accesibles (5.02:1) |
| `--color-neutral` | `#6b7280` | texto corrido (4.83:1), bordes `border-neutral/20`, fondos `bg-neutral/5` |
| `--color-ink` | `#111827` | títulos y jerarquía máxima (`text-ink`), texto sobre verde WhatsApp |
| `--color-success` / `--color-warning` / `--color-danger` | `#15803d` / `#b45309` / `#b91c1c` | badges de stock y errores de formulario (≥5:1) |
| `--radius-card` | `0.75rem` | `rounded-card` en todas las tarjetas |
| `--shadow-card` | 2 sombras suaves | `shadow-card` en tarjetas y paneles |
| `--font-body` / `--font-display` | Inter | cuerpo / títulos (`font-display`) |
| `--default-font-family` | `var(--font-body)` | preflight de Tailwind |

Además en la raíz: `html { scroll-padding-top: 4rem }` (anclas bajo el header sticky) y
`:focus-visible` global con contorno `3px solid primary` (M1).

Único hex suelto permitido en componentes: `#25d366` (con hover `#1ebe5b`) en `WhatsAppButton`;
el texto/icono van en `text-ink` (8.94:1) para cumplir AA — nunca `text-white` sobre ese verde.

### Árbol de fuentes

```
src/
├─ layouts/BaseLayout.astro        chrome global + SEO + JSON-LD + SkipLink + WhatsApp flotante
│                                  (prop hideFloatingCta oculta el flotante en fichas)
├─ pages/                          10 archivos → 17 HTML
│  ├─ index.astro · 404.astro · contacto.astro
│  ├─ catalogo/{index,[category]}.astro
│  ├─ producto/[slug].astro
│  └─ libro-de-reclamaciones.astro · terminos-y-condiciones.astro
│     politica-de-privacidad.astro · cambios-y-devoluciones.astro
├─ components/
│  ├─ home/       Hero · TrustBar · ServicesGrid · FeaturedCategories · WhyUs ·
│  │              HowItWorks · Faq · LocationCta
│  ├─ catalog/    CategoryCard · CategoryChips · ProductGrid · ProductCard
│  ├─ product/    ProductGallery · ProductInfo · ProductSpecs · RelatedProducts ·
│  │              RegistroBadge · StickyProductBar
│  ├─ legal/      LegalFooter · ReclamacionesLink · ProductLegal · ReclamacionForm
│  ├─ layout/     Header · MobileNav · Footer · Breadcrumbs · SkipLink
│  ├─ seo/        SEO · JsonLd
│  └─ ui/         Button · WhatsAppButton · Container · PageHeader · Callout ·
│                 CtaBand · Accordion · PriceTag · AvailabilityBadge
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
| `/` | `pages/index.astro` | Centro ortopédico en Ciudad | Hero → trustbar → servicios → categorías → por qué → cómo funciona → FAQ → ubicación → banda CTA |
| `/catalogo/` | `pages/catalogo/index.astro` | Catálogo de productos ortopédicos | Breadcrumbs + h1/lead + grilla de 3 categorías + banda CTA |
| `/catalogo/rodilleras/` | `pages/catalogo/[category].astro` | Rodilleras ortopédicas | Breadcrumbs + h1 + chips de categoría + intro (~150 palabras) + grid de 2 productos + banda CTA |
| `/catalogo/bastones/` | ídem | Bastones ortopédicos | ídem (2 productos) |
| `/catalogo/sillas-de-ruedas/` | ídem | Sillas de ruedas manuales | ídem (2 productos) |
| `/producto/rodillera-ligamentos/` | `pages/producto/[slug].astro` | Rodillera con soporte de ligamentos | Galería + info (precio/stock/registro/CTA) + descripción + specs + relacionados + legal + barra fija móvil |
| `/producto/rodillera-deporte/` | ídem | Rodillera elástica para deporte | ídem (1 imagen, specs de tallas, sin FAQ) |
| `/producto/baston-plegable/` | ídem | Bastón plegable de aluminio | ídem |
| `/producto/baston-cuatro-puntos/` | ídem | Bastón de cuatro puntos de apoyo | ídem |
| `/producto/silla-ruedas-plegable/` | ídem | Silla de ruedas plegable en aluminio | ídem (2 imágenes + FAQ) |
| `/producto/silla-ruedas-aluminio/` | ídem | Silla de ruedas estándar en aluminio | ídem (disponible `PreOrder`) |
| `/contacto/` | `pages/contacto.astro` | Contacto | Breadcrumbs + h1/lead + ubicación (NAP+mapa) + banda "Canales de contacto" |
| `/libro-de-reclamaciones/` | `pages/libro-de-reclamaciones.astro` | Libro de Reclamaciones | Identificación del proveedor + aviso de plazo + formulario + aviso `warning` |
| `/terminos-y-condiciones/` | `pages/terminos-y-condiciones.astro` | Términos y condiciones | h1 + última actualización + índice + 9 secciones + aviso `legal` |
| `/politica-de-privacidad/` | `pages/politica-de-privacidad.astro` | Política de privacidad | ídem con 8 secciones |
| `/cambios-y-devoluciones/` | `pages/cambios-y-devoluciones.astro` | Cambios y devoluciones | ídem con 7 secciones |
| `404.html` | `pages/404.astro` | Página no encontrada | `noindex` + chips de categorías + 2 botones (inicio / WhatsApp) |

**No existen**: `/servicios/[slug]`, `/comprobantes-y-envios/` (decisión de alcance) y la ficha
`rodillera-en-validacion` (filtrada por la regla editorial de registro sanitario).

### 2.2 Componentes

| Archivo | Props (tipo = default) | Qué renderiza | Usado en |
|---|---|---|---|
| `layout/SkipLink.astro` | — | Primer elemento enfocable: "Saltar al contenido principal" → `#main` (`min-h-11`, sale de pantalla hasta el foco) | BaseLayout (17/17) |
| `layout/Header.astro` | — | Barra `sticky top-0 z-40 h-16`: logo (`min-h-11`) → nav 4 enlaces con `aria-current` y área táctil vía `after:*` ≥44px → `ReclamacionesLink` → (lg) CTA compacto → `MobileNav` | BaseLayout |
| `layout/MobileNav.astro` | `links, currentPath` | `<details>/<summary>` sin JS (hamburguesa 44×44 con `aria-label`); panel `absolute top-16` a ancho completo; estado expuesto nativamente por AX (`DisclosureTriangle` + `expanded`) | Header (`md:hidden`) |
| `layout/Footer.astro` | — | 2 columnas (`sm:grid-cols-2`): NAP + contacto (`min-h-11`) + nav, y `LegalFooter` | BaseLayout |
| `layout/Breadcrumbs.astro` | `items: {name, href?}[]` | `<nav aria-label="Migas de pan">` con `>` separadores; en móvil scrollea (`overflow-x-auto` con `py-3/-my-3` para no recortar el área táctil `after:*`); último item sin enlace | catálogo, categoría, producto, contacto |
| `seo/SEO.astro` | `title, description, image?='/og-default.jpg', type?='website', noindex?=false` | `<title>` (agrega `\| {SITE.name}` si no viene), description, canonical, `noindex` condicional, OG y Twitter. Avisa en dev si title >60 o description >160 | BaseLayout |
| `seo/JsonLd.astro` | `data: obj \| obj[]` | `<script type="application/ld+json">` con `set:html` | BaseLayout |
| `ui/Container.astro` | `size?='wide'\|'narrow'` | Envoltorio `mx-auto max-w-6xl` (wide) o `max-w-3xl` (narrow) con `px-4` | páginas (reemplaza divs sueltos) |
| `ui/PageHeader.astro` | `title, lead?` | Encabezado de sección/página: `<h1>` o `<h2>` + párrafo lead en medida `max-w-prose` | home, catálogo, categoría, contacto, 404 |
| `ui/Callout.astro` | `tone?='info'\|'warning'\|'legal', title?` | Caja destacada con fondo/borde según tono (icono + borde) | legales (1× `legal`), libro (`warning`), categoría vacía (`info`) |
| `ui/CtaBand.astro` | `title, text?, message` | Banda de cierre a ancho completo `bg-primary text-white` con título + texto + `WhatsAppButton` (variante `white`, "Escribir por WhatsApp") | home, catálogo, categorías |
| `ui/Accordion.astro` | `items: {q,a}[]` | Lista de `<details>/<summary>` (1er ítem abierto); sin JS | `home/Faq` |
| `ui/PriceTag.astro` | `price?, size?='md'\|'lg', includesIGV?, class?` | `S/ X.XX` (2 decimales) o "Consultar precio"; `lg` agrega "precios con IGV" | ProductCard, ProductInfo, RelatedProducts, StickyProductBar |
| `ui/AvailabilityBadge.astro` | `availability` | Pastilla SIEMPRE con texto: `En stock` / `Por encargo` / `Agotado` (+ punto `aria-hidden`), derivada del mismo campo del JSON-LD | ProductInfo |
| `ui/WhatsAppButton.astro` | `message, label?='Consultar por WhatsApp', variant?='primary'\|'floating'\|'white', eventName?='whatsapp_click', mobileHidden?` | `<a wa.me>` con `target=_blank`, `data-event`, icono SVG. Verde de marca con **texto `text-ink`** (AA); `floating` = fijo abajo-derecha (`hidden md:flex` si `mobileHidden`); `white` = píldora blanca sobre banda de color | LocationCta (×2), ProductInfo, StickyProductBar, CtaBand, categoría, flotante global |
| `ui/Button.astro` | `href, label?, variant?='primary'\|'secondary'\|'outline', eventName?, rel?` | Enlace con forma de botón (`min-h-11`, también acepta `<slot/>`) | **Hero (2 CTA de la home) y 404 (2 botones)** |
| `home/Hero.astro` | `title, text?, image: ImageMetadata, imageAlt` | Sección a 2 columnas: `<h1>` + párrafo + `<slot/>` (recibe los `ui/Button`) \| imagen LCP (`fetchpriority=high`, `loading=eager`, webp `srcset` 600/1000/1600w) | index |
| `home/TrustBar.astro` | `items: {icon,label}[]` | Franja de 4 confianzas con íconos SVG; sin `<h2>` (barra, no sección semántica) | index |
| `home/ServicesGrid.astro` | `services: {title,text,href}[]` | `<section id="servicios">` con h2 + grid de tarjetas (`rounded-card shadow-card`) enlazadas a WhatsApp (`target=_blank`) | index |
| `home/FeaturedCategories.astro` | `categories: {slug,name,seoDescription,image,imageAlt}[]` | `<ul>` grid 1/2/3 columnas; cada tarjeta enlaza a `/catalogo/{slug}/` con `<Image>` webp 600×600 lazy | index |
| `home/WhyUs.astro` | — | h2 "Por qué elegirnos" + 4 tarjetas (`sm:grid-cols-2`) con texto verificable dentro del componente (YMYL: sin testimonios ni promesas clínicas) | index |
| `home/HowItWorks.astro` | `steps: {title,text}[]` | h2 + 3 pasos numerados con conector horizontal (`md:flex`) | index |
| `home/Faq.astro` | `items: {q,a}[]` | h2 + `<Accordion>` de preguntas (el JSON-LD lo arma la página) | index |
| `home/LocationCta.astro` | — | `<section id="ubicacion">`: h2 + `<address>` NAP (dirección/teléfono/horario/correo con enlaces `min-h-11`) + "Punto de referencia" + CTA "Cómo llegar" \| `<iframe>` Google Maps `h-80` lazy | index, contacto |
| `catalog/CategoryCard.astro` | `category: {slug,name,seoDescription,image,imageAlt}` | Artículo con `<Image>` webp cuadrada + h2 "Ver {categoría}" + descripción | catálogo |
| `catalog/CategoryChips.astro` | `categories, activeSlug?` | Tira de chips outline (índice de categorías); la activa es `bg-primary text-white` con `aria-current="page"`; `min-h-11` | categorías, 404 |
| `catalog/ProductGrid.astro` | `products: {slug,name,price?,images}[]` | `<ul>` grid 1/2/3 columnas; los 4 primeros pasan `priority=true` (eager) | categoría |
| `catalog/ProductCard.astro` | `product: {slug,name,price?,images}, priority?=false` | Tarjeta enlazada completa (`a.relative.block`): `<Image>` webp 400×400 + h2 + `PriceTag` | ProductGrid |
| `product/ProductGallery.astro` | `images: {src,alt}[]` | Imagen principal (800×800, `fetchpriority=high` + eager) + miniaturas 160×160 lazy | producto |
| `product/ProductInfo.astro` | `name, price?, availability, whatsappMessage, registroSanitario?, claseRiesgo?` | **`<h1>`** + `PriceTag` (`lg`, aviso IGV) + `AvailabilityBadge` + `RegistroBadge` + WhatsApp (`whatsapp_product`); en `md` la columna es `self-start md:sticky md:top-24` | producto |
| `product/RegistroBadge.astro` | `registroSanitario, claseRiesgo?` | Línea "Registro sanitario DM-… · Clase II" (`text-sm text-neutral`) bajo el precio | ProductInfo (6/6 fichas) |
| `product/ProductSpecs.astro` | `specs: Record<string,string>` | `<dl>` de especificaciones con filas cebra (`odd:bg-neutral/5`); **no renderiza nada si `specs` está vacío** | producto |
| `product/RelatedProducts.astro` | `products: {slug,name,price?}[]` | h2 "Productos relacionados" + `<ul>` con título enlazado (`min-h-11`) + `PriceTag` | producto |
| `product/StickyProductBar.astro` | `name, price?, whatsappMessage` | Barra fija inferior `fixed inset-x-0 bottom-0 z-40 md:hidden`: nombre (truncate) + `PriceTag` + CTA WhatsApp; `aria-label="Compra rápida"` | producto (6/6) |
| `legal/LegalFooter.astro` | — | Razón social + RUC + domicilio + mail (`min-h-11`), nav legal (3 enlaces + `ReclamacionesLink`), nota de IGV + comprobante | Footer |
| `legal/ReclamacionesLink.astro` | — | Enlace `text-accent-text` con icono ámbar a `/libro-de-reclamaciones/` (`min-h-11`) | Header y LegalFooter (2× por página) |
| `legal/ProductLegal.astro` | `registroSanitario?, claseRiesgo?, titularRegistro?, priceIncludesIGV?=true` | `<aside>` con registro sanitario/clase/titular, aviso de IGV y aviso médico obligatorio | producto |
| `legal/ReclamacionForm.astro` | `endpoint: string` | Hoja de reclamación: 4 campos ocultos + 3 fieldsets + consentimiento + botón; 12 controles con `<label>` (por contención + `id`), `aria-describedby` a sus mensajes `text-danger`, `min-h-11`, validación en español con `noValidate` solo-con-JS (POST nativo sin JS), foco al primer inválido, estado en `[data-status][aria-live=polite][hidden]` | libro-de-reclamaciones |

---

## 3. Composición página por página

Cada página arranca con `BaseLayout`, que siempre renderiza: `<head>` con `SEO` +
`JsonLd` (siempre `organizationSchema()`, esquemas de la página + los que pase la página),
y `<body>` con `SkipLink` → `Header` → `<main id="main" class="flex-1"><slot/></main>` →
`Footer` → WhatsApp flotante global (`variant="floating"`, `mobileHidden` =
`hidden md:flex`). En las fichas de producto el flotante se apaga con la prop
`hideFloatingCta` y lo reemplaza `StickyProductBar` en móvil.

### 3.0 Cómo se distribuye el espacio (reglas globales)

| Regla | Detalle |
|---|---|
| Contenedor | componente `Container`: `size="wide"` → `max-w-6xl` (home, catálogo, categoría, producto, contacto), `size="narrow"` → `max-w-3xl` (legales, libro, 404); siempre con `px-4` |
| Medida de texto | párrafos largos con `max-w-prose` (65ch) dentro del contenedor |
| **Apilado → columnas** | todo apila en móvil; `sm:640px` activa 2 columnas de tarjetas, `md:768px` activa las 2 columnas grandes (hero, galería, ubicación), `lg:1024px` activa 3 columnas de tarjetas |
| Bandas de home | alternancia real: blanco (hero + trustbar) → gris `bg-neutral/5` (servicios) → blanco (categorías) → gris (por qué) → blanco (cómo funciona) → gris (FAQ) → blanco (ubicación) → `bg-primary` (banda CTA final) |
| Header / Footer | full-bleed con contenido interno `max-w-6xl`; header `sticky top-0 z-40 h-16`; footer en `sm:grid-cols-2` |
| Altura de página | `<body class="flex min-h-screen flex-col">` + `<main class="flex-1">` → el **footer queda pegado al piso** aunque el contenido sea corto |
| Fijo | 2 elementos: WhatsApp flotante `fixed bottom-4 right-4 z-50 hidden md:flex` (solo ≥768px, oculto en fichas con `hideFloatingCta`) y, en las 6 fichas, `StickyProductBar` `fixed inset-x-0 bottom-0 z-40 md:hidden` (nombre + `PriceTag` + CTA) |
| Anclas y foco | `html { scroll-padding-top: 4rem }` (anclas bajo el header sticky) y `:focus-visible` global con contorno `3px solid primary`; skip link es el primer elemento enfocable de 17/17 páginas |
| Áreas táctiles | todo enlace/CONTROL ≥44px: `min-h-11` directo o área expandida con `after:-inset-*` (nav desktop, breadcrumbs, chips); CTA de WhatsApp ≥44 en todas las variantes |
| Ritmo vertical | bandas `py-12 md:py-16`; bloques separados con `mt-8`/`mt-10`; tarjetas `p-4` (catálogo) o `p-6` (home) |

### `/` — `pages/index.astro`
```
BaseLayout (title: "Centro ortopédico en {city}", schemas: faqSchema ×4)
1. Hero          title, text, image=hero.jpg, imageAlt   ← h1 único de la home;
                 <slot/> recibe 2 ui/Button: "Consultar por WhatsApp" (primary,
                 eventName=whatsapp_click) + "Ver catálogo" (outline)
2. TrustBar      items: 4 confianzas (ícono + label)      ← franja, sin <h2>
3. ServicesGrid  services: 3 objetos con href=wa.me      ← <section id="servicios">
4. FeaturedCategories  categories = api.categories.list() (3 CategoryCard)
5. WhyUs         datos fijos dentro del componente
6. HowItWorks    steps: 3 pasos numerados (círculos + conector)
7. Faq           4 FAQs definidos en la página (una usa LEGAL.pricesIncludeIGV)
                 → renderiza <Accordion> de <details> (1er ítem abierto)
8. LocationCta   NAP + "Punto de referencia" + iframe de mapa + CTA "Cómo llegar"
9. CtaBand       title/text/message  ← banda bg-primary de cierre
```
Los datos de servicios, trustbar, pasos y FAQ se definen **en la página** (capa smart),
no en `api.js`.

**Distribución**: única página con 9 bandas a ancho completo. El hero es el único lugar
con 2 columnas de texto+imagen (izquierda texto, derecha imagen en `md`); el resto son
grillas de tarjetas que apilan en móvil. FAQ y contenido de lectura van en columna angosta
centrada.

```
[header  max-w-6xl: marca · nav · libro de reclamaciones    ]  full-bleed sticky
[HERO   md:2col → h1+p+2 botones (izq) | imagen 1600x900 (der)]
[TRUSTBAR  blanco, border-y, 4 íconos                        ]
[SERVICIOS  bg gris · grid sm:2 lg:3 tarjetas enlazadas      ]  id="servicios"
[CATEGORÍAS blanco · grid sm:2 lg:3 tarjetas con imagen      ]
[POR QUÉ     bg gris · grid sm:2 (4 tarjetas = 2×2)          ]
[CÓMO FUNC.  blanco · 3 pasos numerados con conector         ]
[FAQ         bg gris · max-w-3xl centrado · acordeón details ]
[UBICACIÓN   blanco · md:2col → NAP+CTA (izq) | mapa (der)   ]  id="ubicacion"
[CTA FINAL   bg-primary · título + texto + botón blanco      ]
[footer sm:2col → NAP+nav | bloque legal ]   [● flotante fijo solo ≥768]
```

### `/catalogo/` — `pages/catalogo/index.astro`
```
BaseLayout (schemas: breadcrumbSchema + itemListSchema de categorías)
1. Breadcrumbs   [Inicio, Catálogo]
2. PageHeader    h1 "Catálogo de productos" + lead (max-w-prose)
3. grid          categories.map → <CategoryCard>   (grid sm:2 / lg:3)
4. CtaBand       banda bg-primary de cierre
```

**Distribución**: columna única angosta-abierta (no hay 2 columnas grandes); la variedad la
dan las 3 tarjetas cuadradas que pasan de apiladas (móvil) → 2 col (`sm`) → 3 col (`lg`).

### `/catalogo/[category]` — `pages/catalogo/[category].astro`
```
getStaticPaths: api.categories.list() → props { cat, products: api.products.byCategory(cat.slug) }
BaseLayout (title: cat.seoTitle ?? cat.name, schemas: breadcrumb + itemList de productos)
1. Breadcrumbs   [Inicio, Catálogo, {categoría}]
2. PageHeader    h1 {cat.name}
3. CategoryChips índice outline de las 3 categorías; la activa es bg-primary
                 text-white con aria-current="page"; min-h-11
4. intro         párrafo {cat.intro} (~150 palabras, max-w-prose)
5. ProductGrid   products  → si la categoría queda vacía: Callout tone="info"
                 "Sin productos publicados" + WhatsAppButton
6. CtaBand       banda bg-primary de cierre
```

**Distribución**: lectura vertical en una sola columna dentro de `max-w-6xl`; el `intro` de la
categoría va en medida angosta (`max-w-prose`) y la grilla de productos ocupa todo el ancho
disponible (apilada → 2 col `sm` → 3 col `lg`). Los chips van inmediatamente bajo el `h1`.

### `/producto/[slug]` — `pages/producto/[slug].astro`
```
getStaticPaths: api.products.list().flatMap(p → si categoría existe, genera ruta)
frontmatter: ogImage = getImage(w1200×h630, format jpg)  ← og:image
             imageUrls = getImage(w1200, format jpg) por imagen ← image del Product schema
BaseLayout (schemas: breadcrumb + product + faq si el producto tiene faq;
           hideFloatingCta ← apaga el flotante global en esta página)
1. Breadcrumbs   [Inicio, Catálogo, {categoría}, {producto}]
2. section       grid md:grid-cols-2 → 2.1 ProductGallery   ← imagen principal eager+priority
                                       → 2.2 ProductInfo    ← h1 + PriceTag (lg, IGV) +
                                                              AvailabilityBadge + RegistroBadge +
                                                              WhatsApp; self-start sticky md:top-24
3. section       h2 "Descripción" + párrafo (inline)
4. ProductSpecs  si product.specs (filas cebra odd:bg-neutral/5)
5. RelatedProducts  related = api.products.related(slug)  ← títulos enlazados + PriceTag
6. ProductLegal  registro + clase + titular + IGV + aviso médico
7. StickyProductBar  barra fija inferior en móvil (md:hidden): nombre + precio + CTA
```
El `<h1>` de la ficha vive dentro de `ProductInfo`, no en la página.

**Distribución**: la única página con **galería + datos en paralelo**. En `md` la galería ocupa
la mitad izquierda y la ficha (h1, precio, stock, CTA) la derecha; debajo, todo vuelve a una
columna de lectura: descripción en medida angosta → tabla de specs (cada fila es `sm:3col`:
clave a la izquierda, valor a la derecha) → relacionados en 2 columnas → caja legal con fondo gris.

```
[Breadcrumbs                                              max-w-6xl]
[ md:2col → GALERÍA (img800 + fila miniaturas) | FICHA: h1/precio/CTA (sticky md) ]
[Descripción        h2 + párrafo  max-w-prose                        ]
[Especificaciones   dl: [clave | valor      ] filas cebra            ]
[Relacionados       grid sm:2col (enlaces + precio)                   ]
[aside legal        bg gris, borde redondeado, texto chico            ]
[barra fija móvil   nombre · precio · CTA WhatsApp  (md:hidden)      ]
```

### `/contacto/` — `pages/contacto.astro`
```
BaseLayout (schemas: ContactPage inline)
1. Breadcrumbs   [Inicio, Contacto]
2. section pb-8  PageHeader (h1 + lead) + p "Punto de referencia: {dirección}"
3. LocationCta   mismo componente que en la home (NAP + mapa)
4. section       "Canales de contacto" (bg-neutral/5): grid sm:grid-cols-3 de
                 3 tarjetas enlazadas (WhatsApp / Teléfono / Correo) con icono SVG
```

**Distribución**: texto corto arriba (columna única), después la misma grilla de 2 columnas
`md` de la home (NAP | mapa, en móvil el mapa queda debajo con altura fija `h-80`) y al final
la banda gris con los 3 canales que apilan en móvil (`gap-4`, `sm:grid-cols-3`).

### `/libro-de-reclamaciones/` — `pages/libro-de-reclamaciones.astro`
```
frontmatter: const ENDPOINT = 'https://example.com/api/reclamos'   ← TODO: URL real
BaseLayout
article
1. h1
2. Callout tone="warning"   aviso oficial de INDECOPI pendiente de subir (TODO)
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
Estructura idéntica: `BaseLayout` → `<Container size="narrow">` → `h1` → `p "Última
actualización: {LEGAL.lastUpdated}"` → `<nav aria-label="Índice">` con enlaces a cada
`h2` (`min-h-11`) → `<section class="mt-8">` numeradas con `h2 id` (`scroll-mt-20`) →
`Callout tone="legal"` de cierre. **Sin breadcrumbs y sin JSON-LD propio**
(solo el de la organización). Contenido en español neutro, datos desde `LEGAL`/`SITE` +
`formatHours()` (horario compartido con footer y LocationCta).

**Distribución**: columna estrecha centrada (`max-w-3xl`) y puramente vertical: `h1` seguido
de índice, secciones numeradas con `h2` y saltos `mt-8` — sin grillas, ni imágenes, ni asides
(únicamente el `Callout` final con fondo tintado). Son las páginas más "densas" en texto y
las más simples en layout.

| Página | Secciones |
|---|---|
| Términos (544 palabras) | 1 Identificación · 2 Precios · 3 Cómo comprar · 4 Envíos · 5 Comprobante · 6 Disponibilidad y registro · 7 Reclamos · 8 Cambios/devoluciones/datos · 9 Modificaciones |
| Privacidad (472) | 1 Responsable · 2 Datos que recogemos · 3 Finalidad · 4 Conservación · 5 Con quién se comparten · 6 Derechos ARCO · 7 Cookies y analítica · 8 Cambios |
| Cambios y devoluciones (421) | 1 Plazo · 2 Estado · 3 Flete · 4 Excepciones por higiene · 5 Reembolsos y nota de crédito · 6 Garantía · 7 Cómo solicitarlo |

### `404` — `pages/404.astro`
`BaseLayout noindex` → `PageHeader` (h1 + lead) → `CategoryChips` con las 3 categorías
(desde `api.categories.list()`) → 2 `ui/Button`: "Volver al inicio" (primary) y
"Escribir por WhatsApp" (outline, `whatsapp_click`).

**Distribución**: columna estrecha centrada con `py-16` (mucho aire arriba y abajo); las
categorías son chips tipo botón con `flex flex-wrap gap-3` que se acomodan en varias filas;
los 2 botones van en fila y apilan sueltas en móvil (`flex flex-wrap gap-3`).

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

1. **Header**: barra `sticky top-0 z-40 h-16`: marca (`min-h-11`) → nav desktop 4 enlaces
   (`Inicio · Catálogo · Servicios (#servicios) · Contacto`) con `aria-current="page"` cuando
   el `pathname` coincide exactamente y área táctil ≥44px vía `after:-inset-*` →
   `ReclamacionesLink` → (lg) CTA compacto → `MobileNav` (`md:hidden`).
2. **Skip link y foco**: `SkipLink` es el primer elemento enfocable de 17/17 páginas →
   `#main` (en `display` se sale de pantalla, no `display:none`); `:focus-visible` global
   con contorno `3px solid primary` (M1, visible en los 8 primeros Tab de la home);
   `html { scroll-padding-top: 4rem }` deja las anclas (`/#servicios`, `/#ubicacion`) justo
   bajo el header sticky (targetTop=64 en 3 viewports).
3. **Menú móvil y FAQ sin JS**: `MobileNav` y `Accordion` son `<details>/<summary>`
   nativos — el estado lo expone la accesibilidad (`DisclosureTriangle` + `expanded`), sin
   `aria-expanded` estático y sin scripts. El panel del menú abre en `absolute top-16`
   (coincide con el borde inferior del header) con links de 343×44.
4. **Footer**: columna 1 = NAP + horario + nav (Inicio/Catálogo/Servicios/Contacto);
   columna 2 = `LegalFooter` (razón social, RUC, domicilio, 4 enlaces legales, nota de IGV,
   comprobante, ©). En 17/17 páginas.
5. **WhatsApp**: siempre `wa.me` con mensaje prellenado; `data-event` (`whatsapp_click` en
   genéricos, `whatsapp_product` en la ficha). El flotante global lo inyecta `BaseLayout`
   (`hidden md:flex`, se apaga en fichas con `hideFloatingCta`). Verde de marca con **texto
   `text-ink`** (8.94:1 sobre `#25d366`): nunca `text-white` sobre ese verde (1.98:1).
6. **Libro de reclamaciones**: `<form method="post" action={ENDPOINT}>` con
   `data-reclamacion`. Con JS: `novalidate` + validación en español, foco al primer
   inválido, `fetch` con `URLSearchParams(FormData)` → si `ok`, oculta los campos y muestra
   **"Tu hoja fue enviada"**; si falla, muestra "No pudimos **confirmar** el envío" (redacción
   deliberada: un endpoint sin CORS entrega el request igual). Sin JS: POST nativo con la
   validación nativa del navegador. Labels por **contención** (envuelven al input, sin
   `for=`) + `aria-describedby` a sus mensajes `text-danger`; estado final en
   `[data-status][aria-live=polite][hidden]`. Campos ocultos: `proveedor_razon_social`,
   `proveedor_ruc`, `proveedor_domicilio`, `proveedor_sitio`. Correlativo/fecha:
   responsabilidad del endpoint.
7. **Eventos**: handler global en `BaseLayout` que hace `dataLayer.push({event, href})` en
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
grep -rn 'slot name="cta"' src | wc -l                           # 0 (slot eliminado en M9)
grep -c 'text-ink' src/components/ui/WhatsAppButton.astro        # ≥2 (verde con texto AA)
grep -o 'blue-\|primary-[0-9]' -r src | wc -l                    # 0 (tokens planos)
```

Ojo: `grep -c` cuenta **líneas**, no ocurrencias (un `dist/*.html` puede ser 1 sola línea) —
usar `grep -o | wc -l`. Las verificaciones de contraste, áreas táctiles, foco, anclas y
scroll horizontal de la checklist §8 de `plan-mejoras.md` se corrieron con scripts CDP
temporales (M9) y no son reproducibles con un solo comando.

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
5. **Sin frameworks JS**: solo los 2 `<script>` descritos en §5 (validación del libro de
   reclamaciones y handler global de eventos).
6. **Tokens planos**: no existen escalas `primary-500` ni `blue-600`; usar `text-primary`,
   `bg-neutral/5`, `border-neutral/20`. Hex permitido en componentes: solo `#25d366` y su
   hover `#1ebe5b`, únicamente en `WhatsAppButton`.
7. **Copy en español neutro peruano** (sin voseo, sin anglicismos), lenguaje YMYL: nada de
   "cura", "garantizado" ni testimonios médicos (`legal.md 8.3`).
8. **Sin registro sanitario no hay publicación**: `api.js` filtra en build y avisa por consola.
9. **`ui/Button` está en uso en 2 lugares** (Hero de la home y 404); si se elimina, eliminar
   también sus usos, no dejarlo a medio camino.
10. **`hideFloatingCta`** es la prop de `BaseLayout` que apaga el WhatsApp flotante en las
   fichas (donde `StickyProductBar` toma su lugar en móvil). No quitarla sin reemplazo.
11. **Gate**: `pnpm check` debe quedar en 0 — atrapa errores que `pnpm build` aprueba.
12. **Imágenes de prueba** en `src/assets/` (jpg): reemplazar por fotos con derechos (Previas).
13. **`<details>` nativos** (menú móvil, FAQ): el estado `expanded` lo expone la AX — no
    meter `aria-expanded` estático; el panel del menú no se cierra con Esc porque no hay
    script (por diseño, y la checklist §8 lo condiciona al script).
14. **Labels del form por contención**: el `<label>` envuelve al `<input>` y solo tiene
    `id`, no `for=` — verificar con `input.labels.length`, no con `label[for]` (12 visibles,
    4 `type=hidden` exentos).

## 8. Pendientes conocidos (detalle en `doc/plan-implementacion.md`)

Dominio/HTTPS · datos reales en `site.ts` · endpoint real + aviso INDECOPI · Google Business
Profile · Search Console y PageSpeed · decisión de analítica (+cookies) · 4 `[VALIDAR]` con el
abogado · fotos con derechos · deploy (aún no ejecutado). Los commits de las mejoras M0–M9
están en la rama local (`doc/plan-mejoras.md` lleva el registro).

## 9. Mantenimiento de este documento

Actualizarlo al: añadir/quitar una ruta, cambiar el orden de componentes de una página,
modificar `SITE`/`LEGAL`, agregar un producto/categoría, o tocar `astro.config.mjs`.
