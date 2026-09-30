# Especificación UI/UX: Centro Ortopédico SSJ

Documento **prescriptivo** para un agente (o persona) que debe aplicar el diseño de todo el sitio.
Complementa `estado-implementado.md` (que describe lo que **existe**). Aquí se define **cómo debe
verse y distribuirse**, qué componentes **nuevos** agregar y en qué orden implementarlos.

> Stack fijo: Astro 7 SSG + Tailwind v4 (`@theme` en `src/styles/global.css`). Sin frameworks JS,
> sin `astro:content`. Datos en `src/data/` (`db.ts`, `site.ts`), acceso vía `src/api/`. Todo href interno termina en `/`.

## Ruta rápida

1. §1 reglas no negociables → léelas antes de tocar nada.
2. §2 sistema de diseño (tokens, tipografía, espaciado, estados).
3. §3 shell global (header, footer, contenedores, bandas).
4. §4 componentes existentes: contrato visual. §5 componentes **nuevos**.
5. §6 wireframes por página ya integrando los componentes nuevos.
6. §7 orden de implementación · §8 checklist de aceptación.

---

## 1. Reglas no negociables

| # | Regla |
|---|---|
| 1 | **Mobile first**. Se diseña a 375px y se amplía con `sm:640 · md:768 · lg:1024`. |
| 2 | **Un solo `<h1>` por página**. Jerarquía h1 → h2 → h3 sin saltos. |
| 3 | **Tokens planos**: `text-primary`, `bg-secondary`, `bg-neutral/5`, `border-neutral/20`. No usar `blue-600`, `primary-500` ni hex sueltos (única excepción: `#25d366` en `WhatsAppButton`). |
| 4 | **`pages/` smart, `components/` dumb**: componentes reciben *slices* de props; nunca importan `api.js`. |
| 5 | **Cero JS de framework**. Interacción con HTML nativo (`<details>`, `:target`, `peer`, CSS) y como máximo un `<script>` inline pequeño por componente. |
| 6 | **Copy YMYL** (salud): español neutro peruano; prohibido "cura", "garantizado", "el mejor", testimonios médicos. Los componentes nuevos **no** deben incentivar promesas clínicas. |
| 7 | **Producto sin registro sanitario no se publica** (filtro de `api.js`). Ningún componente nuevo debe saltarse esto. |
| 8 | **CLS = 0**: toda imagen con `width`/`height` o `aspect-*`; el iframe de mapa con altura fija. |
| 9 | **`<Image>` recibe `ImageMetadata`**, nunca `image.src` (string). |
| 10 | **Accesibilidad AA**: contraste, foco visible, área táctil ≥ 44×44px, `aria-*` donde corresponda. |

---

## 2. Sistema de diseño

### 2.1 Color

Tokens actuales (no cambiar nombres):

| Token | Valor | Uso correcto |
|---|---|---|
| `--color-primary` | `#1d69f0` | CTA principal, enlaces, acentos de título |
| `--color-secondary` | `#21a7a5` | CTA secundario, detalles decorativos |
| `--color-accent` | `#f59e0b` | Solo decorativo (íconos, subrayados, badges con texto oscuro) |
| `--color-neutral` | `#6b7280` | Texto corrido, bordes (`/20`), fondos (`/5`) |

**Correcciones de contraste (aplicar):**

| Problema | Ratio aprox. | Solución |
|---|---|---|
| Texto blanco sobre `secondary` `#21a7a5` | ≈ 3.0 : 1 (falla AA en texto normal) | Oscurecer a `#178582` **o** usar texto `ink` sobre secondary. Preferido: cambiar el valor del token. |
| Texto `accent` `#f59e0b` sobre blanco (enlace Libro de Reclamaciones) | ≈ 2.1 : 1 (falla) | Agregar `--color-accent-text: #b45309` y usarlo en el texto del enlace; dejar `accent` para el ícono. |
| Texto `neutral` `#6b7280` sobre `bg-neutral/5` | ≈ 4.6 : 1 (justo) | Válido para 16px; no bajar de `text-base` ni usar en texto pequeño sobre gris. |

**Tokens nuevos a agregar en `@theme`:**

```css
@theme {
  --color-ink: #111827;          /* títulos y texto de máxima jerarquía */
  --color-accent-text: #b45309;  /* texto/enlaces ámbar accesibles */
  --color-success: #15803d;      /* "En stock" */
  --color-warning: #b45309;      /* "Por encargo" */
  --color-danger: #b91c1c;       /* "Agotado", errores de formulario */
  --radius-card: 0.75rem;        /* rounded-card → tarjetas */
  --shadow-card: 0 1px 2px rgb(0 0 0 / .06), 0 4px 12px rgb(0 0 0 / .05);
}
```

