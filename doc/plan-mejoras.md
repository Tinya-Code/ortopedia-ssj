# Plan de mejoras UI/UX — Centro Ortopédico SSJ

Fuente: **`doc/mejoras.md`** (especificación prescriptiva: reglas, sistema de diseño, componentes nuevos)
+ `doc/estado-implementado.md` (estado actual verificado).

**Stack fijo**: Astro 7 SSG + Tailwind v4, sin frameworks JS, sin `astro:content`, `pages/` smart /
`components/` dumb, hrefs internos con `/` final.

**Convención de este plan**: una tarea se marca `[x]` solo cuando pasa su **criterio de salida**.
Cada fase = **una unidad de commit** con propósito único, su verificación dentro de la misma unidad
y un rollback acotado a esa fase.

**Una adaptación respecto del orden de `mejoras.md §7`**: `PriceTag`, `AvailabilityBadge` y
`Accordion` no se crean en la fase de "base UI" sino en la fase que los adopta (M4 y M5), para no
dejar componentes nuevos sin uso en commits intermedios. El resto del orden se mantiene.

---

## Gates que aplican a TODAS las fases

Correr tras cada fase, antes de darla por cerrada:

```bash
pnpm build && pnpm check                        # 17 HTML, 0 errores de tipos
for f in $(find dist -name '*.html'); do echo "$f $(grep -o '<h1' $f | wc -l)"; done   # 1 por página
grep -rn "blue-\|primary-[0-9]" src             # vacío (tokens planos)
grep -rn '#[0-9a-fA-F]\{6\}' src/components     # solo WhatsAppButton (#25d366 + hover #1ebe5b)
grep -rn 'astro:content' src                    # vacío
```

Extras por fase que lo requiera (se listan en su criterio).

---

## Decisiones con default (avisar si querés otra)

| # | Decisión | Default que voy a aplicar |
|---|---|---|
| 1 | Token `secondary` incumple contraste con texto blanco (≈3.0:1) | Oscurecer `--color-secondary` → **`#167f7d`** (el `#178582` del spec da 4.455:1 y no alcanza AA; `#167f7d` da 4.81:1) |
| 2 | `FeaturedCategories`: overlay con gradiente vs. imagen+texto | **Mantener imagen arriba / texto abajo** (consistente con `CategoryCard`) |
| 3 | Fondo de `CtaBand` | `bg-primary` con texto blanco |
| 4 | `CtaBand` en `/contacto/` | **No ponerlo** (ya hay WhatsApp visible en `LocationCta`; no duplicar CTA) |
| 5 | Menú móvil del header | `<details>/<summary>` sin JS |
| 6 | `RegistroBadge` (P3) | Sí, al final (Fase M8), junto al precio |

---

## Fase M0 — Línea base versionada

Objetivo: tener el sitio actual (Fases 0–9) en un commit antes de tocar UI, para poder
revertir cada mejora sin arrastrar trabajo anterior.

- [x] `pnpm build && pnpm check` en verde sobre el estado actual.
- [x] Commit único de todo el trabajo existente (hoy: **33 archivos** sin commitear, solo `Initial commit`), sin `.env` ni artefactos de build.
- [x] Mensaje: `feat(site): sitio estático completo — 17 rutas, SEO, legales y libro de reclamaciones`.

**Criterio de salida**: ✅ Cumplido — `fa40505`, 73 archivos (+5675 / −265), `git status` limpio,
`pnpm build` 17 páginas y `pnpm check` 0 errores (42 archivos) antes del commit; revisión previa:
nada de `.env`/`dist`/`node_modules`/`.astro`/`.atl` en el stage.
**Rollback**: revert del commit.

---

## Fase M1 — Tokens, contraste y foco global (§2.1, §2.4)

Objetivo: sistema de diseño accesible antes de componer nada encima.

