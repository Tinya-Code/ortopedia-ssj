# Plan de implementación — Centro Ortopédico (Astro + Tailwind)

Fuente: `doc/seo.md` (arquitectura, SEO, rendimiento) + `doc/legal.md` (INDECOPI, datos personales, publicidad).

Inventario *as-built* (qué existe hoy, composición de cada página y datos reales): **`doc/estado-implementado.md`**.

**Principios rectores**
- SSG puro: HTML estático, cero JS en cliente salvo que una isla lo justifique.
- Arquitectura por slots: `pages/` smart, `components/` dumb (props mínimas), `lib/` lógica pura, `data/` única fuente de datos.
- Sin Content Collections: un solo `src/data/api.js` con forma de respuesta de API.
- Tokens Tailwind en `@theme`: `--color-primary|secondary|accent|neutral`, `--font-body` / `--font-display`.
- Conversión por WhatsApp (no hay carrito): todo CTA lleva mensaje prellenado y trazabilidad `data-event`.

**Convención de este plan**: una tarea se marca `[x]` solo cuando pasa su **criterio de salida**.

---

## Previas: decisiones y validaciones abiertas

> Itens marcados `[VALIDAR]` vienen de `legal.md` y requieren confirmación legal o del negocio antes de publicar.

- [ ] Definir dominio real y valor de `site` en `astro.config.mjs` — por ahora placeholder `example.com`.
- [x] Razón social, RUC, domicilio y horarios cargados con **datos de prueba** en `src/lib/site.ts` (`SITE` + `LEGAL`) — sustituir por los reales antes de publicar (Fase 9).
- [ ] [VALIDAR] Plazo de respuesta del Libro de Reclamaciones (15 días hábiles; hay proyecto de modificación, jul-2026).
- [ ] [VALIDAR] Inscripción del banco de datos ante la Autoridad Nacional de Protección de Datos Personales.
- [ ] [VALIDAR] Alcance de garantía legal y compras a distancia con el abogado.
- [ ] [VALIDAR] Lista exacta de campos vigente de la hoja de reclamación de INDECOPI.
- [x] Backend del Libro de Reclamaciones: ~~endpoint propio (`src/pages/api/reclamos.ts`) + Google Sheets~~ **supersede por decisión del usuario** — la Fase 7 solo envía los datos a un endpoint externo declarado en el frontmatter; sin backend, ni `.env`, ni envío de correos desde el proyecto.
- [ ] Decidir si se usan analítica o píxeles → si sí, exige aviso de cookies con consentimiento (`legal.md 8.4`). *Fase 8 cerró sin etiqueta de medición (solo hook `dataLayer`); decidir antes de Fase 9 / publicación.*
- [ ] Recopilar fotos con derechos y autorización de marcas a usar.

**Criterio de salida**: ✅ `SITE`/`LEGAL` cargados con datos de prueba (los reales son bloqueo de **Fase 9**) y alcance de la Fase 7 definido por el usuario: solo formulario → endpoint, sin backend. La decisión de backend queda **fuera del alcance** del proyecto por ahora.

---

## Fase 1 — Cimientos del proyecto

Objetivo: proyecto configurado, tokens cargados, estructura de carpetas creada.

- [x] `astro.config.mjs`: `site`, `trailingSlash: 'always'`, `build.inlineStylesheets: 'auto'`, `compressHTML: true`, integración `sitemap`.
- [x] `public/robots.txt` con `Sitemap: https://dominio/sitemap-index.xml`.
- [x] Assets base: `favicon.svg`, `og-default.jpg` (placeholder 1200×630), carpeta `src/assets/products/`.
- [x] `src/styles/global.css` con tokens `@theme` (colores planos + `--font-body`/`--font-display` + `--default-font-family: var(--font-body)`).
- [x] Importar `global.css` desde el layout — hoy en `src/layouts/Layout.astro`; se mueve a `BaseLayout.astro` en Fase 3.
- [x] Fuentes autoalojadas (`@fontsource/inter` 400 + 600), `font-display: swap`.
- [x] Crear árbol de carpetas: `components/{seo,layout,ui,home,catalog,product,legal}`, `data/`, `layouts/`, `lib/`, `styles/`, `pages/` (con `.gitkeep` en las vacías).
- [x] Eliminar plantilla inicial de Astro (`Welcome.astro`, `assets/*.svg` de ejemplo).
- [x] `pnpm build` sin errores y utility `font-body`/`bg-primary` presente en el CSS compilado.

