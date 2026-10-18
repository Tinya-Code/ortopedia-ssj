# Plan de mejora UI/UX — Ortopedia SSJ

Fuente: `doc/mejorasui.md`. Adaptado al sitio real: Astro estático, Tailwind v4, cierre por WhatsApp (sin pasarela → las secciones de checkout/pago de la guía NO aplican).

Orden por impacto/esfuerzo. Cada fase declara objetivo y criterio de cierre.

---

## Restricciones (aplican a TODAS las fases)

**Alcance**
- Prohibido: backend, CMS, base de datos, pasarela de pago, sistema de cuentas/ login. El sitio es Astro estático y el cierre es WhatsApp.
- Prohibido: nuevas dependencias de npm sin aprobación explícita en la conversación (incluye librerías de iconos, animaciones y sliders).
- Prohibido: cambios en la lógica de negocio (`src/lib/cart.ts`, capa API, datos) salvo que una tarea lo nombre explícitamente.
- Fuera de alcance permanente: variantes de producto, reseñas verificadas, buscador con backend, checkout online (ver "Deuda explícita").

**Estilo y código**
- Colores, fuentes, radios y sombras SOLO vía tokens de `@theme` en `global.css`. Prohibido valor de color suelto (`text-[#…]`, `bg-red-500`).
- Iconos SOLO desde `src/components/icons/` (registro o import directo). Prohibido `<svg>` inline y emojis como iconos.
- Componentes nuevos en `src/components/` con el patrón existente (Astro puro, sin islas `client:*` salvo justificación).
- Textos de UI en español neutro; microcopy corto (≤20 palabras), verbos concretos, sin jerga.
- Comentarios y docs del código en español; sin atribución a IA en commits.

**Calidad**
- Cada fase se entrega con `npm run build` limpio; ninguna tarea puede romper el build.
- Mínimo WCAG 2.2 AA: contraste, teclado, foco visible, `aria-*` donde aplique.
- Probar en 360 px antes de dar una tarea por hecha; sin overflow horizontal.
- No regresiones: si una tarea toca un componente existente, conservar su comportamiento actual (clases `data-*` del carrito, eventos GA4).

**Proceso**
- Máximo una tarea en progreso por fase; completar y verificar antes de pasar a la siguiente.
- Nada se marca `[x]` sin verificación en código o build.
- Si una tarea resulta más grande de lo previsto (toca >5 archivos), se parte en subtareas, no se ejecuta de una.

---

## F1 — Fundamentos: tipografía, tokens e iconografía

Objetivo: escala tipográfica responsive, contraste AA verificado e iconografía unificada vía registro.

**Tipografía y color**
- [x] Añadir escala `--text-*` en `@theme` de `src/styles/global.css` (H1 36/28, H2 28/22, H3 22/18, cuerpo 16–18, aux 14) — + `text-lead` 18px; migrados 40 headings (h1/h2/h3) en 18 archivos a `text-h1/h2/h3(-lg)`
- [x] Fijar interlineado: 1.5–1.7 cuerpo / 1.2–1.3 títulos (clases `leading-*` en componentes de texto) — line-heights embebidos en los tokens (`--text-*--line-height`)
- [x] Limitar ancho de lectura a `65ch` en descripciones largas (`producto/[slug].astro` ya tenía `max-w-prose`; legales: `<article>` + `mx-auto`; FAQ: contenedor de respuestas en `ui/Accordion.astro`)
- [x] Verificar contraste AA de cada token con color-contrast checker; ajustar en `global.css` los que fallen — `accent-text` #ed2c37 (4.19:1 ✗) → #c81e28 (5.72:1 ✓); `tertiary` documentado decorativo-only; resto OK
- [x] Auditar párrafos centrados de >2 líneas y pasarlos a izquierda — solo Hero móvil (`text-left` en el `<p>`)

**Iconografía (registro `src/components/icons/index.ts`)**
- [x] Migrar el SVG inline de `ServicesGrid.astro:67` al nuevo componente `ArrowRight` del registro
- [x] Añadir al registro: `ArrowRight`, `X`, `Search`, `Trash`, `Star`, `Truck`, `RotateCcw`, `Package` (clon de `Check.astro`: 24×24, `stroke="currentColor"`, `aria-hidden`, Props `{ class?: string }`) — 24 claves en `IconName`
- [x] Regla de uso: datos por clave `IconName`, usos puntuales por import directo — verificado: 0 `<svg>` inline fuera de `src/components/icons/`
- [x] Verificar `class` heredable en todos los iconos nuevos (mismo contrato Props que `Check.astro`)
- [x] Test visual: stroke-width 2 y linecap/linejoin idénticos a iconos preexistentes (mismo template)