- [x] `src/styles/global.css` → `@theme` con los tokens nuevos: `--color-ink #111827`, `--color-accent-text #b45309`, `--color-success #15803d`, `--color-warning #b45309`, `--color-danger #b91c1c`, `--radius-card 0.75rem`, `--shadow-card`.
- [x] Corregir `--color-secondary: #21a7a5` → **`#167f7d`** (decisión 1; el `#178582` propuesto daba 4.455:1).
- [x] `ReclamacionesLink`: texto `text-accent` → `text-accent-text` (el ícono queda `text-accent`).
- [x] Foco global: `:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 2px; }`.
- [x] `html { scroll-padding-top: 4rem }` (anticipa el header sticky de M3).
- [x] Regla de títulos aplicada: `text-ink` en **todos** los `h1`/`h2`/`h3` del sitio y en los precios; cuerpo en `text-neutral`. Los `dt` de `Faq` y `ProductSpecs` quedan para M5/M4, que los reescriben.

**Criterio de salida**: ✅ Cumplido — gates globales en verde (17 páginas, 1 `h1` c/u, sin
`blue-*`/`primary-N`, sin hex fuera de `WhatsAppButton`, sin `astro:content`, `pnpm check` 0 en 42
archivos) + `text-accent` solo en el ícono de `ReclamacionesLink` + `text-ink` presente en 11
archivos de componentes y **0 encabezados sin `text-ink`** + CSS compilado con `--color-ink`,
`.text-ink`, `scroll-padding-top:4rem` y `outline:3px solid` + contraste: blanco/`secondary` **4.81:1**
(AA), blanco/`accent-text` 5.02:1, `text-secondary` sobre `bg-neutral/5` 4.53:1.
**Riesgo**: al oscurecer `secondary`, revisar que `text-secondary` sobre blanco siga legible.
**Rollback**: revert de `global.css` + `ReclamacionesLink`.

---

## Fase M2 — Base UI: `Container`, `PageHeader`, `Callout` y su adopción (§5.1–5.3)

Objetivo: eliminar la repetición de clases de contenedor/cabecera/aviso y unificar las páginas interiores.

- [x] `ui/Container.astro` — `size?: 'wide'|'narrow'` (clases de §3.1, con `sm:px-6`).
- [x] `ui/PageHeader.astro` — `title`, `lead?`; `<h1>` + lead `max-w-prose`, `pt-8 pb-6`.
- [x] `ui/Callout.astro` — `tone?: 'info'|'warning'|'legal'`, `title?`; `rounded-card border-l-4 p-4` + `role="note"`.
- [x] Adoptar `Container` en **todas** las páginas (wide: home, catálogo, categoría, producto, contacto; narrow: 3 legales, libro, 404) y en las secciones de home que hoy repiten `mx-auto max-w-6xl px-4` (Header/Footer pueden quedarse con su inner wrapper propio).
- [x] Adoptar `PageHeader` en catálogo, categoría, contacto, libro, 404 y las 3 legales.
- [x] Adoptar `Callout`: aviso de plazo en libro de reclamaciones (`warning`) y aviso médico de `ProductLegal` (`legal`).
- [x] Ritmo de página (§2.3): secciones internas `py-8`, `mt-6` después de cada `h2`, gaps de grilla `gap-4` → `sm:gap-6`, padding `px-4 sm:px-6` vía `Container`; bandas de home `py-12 md:py-16` (§3).

**Criterio de salida**: gates globales + `grep -rn 'max-w-6xl\|max-w-3xl' src/pages src/components | grep -v 'ui/Container.astro' | grep -v 'components/layout/'` **vacío** (nadie repite el ancho salvo el helper) + `grep -rln '<Container' src | wc -l` ≥ 10 + `grep -rln '<PageHeader' src/pages | wc -l` = **8 archivos** (catálogo, categoría, contacto, libro, 404 y los 3 legales).
**Riesgo**: `PageHeader` duplica el `h1` si una página lo deja en su markup → revisar 1 `h1` por página (gate).
**Rollback**: borrar los 3 componentes y revert de páginas (commit aislado).

