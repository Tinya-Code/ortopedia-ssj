# Rutina mensual del embudo GA4

Revisión de 30 minutos, una vez al mes, para seguir el embudo **home → catálogo → ficha → carrito → WhatsApp**, registrar el histórico y decidir **una sola** hipótesis por ciclo. Complementa la fase F7 del [plan de mejora UI/UX](plan-mejora-ui.md).

## Cuándo

| Qué | Decisión |
| --- | --- |
| Frecuencia | Mensual, siempre la misma fecha |
| Día sugerido | Primer martes hábil del mes |
| Duración | 30 min (10 para datos, 15 para hipótesis, 5 para acuerdos) |
| Quién | Una persona pasa los datos; el resto revisa |

## Métricas a registrar

Los 10 eventos del embudo. Objetivo = meta del mes; hasta no tener histórico, queda en **definir** (sin benchmarks inventados). Historial = celda a rellenar cada mes.

| Evento GA4 | Cuándo se dispara | Objetivo | Historial (mes) |
| --- | --- | --- | --- |
| `view_item_list` (nuevo en F7) | Al abrir catálogo o categoría, con la lista de productos renderizada | definir | |
| `search` (nuevo en F7) | Búsqueda en el catálogo (consulta no vacía, sin repetir la anterior) | definir | |
| `view_item` (nuevo en F7) | Al abrir la ficha de un producto | definir | |
| `add_to_cart` | Al añadir un producto al carrito | definir | |
| `remove_from_cart` (nuevo en F7) | Al quitar una línea del carrito | definir | |
| `begin_checkout` | Al pulsar "cerrar pedido por WhatsApp" con el carrito listo | definir | |
| `promo_view` | Al mostrarse el diálogo de promoción | definir | |
| `promo_cta_click` | Al pulsar el CTA del diálogo de promoción | definir | |
| `whatsapp_click` | CTA de WhatsApp general (home, contacto, footer…) | definir | |
| `whatsapp_product` | CTA de WhatsApp de producto (tarjeta, ficha, barra fija) | definir | |

Dos notas de contexto:

- **Consentimiento**: desde que se active GA4 solo se mide a quien aceptó el banner (evento `consent_update`). Interpreta cada cifra sobre esa muestra.
- **Vitales (F7)**, fuera del embudo pero misma rutina: LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 (Lighthouse móvil).

## Regla de hipótesis: una a la vez

Formato de toda hipótesis: **observación → hipótesis → cambio → métrica que decide**. Si el mes no cambia la métrica que decidiste, la hipótesis falla: se descarta o se reformula. Nunca dos cambios a la vez (no sabrías cuál sirvió).

| Observación | Hipótesis | Cambio | Métrica que decide |
| --- | --- | --- | --- |
| Ejemplo: muchas `view_item` pero pocas `add_to_cart` | ¿El CTA "Agregar" no se ve bien en la ficha? | Destacar el CTA de agregar al carrito en la ficha | Relación `add_to_cart` / `view_item` del mes siguiente |
| | | | |

## Checklist de la reunión

- [ ] Abrir GA4 y anotar los 10 eventos del mes en la tabla de métricas
- [ ] Calcular las relaciones del embudo (p. ej. `add_to_cart`/`view_item`, `begin_checkout`/`add_to_cart`)
- [ ] Registrar los vitales del mes (Lighthouse móvil vs. objetivos de F7)
- [ ] Revisar el % de consentimiento concedido (`consent_update`) para interpretar la muestra
- [ ] Elegir UNA hipótesis y llenar su fila en el template
- [ ] Fijar la fecha de la próxima revisión (mismo día hábil del mes siguiente)

## Enlaces

- Plan: [`doc/plan-mejora-ui.md`](plan-mejora-ui.md) → F7 — Rendimiento y medición
- Consentimiento: [Política de privacidad §7](/politica-de-privacidad/#cookies-y-analitica)
