8. Requisitos legales de la página web (INDECOPI, datos personales y publicidad)
8.1 Información obligatoria y de confianza (visible en footer y páginas legales)
Razón social y RUC
Domicilio fiscal y de atención
Teléfono, correo y horario
Enlace al Libro de Reclamaciones virtual (visible en todas las páginas)
Términos y condiciones de compra
Política de privacidad y protección de datos
Política de cambios, devoluciones y garantías
Formas de pago, plazos y costos de envío
Emisión de comprobante electrónico (aviso claro)
Precios en soles, con IGV incluido cuando se muestren
8.2 Libro de Reclamaciones virtual
Obligatorio para comercio electrónico (Ley N.° 32495). Enlace visible y permanente en la web.
Debes responder en un plazo máximo de 15 días hábiles [VALIDAR con el reglamento vigente: hay un proyecto de modificación publicado en julio de 2026].
Guarda las hojas de reclamación al menos 2 años y entrega copia al consumidor.
INDECOPI ofrece la herramienta gratuita "Tu Libro de Reclamaciones" para generar la hoja oficial y el aviso.
Multas de hasta 50 UIT (S/ 275,000 con la UIT 2026) por no tenerlo, no exhibir el aviso/enlace o no atender reclamos.
8.3 Precios y publicidad
Precio total y claro: no muestres "precio sin IGV" como si fuera el final.
Si dices "Consultar precio" para cotizar por WhatsApp, deja claro en la ficha que el precio final incluye IGV y demás cargos.
Ofertas: indica vigencia, condiciones y stock. No inventes "precio antes/ahora".
Publicidad de salud: no prometas curas ni resultados garantizados. Usa lenguaje como "brinda soporte" o "ayuda a estabilizar". No anuncies usos no autorizados en el registro sanitario. Evita testimonios que prometan resultados médicos.
Imágenes y marcas: usa fotos con derechos y marcas con autorización del titular.
8.4 Datos personales (Ley N.° 29733 y su reglamento)
Formularios, WhatsApp, cookies y analítica recogen datos personales. Si además recopilas información sobre condiciones o lesiones, son datos sensibles (salud): requieren consentimiento expreso e informado.
Tu política de privacidad debe indicar: titular del banco de datos, finalidad, plazo de conservación, encargados/terceros, derechos ARCO y cómo ejercerlos.
Evalúa la inscripción del banco de datos ante la Autoridad Nacional de Protección de Datos Personales [VALIDAR obligaciones vigentes].
Si usas analítica o píxeles publicitarios, agrega aviso de cookies con consentimiento.
No pidas por WhatsApp más datos de salud de los necesarios para cotizar.
8.5 Devoluciones, cambios y garantías
Publica una política clara: plazos, estado del producto, quién asume el flete y cómo se gestiona.
Por higiene y seguridad, ciertos productos (por ejemplo, de contacto directo con la piel) pueden tener condiciones especiales, siempre que lo informes con claridad antes de la compra y sea razonable.
Toda devolución con reembolso implica nota de crédito.
Revisa con tu abogado el alcance de la garantía legal y los derechos del consumidor en compras a distancia [VALIDAR].
9. Implementación en Astro (continuación de la guía anterior)
9.1 Nuevos componentes y páginas
src/
├─ components/
│  └─ legal/
│     ├─ LegalFooter.astro           # razón social, RUC, dirección, enlaces legales
│     ├─ ReclamacionesLink.astro     # enlace visible al libro de reclamaciones
│     ├─ ProductLegal.astro          # registro sanitario, aviso de IGV, aviso médico
│     ├─ CookieNotice.astro          # solo si usas analítica/píxeles
│     └─ ReclamacionForm.astro       # hoja de reclamación virtual
├─ pages/
│  ├─ terminos-y-condiciones.astro
│  ├─ politica-de-privacidad.astro
│  ├─ cambios-y-devoluciones.astro
│  ├─ libro-de-reclamaciones.astro
│  └─ comprobantes-y-envios.astro    # cómo se emite el comprobante, tiempos y costos
9.2 Datos legales en src/data/site.ts
ts
export const LEGAL = {
  legalName: 'RAZÓN SOCIAL DEL NEGOCIO S.A.C.',
  tradeName: 'Centro Ortopédico Tu Marca',
  ruc: '00000000000',
  fiscalAddress: 'Av. Ejemplo 123, Distrito, Ciudad, Perú',
  email: 'contacto@tudominio.com',
  phone: '+51 000 000 000',
  reclamosEmail: 'reclamos@tudominio.com',
  reclamosResponseDays: 15, // días hábiles [VALIDAR reglamento vigente]
  pricesIncludeIGV: true,
  currency: 'PEN',
} as const;
9.3 LegalFooter.astro
astro
---
import { LEGAL } from '../../data/site';
import ReclamacionesLink from './ReclamacionesLink.astro';
const year = new Date().getFullYear();
---
<footer class="legal-footer">
  <p>
    <strong>{LEGAL.legalName}</strong> · RUC {LEGAL.ruc}<br />
    {LEGAL.fiscalAddress}<br />
    <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> · {LEGAL.phone}
  </p>

  <nav aria-label="Información legal">
    <a href="/terminos-y-condiciones/">Términos y condiciones</a>
    <a href="/politica-de-privacidad/">Política de privacidad</a>
    <a href="/cambios-y-devoluciones/">Cambios y devoluciones</a>
    <a href="/comprobantes-y-envios/">Comprobantes y envíos</a>
    <ReclamacionesLink />
  </nav>

  <p class="legal-note">
    Todos los precios están expresados en soles e incluyen IGV. Emitimos comprobante de pago
    electrónico en todas nuestras ventas. © {year} {LEGAL.tradeName}.
  </p>