**Evidencia** (commits `f0044e8` + `241407f`): build 17 HTML / check 0 (45 archivos) / 1 `h1` por página / grep de `max-w-*` vacío / `<Container` en 15 archivos / `<PageHeader` en 8 páginas / sin tokens prohibidos / sin `astro:content`.

---

## Fase M3 — Shell: skip link, header sticky + menú móvil, footer (§3.2–3.4)

Objetivo: navegación accesible y chrome consistente en las 17 páginas.

- [x] `SkipLink` como primer hijo de `<body>` (oculto fuera de pantalla, → `#main`; visible con foco — ver nota en evidencia).
- [x] Header **sticky**: `sticky top-0 z-40 bg-white/95 backdrop-blur border-b`, altura `h-16`.
- [x] `layout/MobileNav.astro` (`<details>` sin JS): marca a la izquierda + hamburguesa 44×44, panel a ancho completo con los 4 enlaces + Libro de Reclamaciones; `≥ md` nav horizontal + `ReclamacionesLink` + botón CTA compacto "WhatsApp" (`data-event="whatsapp_click"`).
- [x] `aria-current="page"` activo (`text-primary font-semibold` + `border-b-2 border-primary`).
- [x] Enlace "Servicios" → `/#servicios`.
- [x] Footer: fondo `bg-neutral/5`, `border-t`, `py-10`, enlaces `min-h-11 inline-flex items-center` en móvil, fila inferior con `©` (sin duplicar el aviso IGV de `LegalFooter`).
- [x] `Breadcrumbs` (§4): texto `text-sm` y, en móvil, `overflow-x-auto whitespace-nowrap` para que no parta el trail.

**Criterio de salida**: gates globales + `grep -c 'sticky top-0' dist/index.html` = 1 + `<details` presente en las 17 páginas + skip link es el primer hijo de `<body>` en el HTML de salida.
**Riesgo**: el header sticky tape anclas → verificar `/#servicios` y `#ubicacion` (agregar `scroll-mt-20` si hace falta; M8 lo hace en legales).
**Rollback**: revert del commit (chrome completo, sin lógica de negocio).

**Evidencia** (commits `29a6f9a` + `d25ee0d`): build 17 HTML / check 0 (47 archivos) / `sticky top-0` = 1 en home / `<details>` en 17 de 17 páginas / `<a href="#main">` es el primer hijo de `<body>` / 1 `h1` por página / sin tokens ni hex fuera de `WhatsAppButton` / `©` aparece 1 vez por página (fila inferior del footer; LegalFooter deja de duplicarlo) / `scroll-padding-top: 4rem` en `global.css` cubre `/#servicios` y `#ubicacion`.
**Nota de implementación**: el `sr-only focus:not-sr-only` del plan dejaba el enlace en 1×1 recortado (conflicto de `position` entre utilidades) → se implementó con `-top-40` + `focus:top-4`, que solo cambia una propiedad; utilidades verificadas en el CSS de `dist`.

---

## Fase M4 — Familia producto: badge, precio, cebra y galería (§4, §5.4–5.5, §6.4)

Objetivo: ficha y tarjetas con disponibilidad, precio centralizado y lectura cómoda.

- [x] `product/AvailabilityBadge.astro` (`InStock|PreOrder|OutOfStock` → En stock / Por encargo / Agotado, con texto, no solo color).
- [x] `ui/PriceTag.astro` (`S/ 120.00` + "Incluye IGV"; "Consultar precio" si no hay) — reemplaza el formato duplicado en `ProductCard` e `ProductInfo`.
- [x] `ProductInfo`: orden h1 → `AvailabilityBadge` → `PriceTag` (lg) → aviso IGV → CTA WhatsApp a ancho completo en móvil.
- [x] `ProductCard`: badge en esquina de la imagen + `PriceTag`.
- [x] `ProductSpecs`: filas cebra `odd:bg-neutral/5`, clave `font-semibold text-ink`.
- [x] `RelatedProducts`: precio alineado a la derecha.
- [x] `ProductGallery`: miniaturas en fila con `overflow-x-auto` en móvil.
- [x] Columna derecha de la ficha: `md:sticky md:top-24`.