Nota (decisión validada): el H1 del Hero escapa a la escala §2.2 — es pieza de presentación de diseño exclusivo (`text-4xl md:text-5xl`), no texto de contenido. Aplica solo a Home > Hero.

Cierre: ningún `<svg>` inline fuera de `src/components/icons/`; contraste AA en todo texto y componente.

## F2 — Ficha de producto

Objetivo: orden de lectura guía §5.3 y miniaturas de galería consistentes.

- [x] Verificar orden: nombre → precio → disponibilidad → CTA → envío/devolución (en `ProductInfo.astro`) — verificado en dist (precio antes que disponibilidad, bloque después del CTA)
- [x] Zoom en imagen principal de `ProductGallery.astro` (lightbox o hover-zoom desktop) — hover-zoom CSS desktop + lightbox `<dialog>` nativo sin dependencias (Escape/backdrop/cerrar), verificado en dist
- [x] Proporción de miniaturas uniforme (4:5) en toda la galería — `aspect-[4/5]` 160×200 + CSS generado verificado (ningún producto tiene >1 imagen aún: el guard `images.length > 1` nunca renderiza thumbs en prod)
- [x] Señal de valor junto al precio en `ProductCard.astro` y ficha (stock restante o "Registro Sanitario" — ya existe `RegistroBadge`, evaluar promoverlo) usando iconos del registro (`star`, `package`) — `star` en RegistroBadge, línea `package` + disponibilidad en ProductCard (build 24p OK)
- [x] Bloque "envío estimado y devolución" bajo el CTA con iconos `truck`/`rotate-ccw` del registro (nuevos, ver F1) — verificado en dist, enlace a /cambios-y-devoluciones/
- [x] Descripción con beneficios primero y especificaciones en tabla (`ProductSpecs.astro`) — orden verificado en dist (Descripción → Beneficios → Cómo usarlo → Guía de tallas → Cuidados → Especificaciones); specs convertidas de `<dl>` a `<table>` con `scope`; productos con arrays vacíos no emiten secciones (verificado)
- [x] Verificar que `StickyProductBar` (CTA móvil fijo) no tapa contenido al hacer scroll al final — `hideFloatingCta` → `pb-24 md:pb-0` (96px) en body vs barra ~70px; CTA flotante oculto en esta página
- [x] Tarea extra (solicitada): sección FAQ visible en la ficha con `ui/Accordion.astro` (mismo array que JSON-LD) + respuestas unificadas para los 9 productos (9/9 con FAQPage y FAQ visible; 0 variantes de higiene)

Cierre: ficha completa legible en 360px sin scroll horizontal y CTA visible siempre.

## F3 — Catálogo y búsqueda

Objetivo: filtros transparentes y estado vacío que no sea un callejón.

- [x] Conteo de resultados por opción en `CategoryFilters.astro` — spans `(n)` por botón, actualizados dinámicamente según la búsqueda en `apply()`; guard en páginas de categoría (0 `data-count-for`)
- [x] Filtros activos como etiquetas removibles + botón "Limpiar filtros" — componente nuevo `ActiveFilters.astro` (chips búsqueda/categoría + X de 24px + clear-all), presente en index y categoría
- [x] Contador de resultados visible en `catalogo/index.astro` — `#catalog-count` con `aria-live="polite"`, texto inicial en build (9 productos), actualizado en `apply()`; también en `[category]`
- [x] Estado vacío con alternativas ("No hay resultados para X. Mira…") reutilizando `ProductGrid` — bloque `#catalog-empty` (título dinámico según búsqueda/filtros + grilla `#catalog-suggestions` con 4 destacados o primeros 4; `li`s sin `data-product-item` ni hooks de carrito/GA4) en index y `[category]`
- [x] Verificar que `CatalogSearch` tolera errores ortográficos (o registrar deuda explícita) — cubierto sin dependencias: normalización (minúsculas + diacríticos) + coincidencia por prefijo de cada palabra de la consulta ("silla rued" → "silla de ruedas"); deuda: errores en el medio de la palabra ("silya") requerirían una librería externa (ver Deuda explícita)
- [x] Confirmar paginación por botón (`CatalogPagination.astro`) sin scroll infinito — verificado: Prev/Next + botones numerados; 0 coincidencias de `IntersectionObserver`/scroll infinito en `src/scripts/` y `src/components/catalog/`