</footer>
9.4 ReclamacionesLink.astro
astro
---
// Enlace visible en TODAS las páginas (va en el footer y también puedes repetirlo en el header)
---
<a href="/libro-de-reclamaciones/" class="reclamaciones-link" aria-label="Libro de Reclamaciones">
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 3h13a3 3 0 0 1 3 3v15l-3-2-3 2-3-2-3 2-3-2V3Zm3 5v2h10V8H7Zm0 4v2h7v-2H7Z"/>
  </svg>
  <span>Libro de Reclamaciones</span>
</a>

Conviene que el enlace lleve el ícono y el texto "Libro de Reclamaciones" de forma reconocible. Puedes descargar el aviso oficial con la herramienta gratuita de INDECOPI.

9.5 ProductLegal.astro (en cada ficha de producto)
astro
---
interface Props {
  registroSanitario?: string;
  claseRiesgo?: string;
  titularRegistro?: string;
  priceIncludesIGV?: boolean;
}
const { registroSanitario, claseRiesgo, titularRegistro, priceIncludesIGV = true } = Astro.props;
---
<aside class="product-legal" aria-label="Información legal y sanitaria del producto">
  <ul>
    {registroSanitario && (
      <li><strong>Registro sanitario:</strong> {registroSanitario}
        {claseRiesgo && <> · Clase {claseRiesgo}</>}
        {titularRegistro && <> · Titular: {titularRegistro}</>}
      </li>
    )}
    {priceIncludesIGV && <li>Precio en soles, incluye IGV. Emitimos boleta o factura electrónica.</li>}
    <li>Producto de uso ortopédico. Lea las instrucciones y consulte a un profesional de la salud antes de usarlo.</li>
  </ul>
</aside>
9.6 Extender el schema de contenido (src/content/config.ts)
ts
const products = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // ...campos existentes...
    registroSanitario: z.string().optional(),      // ej. "DM1234E" [datos reales]
    claseRiesgo: z.enum(['I', 'II', 'III', 'IV']).optional(),
    titularRegistro: z.string().optional(),
    condition: z.enum(['new', 'refurbished', 'used']).default('new'),
  }),
});

Regla editorial: si un producto no tiene registroSanitario verificado, no se publica (puedes filtrar en getStaticPaths con draft, o añadir una validación en el build).

Validación opcional en getStaticPaths de producto/[slug].astro:

ts
const products = (await getCollection('products'))
  .filter((p) => p.data.registroSanitario); // no publicar sin registro sanitario verificado
9.7 Datos de empresa en JSON-LD

En organizationSchema() de src/lib/schema.ts:

ts
import { LEGAL } from './site';

export const organizationSchema = () => ({
  // ...campos existentes...
  legalName: LEGAL.legalName,
  taxID: LEGAL.ruc, // RUC
});

Y para el producto, refleja la condición real:

ts
itemCondition: p.condition === 'new'
  ? 'https://schema.org/NewCondition'
  : 'https://schema.org/UsedCondition',