**Criterio de salida**: gates globales + las 6 fichas muestran `S/ X.XX` (formato unificado: mismo patrón en `dist/producto/*/index.html`) + disponibilidad visible **con texto** en las 6 fichas + JSON-LD sigue coherente (`PreOrder` ↔ "Por encargo").
**Riesgo**: el badge no debe contradecir el schema de oferta (mismo valor de `availability`).
**Rollback**: revert del commit (componentes de producto + tarjetas).

**Evidencia** (commit `8466129`): build 17 HTML / check 0 / las 6 fichas con `S/ X.XX` unificado (75/85/120/145/890/1250.00) + "En stock" ×5 y "Por encargo" ×1 con texto / `schema.org/PreOrder` + "Por encargo" en `silla-ruedas-aluminio` (coherente) / badge también en tarjetas de categoría (2 en `/catalogo/rodilleras/`) / `self-start md:sticky md:top-24` presente / cebra `odd:bg-neutral/5` y `dt` en `text-ink` / miniaturas con `overflow-x-auto` / sin "Consultar precio" (todos los productos publicados tienen precio) / 1 `h1` por página / sin tokens ni hex fuera de `WhatsAppButton`.
**Nota**: el producto sin registro sanitario (`rodillera-en-validacion`, `OutOfStock`) sigue filtrado por `isPublishable` — la rama `Agotado` existe por si se publica.

---

## Fase M5 — Home: CTAs del hero, TrustBar, acordeón y ritmo de bandas (§4, §5.6–5.10, §6.1)

Objetivo: home con la distribución prescrita y componentes nuevos, sin JS.

- [x] `Hero`: usar el `<slot/>` con **2 botones** (primario WhatsApp + outline "Ver catálogo") → esto **da uso a `ui/Button`** (código muerto hoy); imagen debajo del texto en móvil, `rounded-card`.
- [x] `ui/Button`: variantes primario/outline de §2.4 (`bg-primary text-white rounded-lg px-5 py-3 font-semibold hover:bg-primary/90`) y `min-h-11` para área táctil ≥ 44px.
- [x] `ui/Accordion.astro` (`<details>`, chevron CSS `group-open:rotate-180`, `min-h-11`) → `Faq` deja el `<dl>`.
- [x] `home/TrustBar.astro` (nuevo): 3–4 hechos verificables, `grid grid-cols-2 md:grid-cols-4`, `text-sm`, bajo el hero; **sin `h2`** (es una franja: `section` con `aria-label`, no un título de sección).
- [x] `home/HowItWorks.astro` (nuevo): `<ol>` `md:grid-cols-4`, número en círculo `bg-primary`, entre `WhyUs` y `Faq`; datos en la página.
- [x] `WhyUs`: icono + h3 + texto, `sm:grid-cols-2 lg:grid-cols-4`.
- [x] `ServicesGrid`: icono SVG `size-10 text-primary` + enlace "Consultar →".
- [x] `CtaBand.astro` (nuevo): `bg-primary`, h2 + `WhatsAppButton` blanco → cierre de la home.
- [x] Bandas: `py-12 md:py-16` y alternancia blanco/gris/blanco/gris/blanco/gris/blanco/primary según §6.1.
- [x] `LocationCta`: en móvil, botones (WhatsApp + "Cómo llegar") **antes** del mapa.
- [x] **Tarea agregada** (hueco del plan): tarjetas de §2.4 → `rounded-card border shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none` en `ServicesGrid`, `FeaturedCategories`-tarjetas, `WhyUs`, `ProductCard`, `CategoryCard` y `RelatedProducts`.

