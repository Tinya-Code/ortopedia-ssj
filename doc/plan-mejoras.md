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

**Evidencia** (commits `f0044e8` + `0b43b1d`): build 17 HTML / check 0 (45 archivos) / 1 `h1` por página / grep de `max-w-*` vacío / `<Container` en 15 archivos / `<PageHeader` en 8 páginas / sin tokens prohibidos / sin `astro:content`.

---

## Fase M3 — Shell: skip link, header sticky + menú móvil, footer (§3.2–3.4)

Objetivo: navegación accesible y chrome consistente en las 17 páginas.

- [ ] `SkipLink` como primer hijo de `<body>` (`sr-only focus:not-sr-only`, → `#main`).
- [ ] Header **sticky**: `sticky top-0 z-40 bg-white/95 backdrop-blur border-b`, altura `h-16`.
- [ ] `layout/MobileNav.astro` (`<details>` sin JS): marca a la izquierda + hamburguesa 44×44, panel a ancho completo con los 4 enlaces + Libro de Reclamaciones; `≥ md` nav horizontal + `ReclamacionesLink` + botón CTA compacto "WhatsApp" (`data-event="whatsapp_click"`).
- [ ] `aria-current="page"` activo (`text-primary font-semibold` + `border-b-2 border-primary`).
- [ ] Enlace "Servicios" → `/#servicios`.
- [ ] Footer: fondo `bg-neutral/5`, `border-t`, `py-10`, enlaces `min-h-11 inline-flex items-center` en móvil, fila inferior con `©` (sin duplicar el aviso IGV de `LegalFooter`).
- [ ] `Breadcrumbs` (§4): texto `text-sm` y, en móvil, `overflow-x-auto whitespace-nowrap` para que no parta el trail.

**Criterio de salida**: gates globales + `grep -c 'sticky top-0' dist/index.html` = 1 + `<details` presente en las 17 páginas + skip link es el primer hijo de `<body>` en el HTML de salida.
**Riesgo**: el header sticky tape anclas → verificar `/#servicios` y `#ubicacion` (agregar `scroll-mt-20` si hace falta; M8 lo hace en legales).
**Rollback**: revert del commit (chrome completo, sin lógica de negocio).

---

## Fase M4 — Familia producto: badge, precio, cebra y galería (§4, §5.4–5.5, §6.4)

Objetivo: ficha y tarjetas con disponibilidad, precio centralizado y lectura cómoda.

- [ ] `product/AvailabilityBadge.astro` (`InStock|PreOrder|OutOfStock` → En stock / Por encargo / Agotado, con texto, no solo color).
- [ ] `ui/PriceTag.astro` (`S/ 120.00` + "Incluye IGV"; "Consultar precio" si no hay) — reemplaza el formato duplicado en `ProductCard` e `ProductInfo`.
- [ ] `ProductInfo`: orden h1 → `AvailabilityBadge` → `PriceTag` (lg) → aviso IGV → CTA WhatsApp a ancho completo en móvil.
- [ ] `ProductCard`: badge en esquina de la imagen + `PriceTag`.
- [ ] `ProductSpecs`: filas cebra `odd:bg-neutral/5`, clave `font-semibold text-ink`.
- [ ] `RelatedProducts`: precio alineado a la derecha.
- [ ] `ProductGallery`: miniaturas en fila con `overflow-x-auto` en móvil.
- [ ] Columna derecha de la ficha: `md:sticky md:top-24`.

**Criterio de salida**: gates globales + las 6 fichas muestran `S/ X.XX` (formato unificado: mismo patrón en `dist/producto/*/index.html`) + disponibilidad visible **con texto** en las 6 fichas + JSON-LD sigue coherente (`PreOrder` ↔ "Por encargo").
**Riesgo**: el badge no debe contradecir el schema de oferta (mismo valor de `availability`).
**Rollback**: revert del commit (componentes de producto + tarjetas).

---

