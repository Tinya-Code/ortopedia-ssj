import type { Site } from '../api/types';

/**
 * Base de wa.me con el número del negocio, sin mensaje:
 * `https://wa.me/<dígitos>`. El número lo inyecta quien consume (baja del
 * facade), para que este módulo puro no dependa de ningún origen de datos.
 */
export function waBase(site: Site): string {
  return `https://wa.me/${site.whatsapp}`;
}

/** href de WhatsApp con el mensaje precargado (URL-encoded). */
export function whatsappLink(site: Site, message: string) {
  return `${waBase(site)}?text=${encodeURIComponent(message)}`;
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