**Criterio de salida**: gates globales + `grep -c '<h2' dist/index.html` = **7** (hoy 5: servicios, categorías, por qué, FAQ, ubicación → +cómo funciona, +CtaBand; TrustBar no suma) + alternancia de fondos verificada en `dist/index.html` + `grep -c '<details' dist/index.html` ≥ 4 (FAQ) + 1 `h1`.
**Riesgo**: el JSON-LD `FAQPage` se arma en la página — debe seguir coincidiendo con el acordeón renderizado.
**Rollback**: revert del commit (home + componentes nuevos).

**Evidencia** (commit `52705a8`): build 17 HTML / check 0 / `<h2` = **7** en home (servicios, categorías, por qué, cómo funciona, FAQ, ubicación, CtaBand — TrustBar sin `h2`) / `<details` = **5** (4 FAQ + 1 menú móvil) / 1 `h1` / secuencia de bandas verificada: blanco → blanco(border-y) → gris → blanco → gris → blanco → gris → blanco → primary / `ui/Button` renderizado 3× (hero primario + outline, "Cómo llegar") / `WhatsAppButton` variante `white` en CtaBand / JSON-LD FAQPage ↔ acordeón: cada pregunta aparece 2× (summary + schema) / conector de HowItWorks ×3 / sin tokens ni hex fuera de `WhatsAppButton`.
**Nota**: `grep -c` cuenta líneas y dist es de una sola línea — la verificación real se hizo con `grep -o | wc -l`.

---

## Fase M6 — Catálogo y categoría: chips y CTA (§5.11, §6.2–6.3)

Objetivo: navegación lateral entre categorías y cierre de conversión.

- [x] `catalog/CategoryChips.astro` (nuevo): `flex flex-wrap gap-2`, `aria-current="page"` en la activa (`bg-primary text-white`), inactivas outline con `hover:bg-primary/5`, `min-h-11`; 404 reutiliza el componente (se eliminó la lista `ul` duplicada con `hover:bg-primary hover:text-white`).
- [x] `/catalogo/[category]/`: chips bajo el `PageHeader` (orden §6.3: h1 → chips → intro → productos); categoría vacía → `Callout tone="info"` con mensaje + WhatsApp (ninguna de las 3 está vacía: el estado queda cubierto por el `getStaticPaths` y el guard).
- [x] `CtaBand` al final de `/catalogo/` ("¿No encuentras lo que buscas?" + `generalWhatsappMessage`) y de cada categoría (`categoryWhatsappMessage`); se eliminó el botón WhatsApp suelto (`mt-8`) → un solo CTA final por página.

**Criterio de salida**: gates globales + chips en las 3 categorías con `aria-current="page"` exactamente 1 + `grep -c '<h2' dist/catalogo/index.html` = **4** (3 `CategoryCard` + `CtaBand`) + en cada categoría el `h2` de `CtaBand` suma 1 (productos + 1) + un solo CTA final por página.
**Rollback**: revert del commit.

**Evidencia** (commit `74aefc4`): build 17 / check 0 / 1 `h1` por página / chips `<nav aria-label="Categorías">` con **1** `aria-current="page"` dentro del nav en las 3 categorías (los otros `aria-current` de la página son Breadcrumbs + nav del header/MobileNav, marcados dinámicamente desde M3) / `dist/catalogo/index.html` `<h2` = **4** (3 `CategoryCard` + `CtaBand`) / categorías: rodilleras 3, bastones 3, sillas-de-ruedas 3 = 2 productos + `CtaBand` / botón blanco del `CtaBand` = 1 por página (404 = 0, queda en M8) / label "Asesoría por WhatsApp" eliminado / orden chips → intro → grid verificado por posición en el HTML / estilo de chips viejo del 404 eliminado / gates globales ok.

---

## Fase M7 — Barra fija móvil de producto (§5.9)

Objetivo: CTA de compra siempre a mano en móvil sin pisar el flotante.