**Criterio de salida**: build verde, tokens operativos y estructura de componentes/rutas creada. ✅ Cumplido — las subcarpetas de `pages/` (`catalogo/`, `producto/`, `servicios/`) se crean con sus rutas en Fases 4 y 5.

---

## Fase 2 — Capa de datos y helpers

Objetivo: `api.js` como única fuente de datos + lógica pura sin dependencias de UI.

- [x] `src/lib/site.ts` con `SITE` (NAP, geo, horarios, redes, WhatsApp, moneda).
- [x] `src/lib/site.ts` con `LEGAL` (razón social, RUC, domicilio fiscal, `reclamosEmail`, `reclamosResponseDays`, `pricesIncludeIGV`) — `legal.md 9.2`.
- [x] `src/data/api.js` con `db.categories[]` y `db.products[]` e imports de imágenes (6 placeholders 1000×1000).
- [x] Campos legales en el shape de producto: `registroSanitario`, `claseRiesgo`, `titularRegistro`, `condition` — `legal.md 9.6` sin collections.
- [x] Textos largos (`description`, `intro`) como campos string; textos legales como campos, no Markdown.
- [x] Interfaz `api.*`: `categories.list/bySlug`, `products.list/bySlug/byCategory/featured/related` (+ `hidden()` para auditoría editorial).
- [x] Regla editorial: el filtro vive en `api.js` (todos los accesores operan sobre el set publicable + `console.warn` en build), no en `getStaticPaths` — imposible olvidarlo en una ruta nueva.
- [x] `src/lib/whatsapp.ts`: `whatsappLink()`, `productWhatsappMessage()` con mensaje de cumplimiento (precio final con IGV, boleta/factura) — `legal.md 9.9`.
- [x] `src/lib/schema.ts`: `organizationSchema` (+`legalName`, `taxID`), `breadcrumbSchema`, `productSchema` (offers solo con precio; `itemCondition` según `condition`), `faqSchema`, `itemListSchema`.
- [x] Verificar que ningún archivo importe `astro:content` ni `getCollection`.
- [x] Gate de tipos: `pnpm check` (`astro check`) en 0 errores — `@astrojs/check` + `typescript@6` (astro check no soporta TS 7).

**Criterio de salida**: ✅ Cumplido — `astro build` emitió `[data] 1 producto(s) sin registro sanitario NO se publicarán: rodillera-en-validacion` (6 publicados / 1 oculto verificado en el HTML de salida) y `grep -r "astro:content" src/` devolvió vacío.

---

## Fase 3 — Layout, SEO y componentes base

Objetivo: cascarón con slots, head SEO automático y chrome del sitio.

- [x] `components/seo/SEO.astro`: title (≤60), description (≤160), canonical, OG, Twitter, `noindex` — aviso en dev, sin truncar.
- [x] `components/seo/JsonLd.astro`: inyector genérico con `set:html`.
- [x] `layouts/BaseLayout.astro`: `<slot />` principal + `<slot name="cta" />`, JSON-LD de organización en todo el sitio, `lang="es"`, botón flotante global de WhatsApp. Reemplazó a `Layout.astro` (borrada).
- [x] `components/layout/Header.astro` con navegación a `/catalogo/` y servicios (`/#servicios`: las páginas de servicio propias aún no existen — Fase 4 debe dar a la sección de servicios `id="servicios"`).
- [x] `components/layout/Footer.astro` con `LegalFooter` embebido.
- [x] `components/legal/LegalFooter.astro`: razón social, RUC, domicilio, contacto, enlaces legales y nota de IGV/comprobante condicionada a `LEGAL.pricesIncludeIGV` — `legal.md 9.3` (sin enlace de comprobantes-y-envios, página fuera del plan).
- [x] `components/legal/ReclamacionesLink.astro` visible en **todas** las páginas: footer + header (2 instancias verificadas en el HTML de salida) — `legal.md 9.4`.
- [x] `components/layout/Breadcrumbs.astro` usando el mismo array que `breadcrumbSchema` (entra en uso en Fase 5).
- [x] `components/ui/Button.astro` y `components/ui/WhatsAppButton.astro` (variantes `primary|floating`, `data-event`).
- [x] Páginas legales mínimas enlazadas desde el footer (`terminos-y-condiciones`, `politica-de-privacidad`, `cambios-y-devoluciones`, `libro-de-reclamaciones`): rutas en dist + en sitemap, contenido en Fase 6/7.
- [x] `404.astro` útil con enlaces a categorías desde `api.categories.list()` y `noindex`.