Reglas de uso: títulos `text-ink`; texto corrido `text-neutral`; **nunca** texto de cuerpo en `primary`.
Fondos alternos de banda: `bg-white` ↔ `bg-neutral/5`.

### 2.2 Tipografía (Inter 400 / 600)

| Rol | Clases | Notas |
|---|---|---|
| h1 home (hero) | `font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight` | 1 por página |
| h1 interior | `font-display text-3xl sm:text-4xl font-semibold text-ink` | |
| h2 sección | `font-display text-2xl sm:text-3xl font-semibold text-ink` | |
| h3 / título de tarjeta | `text-lg font-semibold text-ink` | |
| Lead / intro | `text-lg text-neutral max-w-prose` | |
| Cuerpo | `text-base text-neutral leading-relaxed max-w-prose` | 16px mínimo |
| Texto legal / nota | `text-sm text-neutral` | nunca menos de 14px |
| Precio | `text-2xl font-semibold text-ink` | prefijo `S/` |

Solo dos pesos (400, 600). No usar `font-bold` (no está cargado).

### 2.3 Espaciado y ritmo

| Elemento | Valor |
|---|---|
| Banda de sección (home) | `py-12 md:py-16` |
| Sección interna de página | `py-8` |
| Separación título → contenido | `mt-6` (h2) · `mt-4` (h1→lead) |
| Gap de grillas | `gap-4` móvil · `gap-6` desde `sm` |
| Padding tarjeta | `p-4` catálogo · `p-6` home |
| Padding horizontal contenedor | `px-4` (móvil) · `sm:px-6` |

### 2.4 Forma, sombras y estados

| Elemento | Especificación |
|---|---|
| Tarjeta | `rounded-card border border-neutral/20 bg-white shadow-card` |
| Tarjeta enlazada (hover) | `transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md` (respetar `motion-reduce:transition-none`) |
| Botón primario | `bg-primary text-white rounded-lg px-5 py-3 font-semibold hover:bg-primary/90` |
| Botón secundario | `bg-secondary text-white …` (con el token corregido) |
| Botón outline | `border border-primary text-primary hover:bg-primary/5` |
| Foco | global: `:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 2px; }` |
| Objetivo táctil | botones/enlaces de nav: `min-h-11` (44px) |
| Skip link | `<a href="#main" class="sr-only focus:not-sr-only …">Ir al contenido</a>` como primer hijo de `<body>` |

### 2.5 Imágenes

| Uso | Formato / tamaño | Carga |
|---|---|---|
| Hero | webp 600/1000/1600w, `aspect-[16/9]` | `eager` + `fetchpriority=high` |
| Tarjeta de categoría | webp 600×600, `aspect-square object-cover` | lazy |
| Tarjeta de producto | webp 400×400, `aspect-square object-contain bg-white` | los 4 primeros eager |
| Galería | principal 800×800, miniaturas 160×160 | principal eager |
| OG / JSON-LD | jpg 1200×630 / 1200w | build-time |

Fotos de producto: fondo blanco/neutro, `object-contain` (no recortar productos médicos).

---

## 3. Shell global (BaseLayout)

### 3.1 Contenedores

| Nombre | Clases | Páginas |
|---|---|---|
| Ancho | `mx-auto w-full max-w-6xl px-4 sm:px-6` | home, catálogo, categoría, producto, contacto |
| Estrecho | `mx-auto w-full max-w-3xl px-4 sm:px-6` | legales, libro, 404 |
| Texto | `max-w-prose` dentro de cualquiera | párrafos largos |

Crear helper `components/ui/Container.astro` (`size?: 'wide'|'narrow'`) para no repetir clases.

### 3.2 Estructura de la página

```
<body class="flex min-h-screen flex-col bg-white text-neutral">
  SkipLink
  Header                       ← sticky top-0 z-40, bg-white/95 backdrop-blur, border-b
  <main id="main" class="flex-1">…</main>
  Footer
  <slot name="cta"/>           ← reservado para CTAs de campaña
  WhatsAppButton floating      ← fixed bottom-4 right-4 z-50
  StickyProductBar (solo producto, móvil)  ← §5.9
```

### 3.3 Header (mejorar)