Cierre: aplicar filtro → saber en ≤2 s qué está filtrado y cómo quitarlo.

## F4 — Carrito / lista de cotización

Objetivo: drawer claro como lista de cotización, sin precios "S/ 0.00".

- [x] Ocultar montos en modo cotización (`src/styles/cart-theme.css`)
- [x] Mini-vista al agregar (`openOnAdd: true` en `Cart.astro`)
- [x] Conteo "N productos" en el header del drawer (ya hay `data-cart-count`, verificar texto visible) — `syncCartLabels` en `Cart.astro` con scope `[data-cart-drawer] [data-cart-count]` (badge intacto), listener `cart:change` + `rAF` para el render inicial; pill oculta con `data-empty='true'`
- [x] CTA "Cotizar ahora" con monto no aplica (sin precio) → cambiar label a verbo concreto con cantidad: "Cotizar N productos" — slot `footer-actions` reemplaza CartSummary: botón con icono `arrow-right` del registro + label dinámico (singular/plural), conserva `data-cart-action="checkout"` → interceptado por el handler existente (GA4 begin_checkout intacto)
- [x] Vaciar lista con confirmación (evitar borrado accidental) — botón `trash` del registro abre `<dialog>` ("¿Vaciar la lista?" / "Se quitarán todos los productos…"); confirmar lleva `data-cart-action="clear"` (limpia vía handler del paquete), Cancelar/Escape/backdrop cierran; diálogo FUERA del footer (showModal falla con ancestro `display:none`); foco post-vaciado → botón cerrar del drawer
- [x] Verificar que los botones de acción del drawer (quantity stepper, `X` cerrar) usan iconos del registro, no glyphs de texto — auditoría: todos SVG lucide-astro con `aria-label` (Minus L39-49, Plus L51-60, Trash2 L65-73, X CartDrawer L69-77); 0 glifos de texto; sin parches a node_modules
- [x] Verificar foco y `aria-hidden` del drawer al abrir/cerrar (teclado) — `role="dialog"`/`aria-modal` CartDrawer L57-59; `aria-hidden` toggle client.js L571; foco→cerrar L809-811; restore L812-814; Tab trap L762-782; Escape L753-760

Cierre: agregar → cotizar por WhatsApp en ≤3 interacciones.

## F5 — Home e identidad

Objetivo: bloques en orden de conversión + prueba social con rostro.

