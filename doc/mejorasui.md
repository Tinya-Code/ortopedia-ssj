# Guía UI/UX para Ecommerce de Productos y Servicios

Documento de referencia para diseñar una tienda online que vende **productos físicos/digitales y servicios profesionales**, con foco en lectura cómoda, compra sin fricción y refuerzo de la identidad de la marca o del profesional.

---

## 1. Principios rectores

Cada decisión de diseño debe poder justificarse con uno de estos cinco principios. Si no encaja en ninguno, se descarta.

1. **Leer antes que decorar.** El texto es el vehículo de la venta; el diseño existe para que se lea sin esfuerzo.
2. **Una pantalla, una acción principal.** Cada vista tiene un único CTA dominante.
3. **Cero sorpresas.** Precio final, tiempos, costos de envío y políticas son visibles antes de pedir datos.
4. **La identidad vende.** Quién vende (marca o profesional) es tan importante como lo que vende.
5. **Menos pasos, menos campos.** Todo dato que no sea imprescindible para cobrar o entregar se elimina o se pide después.

---

## 2. Lectura y tipografía

### 2.1 Reglas de legibilidad

| Elemento | Especificación |
|---|---|
| Tamaño de texto base | 16 px mínimo (18 px en descripciones largas) |
| Interlineado | 1.5–1.7 en párrafos; 1.2–1.3 en títulos |
| Ancho de línea | 55–75 caracteres (≈ `max-width: 65ch`) |
| Párrafos | Máximo 4 líneas en móvil; separar con 1 línea de espacio |
| Alineación | Izquierda. Nunca justificado ni centrado en bloques de más de 2 líneas |
| Contraste | Texto normal ≥ 4.5:1; texto grande y componentes UI ≥ 3:1 (WCAG AA) |
| Peso | Regular (400) para cuerpo, Semibold (600) para énfasis; evitar pesos < 400 |
| Mayúsculas | Solo en etiquetas cortas (≤ 3 palabras); nunca en frases |

### 2.2 Jerarquía tipográfica (escala 1.25)

| Nivel | Uso | Desktop | Móvil |
|---|---|---|---|
| H1 | Nombre de producto/servicio, título de página | 36 px | 28 px |
| H2 | Secciones de una página | 28 px | 22 px |
| H3 | Subsecciones, títulos de tarjeta | 22 px | 18 px |
| Cuerpo | Descripciones | 16–18 px | 16 px |
| Auxiliar | Notas, legales, metadatos | 14 px | 14 px |

### 2.3 Estructura del contenido escrito

- **Pirámide invertida:** conclusión/beneficio primero, detalle después.
- **Títulos que informan**, no que adornan: "Corte de cabello con asesoría de imagen (60 min)" en lugar de "Tu mejor versión".
- **Viñetas** para listas de 3 o más ítems; **tablas** para comparar especificaciones.
- **Negritas** solo en 1–2 conceptos por párrafo.
- **Acordeones** para contenido secundario (políticas, ingredientes, FAQ), nunca para información que decide la compra (precio, duración, qué incluye).
- Fuentes: máximo 2 familias (una para títulos, una para cuerpo). Sans-serif de alta legibilidad en pantalla (Inter, Source Sans, Nunito Sans); una serif opcional solo en títulos si refuerza la marca.

---

## 3. Sistema visual

### 3.1 Color

Definir como tokens y no usar valores sueltos.

| Token | Función | Regla |
|---|---|---|
| `color-brand` | Color de marca | Logo, acentos, enlaces. Máx. 10 % de la superficie |
| `color-action` | CTA primario | Un solo color reservado exclusivamente para comprar/reservar |
| `color-action-secondary` | CTA secundario | Contorno o tono neutro |
| `color-success / warning / error` | Estados | Siempre acompañados de icono y texto, nunca solo color |
| `color-surface` / `color-bg` | Fondos | Neutros claros; el contenido respira sobre blanco o gris muy suave |
| `color-text` / `color-text-muted` | Texto | Muted solo para información no crítica |

Regla clave: **el color de acción no se usa para decorar**. Si todo es llamativo, nada lo es.

### 3.2 Espaciado y rejilla