| Breakpoint | Comportamiento |
|---|---|
| `< md` | Marca a la izquierda · botón hamburguesa (44×44) a la derecha · panel desplegable a ancho completo con los 4 enlaces + Libro de Reclamaciones. Implementar con `<details>`/`<summary>` (sin JS) o `peer` de Tailwind. |
| `≥ md` | Marca · nav horizontal (4 enlaces) · `ReclamacionesLink` a la derecha. |

- `aria-current="page"` activo con `text-primary font-semibold` + subrayado `border-b-2 border-primary`.
- Header **sticky**; altura fija `h-16` para calcular `scroll-padding-top: 4rem` en `html`.
- Enlace "Servicios" → `/#servicios`.
- Añadir botón CTA compacto "WhatsApp" en desktop (variant primary, `data-event="whatsapp_click"`).

### 3.4 Footer

Mantener 2 columnas `sm:grid-cols-2` (NAP + horario + nav | `LegalFooter`). Cambios:
- Fondo `bg-neutral/5`, `border-t`, `py-10`.
- Enlaces con `min-h-11 inline-flex items-center` en móvil.
- Añadir fila inferior con `©` y el aviso IGV (ya existe en `LegalFooter`); no duplicar.

### 3.5 Bandas de la home

Alternancia obligatoria: blanco → gris → blanco → gris → blanco → gris (ver §6.1). Cada banda:
`<section class="py-12 md:py-16 [bg-neutral/5]"><Container>…</Container></section>`.

---

## 4. Componentes existentes: contrato visual

Solo se listan **ajustes de UI**; las props no cambian salvo donde se indica.

| Componente | Ajuste |
|---|---|
| `Hero` | Añadir uso del `<slot/>` (hoy vacío) para los CTAs: botón primario "Consultar por WhatsApp" + botón outline "Ver catálogo". Móvil: imagen **debajo** del texto, `rounded-card`. |
| `ServicesGrid` | Tarjeta con icono SVG inline arriba (`size-10 text-primary`), título h3, texto, enlace "Consultar →". |
| `FeaturedCategories` | Tarjeta cuadrada con overlay inferior (gradiente `from-ink/70`) con el nombre; o imagen arriba y texto abajo (mantener actual si se prefiere). Consistente con `CategoryCard`. |
| `WhyUs` | Cada tarjeta: icono (secondary) + h3 + 1–2 líneas. Grid `sm:grid-cols-2 lg:grid-cols-4`. |
| `Faq` | Migrar de `<dl>` plano a **acordeón `<details>`** (§5.6). El JSON-LD se sigue armando en la página. |
| `LocationCta` | Móvil: botón WhatsApp y botón "Cómo llegar" (enlace a Google Maps) **antes** del mapa. |
| `ProductCard` | Badge de disponibilidad (§5.4) en esquina superior de la imagen; precio con `PriceTag` (§5.5). |
| `ProductInfo` | Orden: h1 → `AvailabilityBadge` → `PriceTag` → aviso IGV → bloque de confianza corto → botón WhatsApp a ancho completo en móvil. |
| `ProductSpecs` | Filas cebra (`odd:bg-neutral/5`), clave `font-semibold text-ink`. |
| `RelatedProducts` | Se mantiene como enlaces simples (no h2 en tarjetas); añadir precio alineado a la derecha. |
| `Breadcrumbs` | Texto `text-sm`; en móvil `overflow-x-auto whitespace-nowrap`. |
| `ReclamacionForm` | Inputs `min-h-11 rounded-lg border-neutral/30 focus:border-primary`; etiquetas siempre visibles (no placeholder-as-label); errores en `text-danger` con `aria-describedby`. |
| `ui/Button` | **Dejar de ser código muerto**: usarlo en Hero, CtaBand, 404 y páginas de categoría; `WhatsAppButton` puede envolverlo. |

---

## 5. Componentes nuevos

Prioridad: **P1** = implementar primero (alto impacto/bajo riesgo) · **P2** = después · **P3** = opcional.
Todos en Astro puro, tipados con `interface Props`.

### 5.1 `ui/Container.astro` — P1
`props: size?: 'wide'|'narrow' = 'wide'` · aplica clases de §3.1 · `<slot/>`.

### 5.2 `ui/PageHeader.astro` — P1
Cabecera común de páginas interiores.
`props: title: string, lead?: string` · renderiza `<h1>` + lead (`max-w-prose`) con `pt-8 pb-6`.
Usado en catálogo, categoría, contacto, legales, libro, 404 (evita duplicar clases).