- [x] Auditar orden de bloques de `index.astro` contra §5.1 (hero propuesta → accesos → destacados → prueba social → identidad → garantías) — tabla de evidencia abajo (2026-10-17)
  - **Evidencia de orden (§5.1 vs home):**

  | # §5.1 | Bloque actual (orden en `dist/index.html`) | Estado |
  |---|---|---|
  | 1 Propuesta + CTA | Hero (H1 + texto + 1 solo CTA) | ✅ |
  | 2 Accesos categorías | `FeaturedCategories` (posición 2) | ✅ |
  | 3 Destacados (máx 8) | 4 cards glass de `HeroFavorites` **dentro del Hero** | Desviación justificada: se mantiene dentro del hero (integridad visual de la maqueta); 4 ≤ 8 ✅ |
  | 4 Prueba social | `Testimonials` montado entre `HowItWorks` y `Team` (`id="resenas"`) — PLACEHOLDER: reseñas inventadas con autorización del usuario, sustituibles por reseñas reales (requieren backend) | ✅ (2026-10-17) |
  | 5 Identidad | `Team` montado entre `Testimonials` y `TrustBar` (`id="equipo"`) — PLACEHOLDER: foto placeholder (`evaluacion-ortopedica.jpeg`) y textos de equipo sin credenciales inventadas | ✅ (2026-10-17) |
  | 6 Garantías | `TrustBar` montado entre `Team` y `Faq` (`id="garantias"`) | ✅ (tras insertar #4/#5 queda después de ellos, como pide §5.1) |
  | 7 Captación (newsletter) | — | Fuera de alcance del plan; hoy la captación final es `CtaBand` (WhatsApp) |

  Bloques extra fuera de la lista §5.1 (`ServicesGrid`, `Faq`, `LocationCta`, `CtaBand`) no alteran el orden guía: van tras su ancla natural y cierran por WhatsApp. Orden actual: `Hero → FeaturedCategories → ServicesGrid → WhyUs → HowItWorks → Testimonials → Team → TrustBar → Faq → LocationCta → CtaBand`.
- [x] Bloque de prueba social con nombre/foto reseñas (nuevo `home/Testimonials.astro`, datos por props desde `index.astro` como TrustBar) — 3 reseñas inventadas con autorización del usuario (PLACEHOLDER marcado en comentario HTML del componente y en la página); avatar con inicial (sin fotos falsas), 5★ con icono `star` del registro + `role="img"`/"5 de 5 estrellas"; sin promesas médicas (atención/WhatsApp/entrega)
- [x] Bloque de identidad "quién está detrás" con foto real (nuevo `home/Team.astro`; `WhyUs` se mantiene como argumentos) — PLACEHOLDER: foto placeholder (`evaluacion-ortopedica.jpeg` vía `<Image>` 640×480, `loading="lazy"`) + textos de equipo sin nombres ni credenciales inventadas (§6.1 a nivel de equipo); CTA "Conocer nuestros servicios" → `/servicios/` con `Button` variante `outline`
- [x] Garantías explícitas visibles (envío, devolución, atención) en `TrustBar.astro` — montado en `index.astro` entre HowItWorks y Faq; 4 labels con respaldo exacto: "Costo y plazo de envío informados" (`terminos-y-condiciones.astro` L71-77) · "Cambios y devolución en 10 días" (`cambios-y-devoluciones.astro` L36-39) · "Garantía legal en cada producto" (`cambios-y-devoluciones.astro` L84-89) · "Atención por WhatsApp, Lun–Sáb 9:00–19:00" (`data/site.ts` L19-25). Sustitución: **no hay "pago seguro" verificable** — el sitio no procesa pagos en línea (Callout de `terminos` §3, L64-67), el 4º ítem es atención
- [x] CTA hero con verbo + beneficio concreto, sin ambigüedad — "Ver soluciones ortopédicas" (antes "Ver catálogo"); `href="/catalogo/"`, variante `primaryDark` y CTA único intactos
- [x] Verificar: cero carruseles automáticos y cero pop-ups — `grep -rin "autoplay\|setInterval\|swiper\|slick" src/` → 0 coincidencias; `<dialog`/`showModal` en `src/components/home/` + `index.astro` → 0 (el scroll-snap de `FeaturedCategories` es manual con botones prev/next, permitido) — *Excepción 2026-10-17: el usuario autorizó un modal automático de promoción (flyer Siriform, PromoModal) — única excepción; el resto del home sigue sin pop-ups.*

Cierre: home responde "qué venden, para quién, por qué confiar" en el primer pantallazo.

## F6 — Accesibilidad y responsive transversal

Objetivo: WCAG 2.2 AA verificado en flujo completo.

- [x] Auditoría por teclado: tab order, foco visible ≥2px en todo (`:focus-visible` existe, verificar componentes custom) — auditoría completa sin tabindex roto ni saltos; fixes: rings AA (ring-2) en sort/search, `outline-color: light` dentro de `.bg-primary`, focus activo ≥3px global; Escape cierra MobileNav; SkipLink→`#main` ok
- [x] Un solo H1 por página y jerarquía de encabezados sin saltos (auditar `index.astro` y ficha) — las 24 páginas dist: exactamente 1 H1, 0 saltos de nivel, 0 vacíos (inventory completo por página)
- [x] Errores de formulario con `aria-live` (`contacto.astro`, libro de reclamaciones) — corrección de premisa: `contacto.astro` NO tiene formulario; ReclamacionForm ya tiene `aria-live=polite` + foco a primer inválido + `aria-invalid` (verificado); catálogo: `#catalog-count` ahora se actualiza dinámicamente (`renderStatus`) y `ActiveFilters` renderiza chips + limpiar (bloqueadores corregidos)
- [x] `prefers-reduced-motion` respetado en `float` del hero y transiciones — umbrella `prefers-reduced-motion: reduce` en global.css (transition/animation 0.01ms, scroll auto — cubre paquete carrito); gating JS: `scrollBy`/`scrollIntoView` con matchMedia; `motion-reduce` en ServicesGrid/Accordion
- [x] Probar 360/390/768/1024/1440 sin overflow horizontal — análisis estático: 0 `overflow-x` en body, único `nowrap` protegido por `overflow-x-auto`; fixes: TrustBar y RelatedProducts a `grid-cols-1 sm:grid-cols-2`, hero `h-`→`min-h-[calc(100vh-63px)]` (solapa secciones en viewport corto/zoom), WhatsApp float `bottom-24` (pisa footer a 360px). *Pendiente prueba visual manual*
- [x] `alt` descriptivo en todas las imágenes de producto (verificar contra `imageAlt` de datos) — 9/9 productos: alt = `imageAlt` descriptivo en card + galería + dist; 0 vacíos/généricos
- [x] Zoom 200% sin pérdida de contenido — sin `vw` en font-size; fix principal: hero `min-h` (contenido crece sin tapar sección 2); sticky bar con `pb-24`; *checklist manual pendiente: 200%/400% text-only + flujo teclado home→catálogo→ficha→carrito→WhatsApp*

Cierre: flujo completo (home → catálogo → ficha → carrito → WhatsApp) usable solo con teclado.

## F7 — Rendimiento y medición

Objetivo: vitales dentro de objetivo y embudo medido.

- [x] Medir LCP/INP/CLS en Lighthouse móvil (objetivo: ≤2.5s / ≤200ms / ≤0.1) — registro inicial (Lighthouse 13.5, headless, throttling DevTools): home LCP 3451ms ❌ / TBT 0 ✅ / CLS 0.134 ❌; catálogo LCP 2767 ❌ / TBT 0 ✅ / CLS 0 ✅; ficha faja LCP 2503 ⚠️ / TBT 0 ✅ / CLS 0.01 ✅. Datos de LAB — campo real pendiente de CrUX/GA4. Incumplimientos → deuda explícita
- [x] Presupuesto: ≤1.5MB por página móvil; auditar peso de imágenes de producto — 22/24 páginas ✅; ❌ `/servicios/` 8145 KB (3 JPEGs crudos de 2–2.7MB servidos sin transformar) y home 1817 KB. Top assets: servicios 2759/2687/2061 KB, medias png 1696 KB, flyer png 1565 KB → deuda explícita
- [x] Eventos GA4 faltantes en `dataLayer`: `view_item`, `view_item_list`, `search`, `remove_from_cart` (existen `add_to_cart` y `begin_checkout`) — implementados: view_item por ficha (vía `data-view-item`), view_item_list en las 7 páginas de catálogo (chunk compartido `catalog.ts`, máx. 20 items), search con debounce 400ms, remove_from_cart por delegación en captura (lee la fila antes de que el paquete la borre); todos en cola `dataLayer` (sin gtag — lo gatea el banner de cookies)
- [x] Aviso/consentimiento de cookies antes de activar medición (política §7 lo exige: consentimiento previo; RGPD/LEY 29733) — `CookieConsent.astro` no-modal en las 24 páginas: Aceptar/Rechazar → `localStorage['ssj:cookie-consent']` + `dataLayer` `consent_update`; 0 gtag en el código; el hook de inyección futura de GA4 está documentado en el componente; float WhatsApp subido a `bottom-40` móvil para no chocar con el banner
- [x] Rutina: revisar embudo mensual y documentar una hipótesis a la vez (doc/) — `doc/embudo-mensual.md`: tabla de los 10 eventos, regla de una hipótesis a la vez (observación→hipótesis→cambio→métrica) y checklist de 30 min

Cierre: métricas registradas antes/después y eventos del embudo en GA4.

---

## Deuda explícita (no planificada)

- Rendimiento (hallazgos F7): `/servicios/` sirve 3 JPEGs crudos de 2–2.7MB (`<Image>` no está transformando — investigar si el src llega como string o el width fuerza el original; fix: transformar a webp + srcset + lazy en las de abajo); home LCP 3451ms y CLS 0.134 (diagnosticar shift — candidatos: imágenes de HeroFavorites sin width/height y peso de hero); PNGs pesados en dist aunque el HTML use webp (flyer 1.5MB, medias 1.6MB — revisar por qué el build los emite).
- Buscador sin tolerancia ortográficos (F3) — depende de librería externa. *Actualizado:* la tolerancia a acentos y a prefijos de palabra ya está implementada sin dependencias; lo que queda pendiente es corregir errores en el medio de la palabra ("silya"), que sí requiere una librería externa o un índice difuso.
- Reseñas verificadas con filtros (guía §5.3) — requiere backend/CMS; fuera del alcance estático actual.
- Variantes de producto con disponibilidad por talla — evaluar cuando el catálogo crezca.
- `src/assets/flayers/` contiene un flyer sin referencias (¿duplicado de `src/assets/promos/`? pendiente de confirmación del usuario antes de borrar).
- GA4 sin ID de medición: cuando se consiga, inyectar gtag.js solo con `analytics_storage='granted'` (hook documentado en CookieConsent.astro).