- Base de 8 px (múltiplos: 8, 16, 24, 32, 48, 64).
- Contenedor máximo 1200 px; contenido de lectura larga a 720 px.
- Rejilla de 12 columnas en desktop, 4 en móvil, gutter 16–24 px.
- Más espacio entre secciones (48–64 px) que dentro de ellas (16–24 px).

### 3.3 Componentes base

- **Botones:** alto mínimo 48 px (área táctil ≥ 44×44 px); texto verbal ("Agregar al carrito", "Reservar cita"), no genérico ("Enviar", "OK").
- **Campos de formulario:** etiqueta visible arriba (no solo placeholder), alto 48 px, texto de ayuda debajo, error en línea con instrucción de corrección.
- **Tarjetas:** imagen, nombre, precio, una señal de valor (valoración, duración o disponibilidad) y un CTA. Nada más.
- **Insignias:** máximo 1 por tarjeta ("Nuevo", "Últimas 3 unidades", "Cupos esta semana").

### 3.4 Imágenes

- Producto: fondo limpio + al menos 1 imagen en contexto de uso + zoom. Proporción uniforme en todo el catálogo (ej. 4:5).
- Servicio: fotos reales del profesional, del espacio y del resultado; evitar bancos de imágenes genéricos.
- Formato WebP/AVIF, `loading="lazy"` bajo el pliegue, `alt` descriptivo en todas.
- Video corto (≤ 30 s) en ficha de producto o servicio cuando aclare el uso o el proceso.

---

## 4. Arquitectura de información y navegación

### 4.1 Estructura de primer nivel

Máximo **6 ítems** en el menú principal:

```
Tienda (productos) · Servicios · Sobre nosotros/Sobre mí · Blog/Recursos · Contacto
+ Buscar · Cuenta · Carrito (siempre visibles)
```

- Si la tienda vende solo productos o solo servicios, simplificar y quitar el ítem sobrante.
- Etiquetas con el lenguaje del cliente ("Cortes y color", no "Línea de servicios capilares").

### 4.2 Reglas de navegación

1. **Máximo 3 niveles** de profundidad hasta llegar al producto/servicio.
2. **Migas de pan** en todas las páginas internas.
3. **Buscador visible** en el encabezado (no un icono oculto en desktop), con autocompletado, tolerancia a errores ortográficos y sugerencias de categorías.
4. **Encabezado fijo (sticky) y compacto** al hacer scroll: logo, buscador, carrito.
5. **Carrito siempre accesible** con contador y mini-vista al agregar (drawer lateral, sin salir de la página).
6. **Pie de página** con: contacto, envíos y devoluciones, métodos de pago, políticas, redes. Sin duplicar el menú completo.
7. **Estado actual visible** en menú y filtros (qué página, qué filtros aplicados).

### 4.3 Navegación móvil

- Barra inferior fija con 4 accesos: Inicio · Buscar · Carrito · Cuenta.
- Menú tipo hamburguesa solo para categorías, con acordeón de 2 niveles.
- Zona del pulgar: acciones principales en el tercio inferior de la pantalla.

---

## 5. Páginas clave

### 5.1 Home

Orden de bloques (de arriba abajo):

1. **Propuesta de valor en una frase + CTA** (qué vendes, para quién, qué hace distinto).
2. **Accesos directos** a las 3–4 categorías o servicios más vendidos.
3. **Destacados** (máx. 8 productos/servicios) con criterio claro: más vendidos o recomendados.
4. **Prueba social:** reseñas reales con nombre y foto, logos de clientes o prensa.
5. **Bloque de identidad:** quién está detrás (ver sección 6).
6. **Garantías:** envío, devolución, pago seguro, atención.
7. **Captación** (newsletter) con beneficio concreto, no genérico.

Evitar: carruseles automáticos, pop-ups en los primeros 5 segundos, más de un mensaje principal.

### 5.2 Listado de productos / servicios

