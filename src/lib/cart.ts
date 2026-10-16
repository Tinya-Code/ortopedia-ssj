// Integración con @dennismiranda/astro-cart: mapeo de Product del sitio →
// Product del paquete y mensaje de cotización por WhatsApp (el cierre real).
import type { Product } from '../data/types';
import type { CartItem, Product as CartProduct } from '@dennismiranda/astro-cart/core';
import { absUrl } from './url';

/**
 * Lista de cotización: cualquier producto se puede agregar. No exige precio
 * (los productos cotizan) ni stock (agregar no compromete disponibilidad).
 * Es la única puerta de decisión de las CTA "Agregar".
 */
export const isAddable = (_product: Pick<Product, 'price' | 'availability'>): boolean =>
  true;

/** Slice mínimo que consume el carrito (no la entidad entera). */
export type CartableProduct = Pick<Product, 'slug' | 'name' | 'price' | 'availability' | 'sku'> & {
  image: { src: ImageMetadata | string };
  seoDescription?: string;
};

/**
 * Payload que entiende el controlador del paquete (`data-product` en JSON).
 * `metadata.url` viaja a la línea del carrito y permite enlazar el producto
 * en el mensaje de cotización.
 */
export function toCartProduct(product: CartableProduct): CartProduct {
  // `image.src` es ImageMetadata (assets locales) o string (API remota).
  const src = product.image.src;
  return {
    id: product.slug,
    name: product.name,
    price: product.price ?? 0,
    imageUrl: absUrl(typeof src === 'string' ? src : src.src),
    description: product.seoDescription ?? null,
    sku: product.sku,
    metadata: { url: `/producto/${product.slug}/` },
  };
}

/** Mensaje de cotización: cantidad y nombre de cada producto (sin precios ni URLs). */
export function quoteWhatsappMessage(items: CartItem[]): string {
  const lines = items.map((item) => `${item.quantity} × ${item.name}`);

  return [
    'Hola, quiero cotizar estos productos:',
    '',
    ...lines,
    '',
    '¿Me podrían enviar precios y disponibilidad? Gracias.',
  ].join('\n');
}
