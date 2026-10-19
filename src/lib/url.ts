// Helpers de URL absoluta — inyectan el objeto Site que baja del facade (src/api),
// para que la única entrada de datos de identidad del negocio sea el facade.
import type { Site } from '../api/types';

/**
 * Ruta relativa (`/catalogo/…`) → URL absoluta con el dominio del sitio.
 *
 * `site.url` es la fuente viva (puede venir vacía si la API de datos está caída;
 * en ese caso el facade ya emitió su banner de error). `import.meta.env.SITE` es
 * el dominio declarado en astro.config.mjs y sirve de red de seguridad para que
 * el build no revierta en `TypeError: Invalid URL` cuando se consulta con
 * USE_API y el servidor no responde.
 */
export const absUrl = (site: Site, path: string): string =>
  new URL(path, site.url || import.meta.env.SITE || 'https://www.example.com').href;