- **Filtros** a la izquierda (desktop) o en panel desplegable (móvil), con conteo de resultados por opción y botón "Limpiar filtros".
- **Ordenamiento:** relevancia, precio, más vendidos, novedades.
- Mostrar **cantidad de resultados** y filtros activos como etiquetas removibles.
- **Paginación o "Cargar más"** con botón (no scroll infinito, que rompe el pie de página y la orientación).
- Estado vacío con alternativas ("No hay resultados para X. Prueba con…").
- Vista de lista para servicios (permite leer duración, precio y descripción corta); vista de cuadrícula para productos.

### 5.3 Ficha de producto

Orden de lectura sugerido:

| Zona | Contenido |
|---|---|
| Izquierda | Galería (miniaturas + zoom + video) |
| Derecha, en orden | Nombre (H1) → valoración → precio (+ precio anterior y ahorro) → variantes (talla, color) → disponibilidad → **CTA "Agregar al carrito"** → envío estimado y devolución → vendedor/marca |
| Debajo | Descripción (beneficios primero, especificaciones en tabla) → reseñas → preguntas frecuentes → productos relacionados |

Buenas prácticas:

- Variantes con **selectores visuales** (muestras de color, botones de talla) y disponibilidad por variante.
- Guía de tallas o comparador cuando aplique.
- **CTA fijo en móvil** (barra inferior con precio + botón).
- Mostrar **costo y plazo de envío** sin pedir código postal para ver una estimación inicial.
- Reseñas con filtros (por valoración, con foto) y respuesta de la tienda.

### 5.4 Ficha de servicio

El servicio es intangible: la página debe reducir la incertidumbre.

| Bloque | Contenido obligatorio |
|---|---|
| Resumen | Nombre claro, **precio (o "desde"), duración, modalidad** (presencial/online/domicilio) |
| Para quién es | Problema que resuelve y perfil ideal, en 2–3 líneas |
| Qué incluye / qué no | Lista explícita de entregables |
| Cómo funciona | Proceso en 3–5 pasos numerados |
| Profesional | Foto, nombre, especialidad, años de experiencia, credenciales |
| Resultados | Casos reales, antes/después, testimonios con nombre |
| Políticas | Cancelación, reprogramación, requisitos previos |
| Reserva | **Calendario con disponibilidad real** + CTA "Reservar" |

Buenas prácticas:

- Agendamiento en la misma página o en máximo 2 pasos (fecha/hora → datos y pago).
- Confirmación inmediata por correo y mensaje (WhatsApp/SMS) con recordatorio previo.
- Paquetes o niveles de servicio comparados en tabla de 2–3 opciones, destacando la recomendada.
- Opción de **consulta previa** (llamada o mensaje) para servicios de alto valor, sin reemplazar el CTA de reserva.
- Pago completo, anticipo o pago en sitio: indicarlo antes de reservar.

### 5.5 Carrito

- Edición en línea (cantidad, eliminar, guardar para después) sin recargar.
- Resumen visible: subtotal, envío, impuestos, descuentos y **total final**.
- Campo de cupón colapsado por defecto (evita que el usuario salga a buscar códigos).
- Barra de progreso para envío gratis ("Te faltan S/ 40 para envío gratis").
- Productos y servicios pueden convivir en el mismo carrito; si el servicio requiere fecha, mostrarla y permitir cambiarla desde el carrito.
- CTA único y dominante: "Ir a pagar".

### 5.6 Checkout

Principios: **invitado por defecto, un solo flujo, mínima escritura.**

1. **Compra como invitado** primero; ofrecer crear cuenta *después* del pago con un clic.
2. **Una página de 3 secciones** (contacto → entrega → pago) o pasos con indicador de progreso (máx. 3).
3. **Solo campos necesarios.** Segundo apellido, empresa, fecha de nacimiento: fuera, salvo que sean obligatorios por ley.
4. **Autocompletado de dirección**, teclado correcto por campo (numérico, email), `autocomplete` HTML activado.
5. **Validación en línea** al salir del campo, con mensaje accionable ("El correo debe incluir @").
6. **Métodos de pago locales y wallets** (tarjeta, billeteras, transferencia, contra entrega si aplica), con el más usado primero.
7. **Resumen del pedido siempre visible** (columna lateral o colapsable en móvil) con total final.
8. **Sin distracciones:** quitar menú principal y banners; mantener logo, seguridad y ayuda.
9. **Señales de confianza** junto al botón de pago: sello de seguridad, política de devolución, contacto.
10. CTA con el monto: "Pagar S/ 249.00".