### 5.3 `ui/Callout.astro` — P1
Aviso destacado (plazo de reclamos, IGV, aviso médico).
`props: tone?: 'info'|'warning'|'legal' = 'info', title?: string` · `<slot/>`.
Estilo: `rounded-card border-l-4 p-4` (`info` = primary, `warning` = warning, `legal` = neutral) con `role="note"`.
Usos: libro de reclamaciones (aviso 15 días), `ProductLegal`, cambios y devoluciones.

### 5.4 `product/AvailabilityBadge.astro` — P1
`props: availability: 'InStock'|'PreOrder'|'OutOfStock'`.

| Valor | Texto | Estilo |
|---|---|---|
| `InStock` | En stock | `bg-success/10 text-success` |
| `PreOrder` | Por encargo | `bg-warning/10 text-warning` |
| `OutOfStock` | Agotado | `bg-danger/10 text-danger` |

Pastilla `rounded-full px-3 py-1 text-sm font-semibold` con punto de color (no depender solo del color: incluye texto).

### 5.5 `ui/PriceTag.astro` — P1
`props: price?: number, size?: 'md'|'lg' = 'md', includesIGV?: boolean`.
Con precio → `S/ 120.00` (`toFixed(2)`) + microtexto "Incluye IGV" si aplica. Sin precio → "Consultar precio". Centraliza el formato hoy duplicado en `ProductCard` y `ProductInfo`.

### 5.6 `ui/Accordion.astro` — P1
`props: items: {q: string, a: string}[]` · usa `<details><summary>` nativo, `summary` con chevron CSS que rota con `group-open:rotate-180`, `min-h-11`. Sin JS. `Faq.astro` lo envuelve. Reutilizable en fichas de producto con `faq`.

### 5.7 `home/HowItWorks.astro` — P2
Pasos de compra por WhatsApp (encaja con el modelo del sitio).
`props: steps: {title, text}[]` (3–4 pasos: 1 Consulta · 2 Asesoría · 3 Confirmación y comprobante · 4 Entrega/recojo).
Layout: `<ol>` grid `md:grid-cols-4`; número en círculo `bg-primary text-white`; conector horizontal en `md`. Datos definidos **en la página**.
Ubicación en home: entre `WhyUs` y `Faq`.

### 5.8 `home/TrustBar.astro` — P2
Franja compacta bajo el hero con 3–4 hechos **verificables** (ej. "Registro sanitario visible en cada ficha", "Boleta o factura", "Atención por WhatsApp", horario).
`props: items: {icon: string, label: string}[]` · `grid grid-cols-2 md:grid-cols-4`, `text-sm`.
Prohibido: cifras de clientes, "años de experiencia" sin dato real, testimonios.

### 5.9 `product/StickyProductBar.astro` — P2
Barra fija inferior **solo móvil** en ficha de producto.
`props: name, price?, whatsappMessage` · `fixed inset-x-0 bottom-0 z-40 md:hidden`, muestra nombre corto + `PriceTag` + botón WhatsApp (`whatsapp_product`).
Regla: al estar presente, **ocultar el WhatsApp flotante global** en esa página (`variant` flotante recibe `hidden md:flex`) para no superponer; añadir `pb-24 md:pb-0` al `<main>` de la ficha.

### 5.10 `ui/CtaBand.astro` — P2
Banda final reutilizable (usa `<slot name="cta"/>` de BaseLayout o se coloca en la página).
`props: title, text?, message` · fondo `bg-primary text-white` (o `bg-ink`), h2 + `WhatsAppButton` variante blanca.
Usos: fin de home (antes del footer), fin de categoría, fin de contacto.

### 5.11 `catalog/CategoryChips.astro` — P2
Navegación entre categorías dentro de una página de categoría.
`props: categories: {slug,name}[], activeSlug?: string` · chips `flex flex-wrap gap-2` con `aria-current` en la activa. Reutiliza el estilo de chips del 404 (consolidar).
Ubicación: bajo el `PageHeader` de `/catalogo/[category]/`.

### 5.12 `product/RegistroBadge.astro` — P3
Sello pequeño "Registro sanitario {N} · Clase {II}" junto al precio (visible sin bajar al `ProductLegal`).
`props: registroSanitario: string, claseRiesgo?: string`. Refuerza confianza sin promesas clínicas.

### 5.13 `layout/MobileNav.astro` — P1 (parte del Header §3.3)
Extraer el menú móvil como componente: `props: links: {label, href}[], currentPath: string`. Basado en `<details>`.