- [x] `product/StickyProductBar.astro` (nuevo): `fixed inset-x-0 bottom-0 z-40 md:hidden`, nombre corto (`truncate` + `min-w-0`) + `PriceTag` + botón WhatsApp (`whatsapp_product`), `aria-label="Compra rápida"`.
- [x] Flotante global: `BaseLayout` recibe `hideFloatingCta?: boolean` (solo la página de producto lo activa) → `WhatsAppButton` acepta `mobileHidden` y la variante flotante sale con `hidden md:flex`; igual en las otras 16 páginas (`inline-flex`).
- [x] `pb-24 md:pb-0` reservado. **Desviación justificada**: se aplicó en `<body>` (vía `hideFloatingCta`) y no en `<main>`; la barra es full-width y con el padding solo en `main` taparía la fila `©` y los enlaces del footer, que quedarían además fuera de alcance de clic.

**Criterio de salida**: gates globales + en el HTML de producto: barra presente **y** flotante con `hidden md:flex`; en el resto de las páginas el flotante **sin** `hidden`.
**Riesgo**: superposición de dos CTA fijos → es el punto del checklist de aceptación. Nunca coinciden: barra `md:hidden` × flotante `hidden md:flex`.
**Rollback**: revert del commit.

**Evidencia** (commit `0d55154`): matriz de las 17 páginas — 6 de producto: barra = 1, flotante `hidden md:flex`, `pb-24 md:pb-0` = 1; 11 archivos restantes: flotante `inline-flex` (clase completa `fixed bottom-4 right-4 z-50 …` verificada), sin barra y sin pb. `data-event="whatsapp_product"` ×2 en la ficha (ProductInfo + barra). build 17 / check 0 / 1 `h1` por página / gates globales ok.
**Bug propio detectado y corregido antes de commitear**: en el primer edit de `WhatsAppButton` se cayó el prefijo `fixed bottom-4 right-4 z-50` de la variante flotante (quedó como botón estático en las 17 páginas); la matriz de verificación lo marcó como `NINGUNO` y se restauró en el mismo ciclo.

---

## Fase M8 — Páginas interiores: legales, libro, contacto y 404 (§6.5–6.8, P3)

Objetivo: terminar las páginas de lectura larga y los estados de contacto/error.

- [x] **Legales**: fecha "Última actualización" (`text-sm`) bajo el `PageHeader` en las 3 (fuente única `LEGAL.lastUpdated` en `lib/site.ts`); índice interno `<nav aria-label="Índice">` + `<ol>` de anclas (9 · 8 · 7 secciones, todas > 6); `id` + `scroll-mt-20` en cada `h2`; prosa con `space-y-4` por sección (`mt-3` fuera de las hijas, `list-disc pl-6` intacto); `Callout tone="legal"` ×1 por página (pago en línea en términos, cookies en privacidad, excepción de higiene en cambios).
- [x] **Libro**: `Callout tone="warning"` con plazo de respuesta + conservación 2 años — **ya cumplido** desde las fases iniciales, verificado (no había `div` de aviso que reemplazar).
- [x] **`ReclamacionForm`** (§4): 11 controles con `min-h-11 … focus:border-primary` (+ botón `min-h-11` y `hover:bg-primary/90`); etiquetas siempre visibles (0 `placeholder` en el archivo); errores por campo en `text-danger` con `id` + `aria-describedby` (12) y `aria-invalid`/`border-danger` gestionados por JS en español; `noValidate` solo con JS (sin JS sigue la validación nativa que protege el POST); foco al primer inválido y limpieza al tipear; `aria-live="polite"` en `data-status` ya existía.
- [x] **Contacto**: tarjetas de canales `grid sm:grid-cols-3` (WhatsApp · Teléfono · Correo) con datos desde `lib/site.ts` y estilo de tarjeta; el TODO del punto de referencia se resolvió con un dato concreto de la capa de datos ("Punto de referencia: {street}, {city} ({region})") — el TODO de datos reales queda centralizado en `lib/site.ts`.
- [x] **404**: `PageHeader` + `CategoryChips` (sin activa, desde M6) + `Button` primary "Volver al inicio" + `Button` outline "Escribir por WhatsApp"; `noindex` intacto.
- [x] **P3**: `product/RegistroBadge.astro` ("Registro sanitario DM-… · Clase II") junto al precio en `ProductInfo`, con guard por `registroSanitario`.