### 5.7 Post-compra

- Confirmación en pantalla y correo: resumen, número de pedido/reserva, plazo, próximos pasos.
- Seguimiento de pedido o recordatorio de cita, con enlace sin necesidad de login.
- Para servicios: instrucciones de preparación y forma de contacto con el profesional.
- Solicitud de reseña 3–7 días después de la entrega o 24 h después del servicio.
- Oferta de recompra o servicio complementario, contextual y no invasiva.

---

## 6. Identidad de la tienda o del profesional

La confianza es el principal freno de compra online. La identidad se construye con **personas, historia y coherencia visual**, no con eslóganes.

### 6.1 Elementos de identidad

| Elemento | Dónde aparece | Especificación |
|---|---|---|
| **Logo y paleta** | Encabezado, correos, documentos | Uso consistente; versión compacta para móvil |
| **Voz de marca** | Todo el texto | Definir 3 rasgos (ej. cercana, precisa, profesional) y un listado de palabras a usar/evitar |
| **Quién soy / quiénes somos** | Home (bloque corto) + página dedicada | Foto real, nombre, especialidad, historia en ≤ 150 palabras, credenciales verificables |
| **Propósito/diferenciador** | Home y fichas | Una frase concreta ("Pan de masa madre horneado cada mañana"), no abstracta |
| **Prueba social con rostro** | Home, fichas, checkout | Reseñas con nombre, foto y contexto; casos de estudio para servicios |
| **Certificaciones y respaldo** | Pie de página, fichas de servicio | Colegiaturas, sellos, premios, prensa, con enlace de verificación |

### 6.2 Aplicación por tipo de negocio

- **Marca de productos:** historia de origen, proceso de fabricación o selección, materiales, sostenibilidad; fotografía propia y consistente.
- **Profesional independiente:** el profesional es el producto. Foto de perfil nítida en cabecera de cada servicio, firma personal en comunicaciones, contenido que demuestre criterio (casos, artículos, videos cortos).
- **Híbrido (productos + servicios):** conectar ambos ("Producto recomendado para este tratamiento"; "Servicio que complementa tu compra") y mantener un mismo estilo visual en ambas secciones.

### 6.3 Coherencia

- Mismas fotos de equipo, tono y colores en web, correos, comprobantes y redes.
- Páginas de error 404, correos transaccionales y estados vacíos escritos con la voz de la marca.
- Un único nombre para cada oferta en toda la tienda (no cambiar "sesión" por "consulta" según la página).

---

## 7. Persuasión y confianza (sin manipular)

| Táctica | Uso correcto | Evitar |
|---|---|---|
| Escasez | Solo si es real ("Quedan 3 unidades", "2 cupos esta semana") | Temporizadores falsos |
| Prueba social | Reseñas verificadas, cantidad de compras reales | Reseñas inventadas o sin fecha |
| Garantía | Visible en ficha, carrito y checkout | Letra pequeña que la contradice |
| Descuentos | Precio anterior real y verificable | Precios inflados para simular rebaja |
| Urgencia | Fecha límite de envío para llegar a tiempo | Pop-ups que bloquean el contenido |
| Reducción de riesgo | Devolución simple, cancelación clara, atención visible | Obligar a llamar para devolver |

Reglas: **cada afirmación debe poder demostrarse**; si no, se elimina.

---

## 8. Microcopy (texto de interfaz)

- **Verbos de acción concretos:** "Agregar al carrito", "Reservar cita", "Pagar S/ 249.00".
- **Errores:** qué pasó + cómo corregirlo. "La tarjeta fue rechazada. Verifica el número o prueba otro método."
- **Estados vacíos:** explicar y ofrecer salida. "Tu carrito está vacío. Mira lo más vendido."
- **Confirmaciones:** claras y con siguiente paso.
- **Tono:** segunda persona (tú/usted, según marca), frases de ≤ 20 palabras, sin jerga técnica.
- **Precios:** moneda y formato local siempre explícitos; impuestos indicados como incluidos o no.