### Componentes descartados (no agregar)
- **Testimonios / reseñas**: riesgo YMYL, sin datos reales.
- **Carrito / checkout**: el sitio no vende en línea (todo va por WhatsApp).
- **Buscador / filtros JS**: 6 productos no lo justifican; `CategoryChips` basta.
- **Carrusel / slider**: peor rendimiento y accesibilidad que una grilla.

---

## 6. Distribución por página (con componentes nuevos)

Leyenda: `⟦Nuevo⟧` = componente de §5. Fondo entre corchetes.

### 6.1 `/` Home

```
[Header sticky · marca · nav · CTA WhatsApp (md+) · libro]
[HERO      blanco · md:2col  texto+CTAs (Button ×2)  |  imagen 16:9 ]
[⟦TrustBar⟧ blanco, borde arriba/abajo · grid 2 → 4 items          ]
[SERVICIOS  gris   · #servicios · grid sm:2 lg:3 · tarjetas con icono ]
[CATEGORÍAS blanco · grid sm:2 lg:3 · tarjetas con imagen            ]
[POR QUÉ ELEGIRNOS gris · grid sm:2 lg:4 · icono + h3 + texto        ]
[⟦HowItWorks⟧ blanco · ol md:4col                                    ]
[FAQ        gris   · max-w-3xl · ⟦Accordion⟧                          ]
[UBICACIÓN  blanco · #ubicacion · md:2col NAP+CTA | mapa              ]
[⟦CtaBand⟧  primary · h2 + botón WhatsApp                             ]
[Footer]
```
Alternancia de fondos: blanco (hero+trust) → gris → blanco → gris → blanco (how) → gris (faq) → blanco (ubicación) → primary (cta).

### 6.2 `/catalogo/`

```
Breadcrumbs
⟦PageHeader⟧ h1 "Catálogo" + lead
grid categorías (CategoryCard) sm:2 lg:3
⟦CtaBand⟧ "¿No encuentras lo que buscas?" (mensaje general)
```

### 6.3 `/catalogo/[category]/`

```
Breadcrumbs
⟦PageHeader⟧ h1 {cat.name} + lead corto
⟦CategoryChips⟧ (categoría activa marcada)
Intro ~150 palabras (max-w-prose, columna izquierda; en lg puede ir 2/3 de ancho)
ProductGrid (sm:2 lg:3) — ProductCard con AvailabilityBadge + PriceTag
⟦CtaBand⟧ CTA de asesoría (categoryWhatsappMessage)
```
Categoría vacía: `Callout tone="info"` con mensaje + botón WhatsApp.

### 6.4 `/producto/[slug]/`

```
Breadcrumbs
[ md:2col ]
  Izq: ProductGallery (principal 800 + miniaturas; en móvil miniaturas en fila con scroll-x)
  Der: h1 · ⟦AvailabilityBadge⟧ · ⟦PriceTag lg⟧ · aviso IGV · ⟦RegistroBadge⟧
       · WhatsAppButton (ancho completo móvil, whatsapp_product)
Descripción     h2 + párrafo (max-w-prose)
ProductSpecs    (cebra)
⟦Accordion⟧     FAQ del producto (si tiene faq)
RelatedProducts (sm:2col)
ProductLegal    → ⟦Callout tone="legal"⟧ para el aviso médico
⟦StickyProductBar⟧ (solo móvil)
```
En desktop la columna derecha puede ser `md:sticky md:top-24` para acompañar el scroll de la galería.

### 6.5 `/contacto/`

```
Breadcrumbs
⟦PageHeader⟧ h1 + lead (resolver el TODO del punto de referencia)
LocationCta (md:2col NAP+botones | mapa)
Tarjetas de canales (grid sm:3): WhatsApp · Teléfono · Correo   ← reutiliza estilo de tarjeta
⟦CtaBand⟧ opcional (no repetir si ya hay botón WhatsApp visible: elegir uno)
```

### 6.6 `/libro-de-reclamaciones/`

```
Container narrow
⟦PageHeader⟧ h1
Proveedor (bloque de datos, dl)
⟦Callout tone="warning"⟧ plazo de respuesta + conservación 2 años
[Aviso oficial INDECOPI — pendiente]
ReclamacionForm (3 fieldsets numerados; éxito reemplaza campos)
Enlace WhatsApp
```

### 6.7 Legales (términos · privacidad · cambios y devoluciones)