**Criterio de salida**: ✅ Cumplido — cualquier página renderizada tiene head SEO completo, organización JSON-LD, footer legal y enlace al Libro de Reclamaciones. Verificado en `dist/index.html`: `meta description`, `canonical`, `og:title`, JSON-LD con `MedicalBusiness` + `legalName`/`taxID`, 2× "Libro de Reclamaciones" y botón flotante; las 4 rutas legales existen en `dist/` y en `sitemap-0.xml`; `pnpm build` y `pnpm check` en 0 errores.

---

## Fase 4 — Home

Objetivo: landing de conversión con un solo `h1` y secciones con `h2`.

- [x] `components/home/Hero.astro`: `h1` con keyword + ciudad, imagen LCP (placeholder 1600×900) con `fetchpriority="high"` sin `lazy`.
- [x] `components/home/ServicesGrid.astro` con `id="servicios"` (destino del enlace del header) — datos desde `pages/index.astro`, no desde `data/`.
- [x] `components/home/FeaturedCategories.astro` con `api.categories.list()`.
- [x] `components/home/WhyUs.astro` — solo afirmaciones verificables.
- [x] `components/home/Faq.astro` + `faqSchema` en la página.
- [x] `components/home/LocationCta.astro`: dirección, teléfono, horario y correo visibles en HTML + mapa (Google Maps embed sin API key) con `loading="lazy"`.
- [x] `pages/index.astro` componiendo las secciones (smart: arma `faqSchema` y los enlaces de WhatsApp por servicio).
- [x] Enlaces internos home → categorías (`/catalogo/[slug]/`) y home → servicios (header → `/#servicios`); las tarjetas de servicio enlazan a WhatsApp porque **no existen páginas `/servicios/[slug]`** (hrefs listos para cambiar cuando se decida crearlas).
- [x] Lenguaje YMYL: sin promesas de cura; "brinda soporte", "orientación".

**Criterio de salida**: ✅ Cumplido — verificado en `dist/index.html`: 1 solo `<h1>`, 5 `<h2>` (Servicios, Categorías, Por qué elegirnos, Preguntas frecuentes, Ubicación), `id="servicios"` presente, NAP visible en texto (dirección ×4, teléfono ×4, horario, correo), JSON-LD `FAQPage`, `<title>` de 53 caracteres y description de 137. **Pendiente**: correr el Rich Results Test de Google sobre la URL pública una vez desplegado (Fase 8/9).

---

## Fase 5 — Catálogo y ficha de producto

Objetivo: rutas de categoría y producto con rich results.

- [x] `components/catalog/ProductCard.astro` con props slice (`slug,name,price,images`) e `Image` de `astro:assets`.
- [x] `components/catalog/ProductGrid.astro` (`priority` → `eager` en los 4 primeros).
- [x] `components/catalog/CategoryCard.astro`.
- [x] `pages/catalogo/index.astro`: todas las categorías + `itemListSchema`.
- [x] `pages/catalogo/[category].astro`: `getStaticPaths` desde `api.*`, `Breadcrumbs`, texto `intro` único (159–168 palabras), `breadcrumbSchema` + `itemListSchema`.
- [x] Paginación: **evaluada, no aplica** — ninguna categoría supera ~24 productos (máx. 2). Se activa con `paginate()` y canonical propio cuando el catálogo crezca.
- [x] `components/product/ProductGallery.astro`: principal `eager fetchpriority="high"`, miniaturas `lazy`.
- [x] `components/product/ProductInfo.astro`: `h1`, precio o "Consulta el precio por WhatsApp", stock, CTA WhatsApp.
- [x] `components/product/ProductSpecs.astro` y `components/product/RelatedProducts.astro`.
- [x] `components/legal/ProductLegal.astro`: registro sanitario, aviso de IGV, aviso de uso ortopédico — `legal.md 9.5`.
- [x] `pages/producto/[slug].astro`: crumbs, OG 1200×630, `productSchema` (+`faqSchema` si hay FAQ visible), descripción como texto propio.
- [x] Aclaración en ficha: el precio final incluye IGV y demás cargos (`legal.md 8.3`).
- [x] Filtros de cliente: **no aplica** — no hay filtros; si se agregan, serán JS sin URLs `?param` indexables.

