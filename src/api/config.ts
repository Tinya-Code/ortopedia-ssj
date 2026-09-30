/**
 * Origen de datos y base URL de la API (solo server-side: se lee en
 * frontmatter/getStaticPaths, nunca en cliente).
 *
 * Uso:
 *   USE_API=true API_BASE_URL=https://api.ejemplo.com pnpm build
 *
 * Sin definir → modo repo (datos locales de src/data/db.ts).
 * Ambas son variables de entorno normales (sin PUBLIC_): Astro las expone en
 * server-side vía import.meta.env (docs.astro.build/en/guides/environment-variables).
 */

const raw: unknown = import.meta.env.USE_API;

if (raw !== undefined && raw !== 'true' && raw !== 'false') {
  throw new Error(`[api] USE_API inválida: "${String(raw)}" (esperado "true" o "false")`);
}

export const USE_API = raw === 'true';

export const API_BASE_URL: string = import.meta.env.API_BASE_URL ?? '';

if (USE_API && !API_BASE_URL) {
  throw new Error(
    '[api] USE_API=true pero API_BASE_URL no está definida. ' +
      'Definila junto al flag (ej: API_BASE_URL=https://api.ejemplo.com).',
  );
}