9.8 libro-de-reclamaciones.astro (hoja de reclamación virtual)

Campos mínimos que debe capturar la hoja (verifica la lista exacta vigente en INDECOPI [VALIDAR]):

Fecha del registro y número correlativo
Datos del proveedor: razón social, RUC, domicilio
Datos del consumidor: nombres, documento de identidad, domicilio, teléfono, correo
Identificación del bien o servicio y monto reclamado
Tipo: Reclamo (producto o servicio) o Queja (atención)
Detalle del hecho y pedido del consumidor
Espacio para respuesta del proveedor
Aceptación de tratamiento de datos personales
astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { LEGAL } from '../data/site';
---
<BaseLayout
  title="Libro de Reclamaciones"
  description={`Registra tu reclamo o queja. Respondemos en un máximo de ${LEGAL.reclamosResponseDays} días hábiles.`}
>
  <h1>Libro de Reclamaciones</h1>
  <p>
    {LEGAL.legalName} · RUC {LEGAL.ruc} · {LEGAL.fiscalAddress}
  </p>

  <form action="/api/reclamos" method="post">
    <fieldset>
      <legend>1. Identificación del consumidor</legend>
      <label>Nombres y apellidos <input name="nombre" required /></label>
      <label>DNI / CE <input name="documento" required /></label>
      <label>Domicilio <input name="domicilio" required /></label>
      <label>Teléfono <input name="telefono" type="tel" required /></label>
      <label>Correo <input name="email" type="email" required /></label>
    </fieldset>

    <fieldset>
      <legend>2. Identificación del bien o servicio</legend>
      <label>Tipo
        <select name="tipoBien" required>
          <option value="producto">Producto</option>
          <option value="servicio">Servicio</option>
        </select>
      </label>
      <label>Descripción del bien o servicio <input name="bien" required /></label>
      <label>Monto reclamado (S/) <input name="monto" type="number" step="0.01" /></label>
    </fieldset>

    <fieldset>
      <legend>3. Detalle</legend>
      <label>Tipo
        <select name="tipo" required>
          <option value="reclamo">Reclamo (disconformidad con el producto o servicio)</option>
          <option value="queja">Queja (disconformidad con la atención)</option>
        </select>
      </label>
      <label>Detalle <textarea name="detalle" rows="5" required></textarea></label>
      <label>Pedido del consumidor <textarea name="pedido" rows="3" required></textarea></label>
    </fieldset>

    <label>
      <input type="checkbox" name="consentimiento" required />
      Autorizo el tratamiento de mis datos personales según la
      <a href="/politica-de-privacidad/">política de privacidad</a>.
    </label>

    <button type="submit">Enviar hoja de reclamación</button>
  </form>
</BaseLayout>

Backend (importante): un sitio Astro estático no procesa formularios. Necesitas una de estas opciones:

Astro SSR con adaptador (Node, Vercel, Netlify, Cloudflare) y un endpoint src/pages/api/reclamos.ts que:
valide los campos,
genere un número correlativo,
guarde el registro (BD o hoja protegida) durante al menos 2 años,
envíe copia al consumidor por correo y otra a reclamos@tudominio.com,
permita imprimir/descargar la hoja registrada.
Usar la herramienta gratuita "Tu Libro de Reclamaciones" de INDECOPI y enlazarla/embeberla según sus indicaciones.
Un proveedor externo confiable que cumpla los requisitos (correlativo, copia al consumidor, conservación).

En todos los casos, define un responsable interno y un procedimiento para responder dentro del plazo.

9.9 Mensaje de WhatsApp con foco en cumplimiento

En src/data/whatsapp.ts, el mensaje inicial puede pedir directamente lo que necesitas para el comprobante:

ts
export function productWhatsappMessage(name: string, url: string) {
  return `Hola, me interesa "${name}" (${url}). ¿Tienen stock y cuál es el precio final con IGV? Necesitaré boleta o factura.`;
}
9.10 SEO y cumplimiento conviven
Las páginas legales pueden indexarse (no hace falta noindex); mejoran la confianza. No las cargues de palabras clave.
Mantén coherencia de datos (razón social, RUC, dirección, teléfono) entre footer, JSON-LD y Google Business Profile.
Si el precio no se muestra en la ficha, no incluyas offers en el JSON-LD (ya lo contempla productSchema).