import { SITE } from './site';

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje de cotización con foco en cumplimiento: pide precio final con IGV
 * y avisa que se requerirá comprobante (doc/legal.md 9.9).
 */
export function productWhatsappMessage(name: string, url: string) {
  return `Hola, me interesa "${name}" (${url}). ¿Tienen stock y cuál es el precio final con IGV? Necesitaré boleta o factura.`;
}

export function categoryWhatsappMessage(name: string) {
  return `Hola, quiero información sobre ${name}. ¿Me asesoran?`;
}

export function generalWhatsappMessage() {
  return 'Hola, quisiera información sobre sus productos y servicios.';
}