**Criterio de salida**: gates globales + índice de anclas resuelto en las 3 legales (todos los `href="#…"` con destino) + `grep -c 'noindex' dist/404.html` = 1 + `RegistroBadge` visible en las 6 fichas.
**Rollback**: revert del commit.

**Evidencia** (commit `ba6a183`): índices con `sin_destino=[]` en las 3 legales (10/9/8 anclas incluido el skip `#main`); `scroll-mt-20` = 9/8/7; fecha = 1 por página; `Callout` (`role="note"`) = 1 por legal; `noindex` en `dist/404.html` = **1** (`<meta name="robots" content="noindex, nofollow">`); `Registro sanitario DM-…` en **6/6** fichas; form en dist: `focus:border-primary` = 11, `aria-describedby` = 12, `text-danger` = 12, `required` = 11, `type=email/tel/number` = 3, 0 `placeholder`, `aria-live` = 1, JS de validación empaquetado en el HTML de la página; contacto sin `TODO` y con los 3 canales (`wa.me`/`tel:`/`mailto:`); build 17 / check 0 / 1 `h1` ×17 / gates globales ok.
**Bug propio detectado y corregido antes de cerrar**: el primer transform de inputs del form usó el `attrs` previo al `name` y descartó lo posterior — 7 inputs perdieron `required`, `class` y `type=email|tel|number`; se restauró desde `git checkout` y se rehízo el transform conservando atributos byte a byte, ahora con asserts de contenido (no solo de conteo) sobre `required`/`type`/`class`.

---

## Fase M9 — Verificación final y actualización del inventario (§7.10, §8)

Objetivo: cerrar con evidencia y dejar `estado-implementado.md` fiel al nuevo estado.

- [x] Checklist completo de `mejoras.md §8` (comandos + visual/UX + accesibilidad + contenido + rendimiento) — todo en verde, evidencia abajo.
- [x] Verificaciones de comportamiento que no cubre `pnpm check` (matriz CDP con Edge headless, scripts temporales, sin dependencias nuevas):
  - [x] Sin scroll horizontal a 320 / 375 / 768 / 1024 / 1440 px — 17 páginas × 5 viewports = **0 fails**.
  - [x] Anclas `/#servicios` y `/#ubicacion` — `targetTop = 64 = headerBottom` en 3 viewports, `scroll-padding-top: 64px` confirmado, sin contenido tapado.
  - [x] Menú móvil operable con teclado — `keyDown` real: Enter abre (panel `navTop = 64 = headerBottom`), lo cierra y lo reabre; AX `role=DisclosureTriangle` + `expanded=true` (estado nativo de `<details>`, sin `aria-expanded` estático). Links abiertos 343×44; sin Esc porque no hay script (§8 lo condiciona al script).
  - [x] Producto móvil: barra fija visible (`display:block`) y flotante **no** superpuesto (`display:none`) @375; inverso @1024.
  - [x] Footer pegado al piso en 404 y libro — `docH = footerBottom = viewportHeight` (vh 1400 y 3000); `body min-h 100vh` + `main flex-1`.
  - [x] Contraste ≥ 4.5:1 — `secondary` 4.81:1 y `accent-text` 5.02:1; además la verificación detectó **WhatsApp `text-white` sobre `#25d366` = 1.98:1** → corregido a `text-ink` (8.94:1, hover 7.24:1).
  - [x] Foco y skip link — 8 Tab en home con `outline: 3px solid primary`; skip link → `#main` → el siguiente Tab cae dentro de `main`; 6 controles del form con outline.
  - [x] Labels y estados del form — 12 labels visibles (por contención, `labels.length`), 0 sin label, 4 `type=hidden` exentos, 12 `aria-describedby`, estado `aria-live=polite`.
  - [x] Contenido y jerarquía — sin testimonios ni afirmaciones clínicas; precios solo vía `PriceTag`; IGV en ficha y footer; href internos con `/` final; `ui/Button` en uso (Hero + 404); sin `slot name="cta"`.
  - [x] Rendimiento — `fetchpriority=high` en 7 páginas (hero + 6 galerías), eager 13 / lazy 10, mapa `h-80`, CLS 0 con dimensiones de imagen.