**Criterio de salida**: ✅ Cumplido — 6 rutas de producto generadas y `rodillera-en-validacion` **ausente** de `dist/` y del sitemap (15 URLs, sin 404). Verificado por página: `Product` con `priceCurrency=PEN`, `price`, `itemCondition`, `BreadcrumbList`, `FAQPage` donde hay FAQ visible, `PreOrder`/"Por encargo" coherente entre schema y HTML, stock y precio visibles, OG `1200×630`, `h1` único por página y `h2` = nombres de producto en categoría. `pnpm check` 0 errores. **Pendiente**: Rich Results Test de Google sobre la URL pública (Fase 8/9).

---

## Fase 6 — Páginas legales

Objetivo: cumplimiento INDECOPI visible e indexable.

- [x] `pages/terminos-y-condiciones.astro`: identificación del comercio, precios en soles con IGV, proceso de compra, medios de pago (sin pagos en línea), envíos y plazos, comprobante electrónico, registro sanitario, reclamos — 544 palabras.
- [x] `pages/politica-de-privacidad.astro`: titular del banco de datos, datos recogidos, finalidad, conservación, encargados, derechos ARCO y cómo ejercerlos, cookies — 472 palabras.
- [x] `pages/cambios-y-devoluciones.astro`: plazos, estado del producto, quién asume el flete, excepciones por higiene informadas antes de la compra, nota de crédito, garantía — 421 palabras.
- [x] `pages/contacto.astro`: reutiliza `LocationCta` (mapa, WhatsApp, NAP), `ContactPage` JSON-LD y crumbs.
- [x] Coherencia de datos: todo sale de `SITE`/`LEGAL` en `lib/site.ts` + `lib/hours.ts` (footer, JSON-LD y páginas idénticos). GBM pendiente en Fase 9.
- [x] Páginas legales indexables (sin `noindex`) y sin saturar de keywords.
- [x] Extra de cumplimiento: horario visible en el footer (`legal.md 8.1`) vía `lib/hours.ts` compartido con LocationCta y terminos.
- [x] Contacto enlazado desde header y footer.

**Criterio de salida**: ✅ Cumplido — checklist `legal.md 8.1` verificado **en el HTML del footer de cualquier página** (razón social, RUC, domicilio, teléfono, correo, horario, 4 enlaces legales, aviso de IGV incluido) + pago/envío/comprobante documentados en `terminos-y-condiciones`. Las páginas legales y `/contacto/` están en `sitemap-0.xml` (16 URLs), sin `noindex`, y NAP idéntico en home, contacto y terminos. **Pendiente**: coherencia con Google Business Profile (Fase 9) y [VALIDAR] de plazos/garantía con el abogado.

---

## Fase 7 — Libro de Reclamaciones

Objetivo: formulario de hoja de reclamación que envía los datos a un endpoint.

> **Alcance definido por el usuario (frente al plan original):** solo el formulario
> conectado a un endpoint. **Sin backend propio, sin Google Sheets, sin variables de
> entorno y sin pantalla de confirmación** — esos puntos quedan fuera de esta fase.
> El endpoint completo se define en el frontmatter de la página (`const ENDPOINT`).

