// Integración con @dennismiranda/astro-cart: mapeo de Product del sitio →
// Product del paquete y mensaje de pedido por WhatsApp (el checkout real).
import type { Product } from '../data/types';
import type { CartItem, CartTotals, Product as CartProduct } from '@dennismiranda/astro-cart/core';
import { absUrl } from './url';

/**
 * Se puede agregar al carrito solo si hay precio publicado y stock disponible.
 * "Consultar precio" / PreOrder / OutOfStock siguen su CTA de WhatsApp.
 */
export const isAddable = (product: Pick<Product, 'price' | 'availability'>): boolean =>
  typeof product.price === 'number' && product.price > 0 && product.availability === 'InStock';

/** Slice mínimo que consume el carrito (no la entidad entera). */
export type CartableProduct = Pick<Product, 'slug' | 'name' | 'price' | 'availability' | 'sku'> & {
  image: { src: ImageMetadata | string };
  seoDescription?: string;
};

/**
 * Payload que entiende el controlador del paquete (`data-product` en JSON).
 * `metadata.url` viaja a la línea del carrito y permite enlazar el producto
 * en el mensaje de pedido.
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

const money = (n: number) => `S/ ${n.toFixed(2)}`;

/** Mensaje de pedido con items, totales y datos que el cliente debe responder. */
export function orderWhatsappMessage(items: CartItem[], totals: CartTotals): string {
  const lines = items.map((item) => {
    const url = absUrl(String(item.metadata?.['url'] ?? '/catalogo/'));
    return `${item.quantity} × ${item.name} — ${money(item.lineTotal)}\n   ${url}`;
  });

  return [
    'Hola, quiero hacer este pedido:',
    '',
    ...lines,
    '',
    `Subtotal: ${money(totals.subtotal)}`,
    `Total: ${money(totals.total)}`,
    '',
  ].join('\n');
}