## Fase M5 — Home: CTAs del hero, TrustBar, acordeón y ritmo de bandas (§4, §5.6–5.10, §6.1)

Objetivo: home con la distribución prescrita y componentes nuevos, sin JS.

- [ ] `Hero`: usar el `<slot/>` con **2 botones** (primario WhatsApp + outline "Ver catálogo") → esto **da uso a `ui/Button`** (código muerto hoy); imagen debajo del texto en móvil, `rounded-card`.
- [ ] `ui/Button`: variantes primario/outline de §2.4 (`bg-primary text-white rounded-lg px-5 py-3 font-semibold hover:bg-primary/90`) y `min-h-11` para área táctil ≥ 44px.
- [ ] `ui/Accordion.astro` (`<details>`, chevron CSS `group-open:rotate-180`, `min-h-11`) → `Faq` deja el `<dl>`.
- [ ] `home/TrustBar.astro` (nuevo): 3–4 hechos verificables, `grid grid-cols-2 md:grid-cols-4`, `text-sm`, bajo el hero; **sin `h2`** (es una franja: `section` con `aria-label`, no un título de sección).
- [ ] `home/HowItWorks.astro` (nuevo): `<ol>` `md:grid-cols-4`, número en círculo `bg-primary`, entre `WhyUs` y `Faq`; datos en la página.
- [ ] `WhyUs`: icono + h3 + texto, `sm:grid-cols-2 lg:grid-cols-4`.
- [ ] `ServicesGrid`: icono SVG `size-10 text-primary` + enlace "Consultar →".
- [ ] `CtaBand.astro` (nuevo): `bg-primary`, h2 + `WhatsAppButton` blanco → cierre de la home.
- [ ] Bandas: `py-12 md:py-16` y alternancia blanco/gris/blanco/gris/blanco/gris/blanco/primary según §6.1.
- [ ] `LocationCta`: en móvil, botones (WhatsApp + "Cómo llegar") **antes** del mapa.

**Criterio de salida**: gates globales + `grep -c '<h2' dist/index.html` = **7** (hoy 5: servicios, categorías, por qué, FAQ, ubicación → +cómo funciona, +CtaBand; TrustBar no suma) + alternancia de fondos verificada en `dist/index.html` + `grep -c '<details' dist/index.html` ≥ 4 (FAQ) + 1 `h1`.
**Riesgo**: el JSON-LD `FAQPage` se arma en la página — debe seguir coincidiendo con el acordeón renderizado.
**Rollback**: revert del commit (home + componentes nuevos).

---

## Fase M6 — Catálogo y categoría: chips y CTA (§5.11, §6.2–6.3)

Objetivo: navegación lateral entre categorías y cierre de conversión.

- [ ] `catalog/CategoryChips.astro` (nuevo): `flex flex-wrap gap-2`, `aria-current` en la activa; consolidar el estilo de chips del 404 con este.
- [ ] `/catalogo/[category]/`: chips bajo el `PageHeader`; categoría vacía → `Callout tone="info"` con mensaje + WhatsApp.
- [ ] `CtaBand` al final de `/catalogo/` ("¿No encuentras lo que buscas?") y de cada categoría (`categoryWhatsappMessage`).

**Criterio de salida**: gates globales + chips en las 3 categorías con `aria-current="page"` exactamente 1 + `grep -c '<h2' dist/catalogo/index.html` = **4** (3 `CategoryCard` + `CtaBand`) + en cada categoría el `h2` de `CtaBand` suma 1 (productos + 1) + un solo CTA final por página.
**Rollback**: revert del commit.

---

## Fase M7 — Barra fija móvil de producto (§5.9)

Objetivo: CTA de compra siempre a mano en móvil sin pisar el flotante.