```
Container narrow
⟦PageHeader⟧ h1 + fecha "Última actualización" (text-sm)
Índice interno (ol de anclas a los h2)   ← nuevo, sin JS, solo si >6 secciones
Secciones numeradas (h2 con id, mt-8)
⟦Callout tone="legal"⟧ para notas [VALIDAR] visibles solo en dev, o para avisos clave
```
Añadir `scroll-mt-20` a cada h2 con `id` (compensa el header sticky). Estilo prosa: `prose`-like manual (`space-y-4`, listas con `list-disc pl-6`).

### 6.8 `404`

```
Container narrow · py-16 · PageHeader h1 "Página no encontrada"
Párrafo · CategoryChips (sin activa) · Button primary "Volver al inicio" · Button outline "Escribir por WhatsApp"
```
`noindex` se mantiene.

---

## 7. Orden de implementación

1. **Tokens** (§2.1): `ink`, `accent-text`, `success/warning/danger`, `radius-card`, `shadow-card`; corregir `secondary`. Foco global + `scroll-padding-top`.
2. **Base UI**: `Container`, `PageHeader`, `Callout`, `PriceTag`, `AvailabilityBadge`, `Accordion`. Refactorizar páginas existentes para usarlos.
3. **Shell**: `SkipLink`, Header sticky + `MobileNav`, Footer ajustado.
4. **Producto**: `ProductInfo` reordenado, `ProductSpecs` cebra, `ProductLegal` con `Callout`.
5. **Home**: `Hero` con slot/CTAs (activa `Button`), `TrustBar`, `WhyUs` con iconos, `Faq` → acordeón, `HowItWorks`, `CtaBand`.
6. **Categoría/catálogo**: `CategoryChips`, `CtaBand`.
7. **Producto móvil**: `StickyProductBar` + ajuste del flotante.
8. **Legales/libro/contacto/404** con `PageHeader` y `Callout`.
9. **P3**: `RegistroBadge`.
10. Actualizar `estado-implementado.md` (§1 árbol, §2.2 tabla de componentes, §3 páginas) y correr verificación.

---

## 8. Checklist de aceptación

**Comandos**
```bash
pnpm build && pnpm check                       # 17 HTML, 0 errores de tipos
for f in $(find dist -name '*.html'); do echo "$f $(grep -o '<h1' $f | wc -l)"; done   # 1 cada uno
grep -rn "blue-\|primary-[0-9]" src            # sin resultados (tokens planos)
grep -rn "#[0-9a-fA-F]\{6\}" src/components    # solo #25d366 en WhatsAppButton
```

**Visual / UX**
- [ ] Sin scroll horizontal a 320, 375, 768, 1024 y 1440px.
- [ ] Header sticky no tapa los `h2` al saltar por ancla (`scroll-padding-top`).
- [ ] Menú móvil abre/cierra con teclado (Enter/Espacio/Esc si se añade script) y con `aria-expanded`.
- [ ] Ficha de producto móvil: `StickyProductBar` visible y **sin** botón flotante superpuesto.
- [ ] Footer pegado al piso en páginas cortas (404, libro).

**Accesibilidad**
- [ ] Contraste ≥ 4.5:1 en texto normal (verificar `secondary` y `accent-text`).
- [ ] Foco visible en todos los enlaces, botones, `summary` e inputs.
- [ ] Áreas táctiles ≥ 44px; skip link funcional.
- [ ] Estados de stock comunicados con texto, no solo color.
- [ ] Formulario: cada input con `<label>`, errores anunciados (`aria-live="polite"` en `data-status`).

**Contenido / cumplimiento**
- [ ] Ningún componente nuevo contiene testimonios ni afirmaciones clínicas.
- [ ] Precios siempre `S/ X.XX` vía `PriceTag`; aviso de IGV presente en ficha y footer.
- [ ] Todo href interno termina en `/`; anclas como `/#servicios`.
- [ ] Sin código muerto: `ui/Button` usado; `slot name="cta"` usado o eliminado.
- [ ] `estado-implementado.md` actualizado (§9 del mismo).

**Rendimiento**
- [ ] LCP: hero (home) y galería principal (producto) con `eager` + `fetchpriority=high`; el resto lazy.
- [ ] CLS ≈ 0 (imágenes con dimensiones, mapa con `h-80`).
- [ ] Sin JS nuevo salvo los dos `<script>` existentes y, como máximo, uno ≤ 1 KB para el menú móvil si `<details>` no basta.