- [x] Actualizar `doc/estado-implementado.md`: §1 árbol y tokens, §2.1 rutas, §2.2 tabla de componentes (los nuevos), §3 composición por página **y su distribución** (§3.0 + bloques), §5 UI transversal (header sticky, skip link, acordeón, barra fija), §6 comandos de verificación, §7 gotchas y §8 pendientes.
- [x] 3 correcciones de código exigidas por la verificación: WhatsApp `text-ink` (`118262a`), áreas táctiles ≥44px en 11 archivos (`6f881b8`), `slot name="cta"` eliminado (`f6fc770`).
- [x] Commit: `docs: actualizar estado-implementado tras las mejoras UI/UX` (junto con el detalle final, no separado del cambio que documenta).

**Criterio de salida**: ✅ todas las casillas de §8 en verde, inventario sincronizado y gates globales en 0 (build 17 HTML, `pnpm check` 0 errores, 1 `h1` por página, sin tokens planos prohibidos).

---

## Mapa de unidades de commit

| Fase | Commit sugerido | Rollback |
|---|---|---|
| M0 | `feat(site): sitio estático completo — 17 rutas, SEO, legales y libro de reclamaciones` | revert |
| M1 | `feat(ui): tokens de color accesibles, foco global y scroll-padding` | revert |
| M2 | `refactor(ui): Container, PageHeader y Callout adoptados en páginas interiores` | revert |
| M3 | `feat(layout): header sticky con menú móvil sin JS, skip link y footer ajustado` | revert |
| M4 | `feat(product): badge de disponibilidad, PriceTag unificado y ficha reordenada` | revert |
| M5 | `feat(home): CTAs en hero, TrustBar, acordeón FAQ y ritmo de bandas` | revert |
| M6 | `feat(catalog): chips de categoría y CtaBand en catálogo y categorías` | revert |
| M7 | `feat(product): barra fija móvil de compra sin solapar el flotante` | revert |
| M8 | `feat(pages): índice en legales, canales en contacto, form accesible y RegistroBadge` | revert |
| M9 | `fix(a11y): texto ink en botones WhatsApp (AA 8.94:1)` | revert |
| M9 | `fix(a11y): areas táctiles >=44px en enlaces y controles` | revert |
| M9 | `refactor(layout): eliminar slot cta sin uso` | revert |
| M9 | `docs: actualizar estado-implementado tras las mejoras UI/UX` | revert |

---

## Dependencias

```
M0 ─▶ M1 ─▶ M2 ─▶ M3 ─▶ M4 ─▶ M5 ─▶ M6 ─▶ M7 ─▶ M8 ─▶ M9
```

- Todas las fases se apoyan en M1 (tokens) y M2 (Container/PageHeader/Callout).
- M3 (shell) antes que M4–M8: el header sticky condiciona `scroll-mt`/`scroll-padding`.
- M7 depende de M4 (`PriceTag`, orden de la ficha) y de M3 (flotante con `hidden md:flex`).
- M4 y M5 son independientes entre sí: si querés, se pueden intercambiar.
- **M9 siempre al final** (verificación + inventario).

**Criterio de salida del plan**: las 10 fases `[x]`, checklist `mejoras.md §8` completo y
`estado-implementado.md` reflejando el nuevo estado.
