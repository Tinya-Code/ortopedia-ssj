import { site } from '../api/data/site';

/**
 * Base de wa.me con el número del negocio, sin mensaje:
 * `https://wa.me/<dígitos>`. Exportada para que scripts de cliente compongan
 * el href sin necesitar el helper completo de mensajes.
 */
export function waBase(): string {
  return `https://wa.me/${site.whatsapp}`;
}

/** href de WhatsApp con el mensaje precargado (URL-encoded). */
export function whatsappLink(message: string) {
  return `${waBase()}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje de cotización con foco en cumplimiento: pide precio y stock
 * y avisa que se requerirá comprobante (doc/legal.md 9.9).
 */
export function productWhatsappMessage(name: string, url: string) {
  return `Hola, me interesa "${name}" (${url}). ¿Tienen stock y cuál es el precio? Necesitaré boleta o factura.`;
}

export function categoryWhatsappMessage(name: string) {
  return `Hola, quiero información sobre ${name}. ¿Me asesoran?`;
}

export function generalWhatsappMessage() {
  return 'Hola, quisiera información sobre sus productos y servicios.';
}