- [x] `pages/libro-de-reclamaciones.astro`: identificación del proveedor, aviso de plazo (`reclamosResponseDays` = 15 días hábiles) y **`const ENDPOINT` completo en el frontmatter**, pasado al form.
- [x] `components/legal/ReclamacionForm.astro`: consumidor (nombres, documento, domicilio, teléfono, email), bien/servicio (tipo, monto, descripción), reclamo/queja, detalle, pedido, consentimiento de datos personales con enlace a la política.
- [x] Envío: `method="post"` nativo al `action={endpoint}` — cero JavaScript, funciona sin JS; campos ocultos con razón social, RUC, domicilio y URL del sitio (el endpoint no puede leerlos del HTML).
- [x] Aviso de plazo visible en la página ("respondemos en X días hábiles").
- [ ] **Tareas del usuario**: reemplazar el `ENDPOINT` de ejemplo por el real (webhook de Apps Script/Make/propio) y subir el aviso oficial de INDECOPI descargado de "Tu Libro de Reclamaciones".
- [ ] [VALIDAR] Campos del formulario contra la lista vigente de INDECOPI (abogado, Fase 9).
- ~~Endpoint `src/pages/api/reclamos.ts`, Google Sheets, `.env`, pantalla de confirmación, procedimiento interno y copias por correo~~ — **fuera de alcance** por decisión del usuario; si más adelante querés persistir en Sheets o mostrar una copia imprimible, es una fase aparte.

**Criterio de salida**: ✅ Cumplido para el alcance acordado — el formulario renderiza 12 inputs + 2 selects + 2 textareas con `required`, hace POST al endpoint declarado en el frontmatter, sin JavaScript inline, con los4 campos ocultos del proveedor poblados desde `LEGAL`, y la página sigue indexable y en el sitemap.

---

## Fase 8 — SEO técnico, rendimiento y medición

Objetivo: indexación y Core Web Vitals en verde.

- [x] `sitemap-index.xml` accesible: generado (16 URLs en `sitemap-0.xml`) y referenciado en `robots.txt` (`Sitemap: https://www.example.com/sitemap-index.xml`). *Envío a Search Console: tarea del usuario al tener dominio real (Fase 9).*
- [x] JSON-LD verificado localmente: 17/17 páginas parsean. `MedicalBusiness`+`Store` (17, subtipos de `LocalBusiness`→`Organization`), `Product` (6), `BreadcrumbList` (10), `FAQPage` (3), `ContactPage` (1). *Rich Results Test: tarea del usuario con la URL pública.*
- [x] Jerarquía de encabezados: exactamente 1 `<h1>` por página, sin niveles saltados. `title` y `description` únicos en las 17 páginas; canonical en todas; `404.html` con `noindex`.
- [x] Imágenes: 21/21 en **WebP**, todas con `width`/`height` (0 CLS) y `alt` descriptivo sin repetirse dentro de una página. Hero con `srcset` (600/1000/1600w + `sizes`).
  - **Bug corregido**: `CategoryCard`/`FeaturedCategories` stringificaban el `ImageMetadata` con `.src`, así que Astro no podía transformar y dejaba el jpg original ignorando `format="webp"`. Ahora pasan el objeto y los tipos quedaron ajustados a `ImageMetadata`.
- [x] Core Web Vitals (proxys estáticos): LCP = imagen de hero con `fetchpriority="high"` + `loading="eager"` + webp responsive; 4 lazy below the fold; fuentes `@fontsource` con `font-display: swap` (0 CLS por fuentes). *Medición real en PageSpeed: al publicar (Fase 9).*
- [x] Script de eventos: handler global en `BaseLayout` que empuja `{event, href}` a `window.dataLayer` desde cualquier `<a data-event>` — presente en 17/17 páginas, 28 CTAs `data-event` (WhatsApp). No carga analítica por sí solo.
- [x] Enlaces internos: 16/16 páginas rastreables desde `/` (home → categorías → productos → breadcrumb/relacionados; home no enlaza productos sueltos).
- [x] ~~Aviso de cookies con consentimiento~~ **No aplica todavía**: no hay etiqueta de medición cargada (solo el hook `dataLayer`); al instalar GA4/u otro píxel vence `legal.md 8.4` y hay que añadirlo.
- [x] ~~Páginas de servicio 500+ palabras~~ **No aplica**: no existen `/servicios/[slug]`; los servicios de la home enlazan a WhatsApp (decisión registrada en Fase 4).

