// Helpers de URL absoluta — única fuente de la base: SITE.url (data/site).
import { SITE } from '../data/site';

/** Ruta relativa (`/catalogo/…`) → URL absoluta con el dominio del sitio. */
export const absUrl = (path: string): string => new URL(path, SITE.url).href;