---

## 9. Responsive y rendimiento

### 9.1 Móvil primero

- Diseñar desde 360 px de ancho; probar en 360, 390, 768, 1024 y 1440.
- Áreas táctiles ≥ 44×44 px con 8 px de separación.
- Teclado adecuado por campo; evitar zoom involuntario con texto de campos ≥ 16 px.
- Pagos con wallets (Apple Pay, Google Pay, billeteras locales) para completar compra en 2 toques.

### 9.2 Rendimiento (objetivos medibles)

| Métrica | Objetivo |
|---|---|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |
| Peso de página (móvil) | ≤ 1.5 MB inicial |

Cada segundo extra de carga reduce la conversión: priorizar imágenes optimizadas, fuentes con `font-display: swap` y carga diferida.

---

## 10. Accesibilidad (WCAG 2.2 AA)

- Navegación completa por teclado con foco visible (contorno ≥ 2 px).
- Estructura semántica: un solo H1, jerarquía de encabezados ordenada, landmarks (`header`, `nav`, `main`, `footer`).
- Etiquetas asociadas a cada campo; errores anunciados con `aria-live`.
- No transmitir información solo con color.
- Texto alternativo en imágenes; subtítulos en videos.
- Respetar `prefers-reduced-motion`; sin animaciones que parpadeen.
- Zoom hasta 200 % sin pérdida de contenido ni scroll horizontal.
- Enlaces con texto descriptivo ("Ver política de devoluciones", no "Haz clic aquí").

---

## 11. Medición y mejora continua

### 11.1 Indicadores

| Área | Métrica | Qué revela |
|---|---|---|
| Adquisición | Tasa de rebote por página de entrada | Relevancia del mensaje |
| Navegación | % de uso del buscador, búsquedas sin resultados | Fallas de estructura o catálogo |
| Producto/servicio | Tasa de agregado al carrito / reserva iniciada | Claridad de la oferta |
| Carrito | Tasa de abandono de carrito | Costos sorpresa, confianza |
| Checkout | Abandono por paso, errores por campo | Fricción de formulario |
| Retención | Recompra, NPS, reseñas | Experiencia total |

### 11.2 Rutina de mejora

1. Revisar embudo completo cada mes y detectar el paso con mayor caída.
2. Formular una hipótesis por vez y probarla con A/B (mínimo 2 semanas o muestra suficiente).
3. Complementar datos con mapas de calor, grabaciones de sesión y 5 pruebas de usuario trimestrales.
4. Documentar cada cambio y su resultado.

---

## 12. Checklist de validación antes de publicar

**Lectura**
- [ ] Texto ≥ 16 px, interlineado ≥ 1.5, ancho de línea ≤ 75 caracteres
- [ ] Contraste AA en todo el texto y componentes
- [ ] Títulos informativos y párrafos de ≤ 4 líneas

**Navegación**
- [ ] Máximo 6 ítems en el menú y 3 niveles de profundidad
- [ ] Buscador visible con autocompletado
- [ ] Carrito accesible desde cualquier página

**Compra**
- [ ] Precio final y costos de envío visibles antes de los datos personales
- [ ] Compra como invitado disponible
- [ ] Checkout en ≤ 3 pasos, solo campos necesarios
- [ ] CTA principal único por pantalla
- [ ] Métodos de pago locales y wallets

**Productos**
- [ ] Galería con zoom, variantes visuales y disponibilidad por variante
- [ ] Reseñas verificadas con filtros

**Servicios**
- [ ] Precio, duración, modalidad y qué incluye en el primer pantallazo
- [ ] Profesional con foto, credenciales y casos reales
- [ ] Calendario con disponibilidad real y políticas de cancelación visibles

**Identidad y confianza**
- [ ] Bloque "Quién está detrás" con rostro e historia breve
- [ ] Voz de marca consistente en interfaz y correos
- [ ] Garantías y devolución visibles en ficha, carrito y checkout

**Técnico**
- [ ] LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms
- [ ] Probado en 360 px y navegación por teclado
- [ ] Eventos de analítica configurados en todo el embudo