- [ ] `product/StickyProductBar.astro` (nuevo): `fixed inset-x-0 bottom-0 z-40 md:hidden`, nombre corto + `PriceTag` + botón WhatsApp (`whatsapp_product`).
- [ ] Flotante global: `BaseLayout` recibe un prop nuevo (p. ej. `hideFloatingCta?: boolean`) que **solo** la página de producto activa → el flotante sale con `hidden md:flex` ahí y queda igual en las otras 16 páginas.
- [ ] `pb-24 md:pb-0` en el `<main>` de la ficha de producto.

**Criterio de salida**: gates globales + en el HTML de producto: barra presente **y** flotante con `hidden md:flex`; en el resto de las páginas el flotante **sin** `hidden`.
**Riesgo**: superposición de dos CTA fijos → es el punto del checklist de aceptación.
**Rollback**: revert del commit.

---

## Fase M8 — Páginas interiores: legales, libro, contacto y 404 (§6.5–6.8, P3)

Objetivo: terminar las páginas de lectura larga y los estados de contacto/error.

- [ ] **Legales**: fecha "Última actualización" (`text-sm`) bajo el `PageHeader`; índice interno (`<ol>` de anclas) si > 6 secciones; `scroll-mt-20` en cada `h2` con `id`; prosa manual (`space-y-4`, `list-disc pl-6`); `Callout tone="legal"` para avisos clave.
- [ ] **Libro**: `Callout tone="warning"` para plazo de respuesta + conservación 2 años (reemplaza el `div` de aviso).
- [ ] **`ReclamacionForm`** (§4): inputs `min-h-11 rounded-lg border-neutral/30 focus:border-primary`, etiquetas siempre visibles (nunca placeholder-as-label) y errores en `text-danger` con `aria-describedby` + `aria-live="polite"` en `data-status`.
- [ ] **Contacto**: tarjetas de canales `grid sm:grid-cols-3` (WhatsApp · Teléfono · Correo) reutilizando estilo de tarjeta; resolver el TODO del punto de referencia con un dato concreto.
- [ ] **404**: `PageHeader`, `CategoryChips` (sin activa), `Button` primary "Volver al inicio" + outline "Escribir por WhatsApp"; `noindex` se mantiene.
- [ ] **P3**: `product/RegistroBadge.astro` ("Registro sanitario N · Clase II") junto al precio en `ProductInfo`.

**Criterio de salida**: gates globales + índice de anclas resuelto en las 3 legales (todos los `href="#…"` con destino) + `grep -c 'noindex' dist/404.html` = 1 + `RegistroBadge` visible en las 6 fichas.
**Rollback**: revert del commit.

---

## Fase M9 — Verificación final y actualización del inventario (§7.10, §8)

Objetivo: cerrar con evidencia y dejar `estado-implementado.md` fiel al nuevo estado.

- [ ] Checklist completo de `mejoras.md §8` (comandos + visual/UX + accesibilidad + contenido + rendimiento).
- [ ] Verificaciones de comportamiento que no cubre `pnpm check`:
  - [ ] Sin scroll horizontal a 320 / 375 / 768 / 1024 / 1440 px.
  - [ ] Anclas `/#servicios` y `#ubicacion` no quedan tapadas por el header sticky.
  - [ ] Menú móvil operable con teclado y `aria-expanded`.
  - [ ] Producto móvil: barra fija visible y flotante **no** superpuesto.
  - [ ] Footer pegado al piso en 404 y libro.
  - [ ] Contraste ≥ 4.5:1 en `secondary` corregido y `accent-text`.
- [ ] Actualizar `doc/estado-implementado.md`: §1 árbol, §2.2 tabla de componentes (los nuevos), §3 composición por página **y su distribución** (§3.0 + bloques), §5 UI transversal (header sticky, acordeón, barra fija).
- [ ] Commit: `docs: actualizar estado-implementado tras las mejoras UI/UX` (junto con el detalle final, no separado del cambio que documenta).

**Criterio de salida**: ✅ todas las casillas de §8 en verde, inventario sincronizado y gates globales en 0.

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
| M8 | `feat(pages): índice en legales, canales de contacto, chips en 404 y RegistroBadge` | revert |
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