**Criterio de salida**: ✅ Cumplido en lo verificable localmente — todo el checklist estático en verde (17 páginas, 0 errores de `check`, imágenes webp, JSON-LD válido, crawl completo, eventos listos). Pendiente de medición post-despliegue: PageSpeed ≥90 móvil, indexación en Search Console y clics de WhatsApp en la analítica (Fase 9).

---

## Fase 9 — Publicación y checklist pre-lanzamiento

Objetivo: salir al aire sin deudas legales ni SEO.

**Estado**: ✅ checklist verificable localmente al 100%; ⏳ pendiente lo que depende del
dominio real / datos del negocio / abogado (lista al final).

### Verificado en este entorno (build + `dist/`)
- [x] `trailingSlash: 'always'` consistente: todas las URLs de página terminan en `/`; ninguna URL de página con mayúsculas, tildes, `ñ` ni espacios (`seo.md §10`).
- [x] `site` apunta a `https://www.example.com` con una sola versión (el valor real se cambia junto con el dominio — ⏳ abajo).
- [x] Enlace al Libro de Reclamaciones visible en **17/17 páginas** (footer global).
- [x] Precios en soles con IGV: aviso "incluyen IGV" presente, **0** referencias a "precio sin IGV", **0** etiquetas de oferta (si se agregan, exigen vigencia + condiciones — `legal.md 8.3`).
- [x] Publicidad sanitaria: 0 coincidencias de promesas de cura, "garantizado", testimonios médicos o usos milagrosos en todo el HTML renderizado.
- [x] Página 404 útil: enlaces a las 3 categorías + inicio + WhatsApp, con `noindex`.
- [x] `seo.md §14`: 1 `<h1>` por página · 17 titles ≤60 caracteres y 17 descriptions ≤160 únicos (corregido `seoTitle` de *Rodillera con soporte de ligamentos*, estaba en 70) · canonical en todas · sitemap-index + robots ✓ · 21 imágenes con alt/dimensiones/webp · crawl 16/16 desde `/` · WhatsApp de producto con nombre y URL prellenados.
- [x] Datos legales coherentes (NAP idéntico en footer, contacto, terminos y JSON-LD).

### Dependencias externas (no se pueden completar desde el repo)
- [ ] ⏳ **Dominio con HTTPS** y redirección `www` ↔ sin `www` (hosting) → luego actualizar `site` en `astro.config.mjs`.
- [ ] ⏳ **Datos reales** en `src/lib/site.ts`: razón social, RUC, domicilio, teléfono, correo, WhatsApp, coordenadas y horarios (hoy: datos de prueba).
- [ ] ⏳ **Endpoint real** del libro de reclamaciones en el frontmatter de `libro-de-reclamaciones.astro` + aviso oficial de INDECOPI.
- [ ] ⏳ **Google Business Profile** dado de alta con NAP idéntico al sitio.
- [ ] ⏳ **Search Console**: verificar dominio, enviar `sitemap-index.xml`, revisar cobertura; medir PageSpeed ≥90 en móvil.
- [ ] ⏳ **Decisión de analítica** (GA4 u otra): si se instala, vence la obligación de aviso de cookies (`legal.md 8.4`).
- [ ] ⏳ **[VALIDAR] con el abogado**: plazo de respuesta de reclamos (15 días hábiles), inscripción del banco de datos ANPDP, alcance de garantía, lista de campos de la hoja de reclamación.
- [ ] ⏳ **Fotos con derechos** y marcas autorizadas (hoy: imágenes de prueba en `src/assets/`).
- [ ] ⏳ **Backup versionado**: el repo solo tiene el `Initial commit`; todo el trabajo sigue sin commitear.

**Criterio de salida**: 🟡 estáticamente el 100% de `seo.md §14` + `legal.md 8.1` está en verde; "sitio respondiendo en producción" queda pendiente del dominio y hosting.

---

## Mapa de dependencias

```
Previas ─▶ F1 ─▶ F2 ─▶ F3 ─▶ F4 ─▶ F5 ─▶ F8 ─▶ F9
                     └────────▶ F6 ─▶ F7 ─┘
```

F6 puede correr en paralelo con F4/F5 (solo necesita F3). F7 es la única fase que exige decisión de backend.
