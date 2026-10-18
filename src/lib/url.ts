// Helpers de URL absoluta — única fuente de la base: site.url (api/data/site).
// TODO de arquitectura: idealmente recibiría el objeto Site como parámetro
// para que el facade (src/api) sea la única entrada de datos.
import { site } from '../api/data/site';

/** Ruta relativa (`/catalogo/…`) → URL absoluta con el dominio del sitio. */
export const absUrl = (path: string): string => new URL(path, site.url).href;
