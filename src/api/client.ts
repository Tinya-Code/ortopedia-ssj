import { API_BASE_URL, USE_API } from './config';

/** Error de la capa API: transporta el status HTTP cuando lo hay. */
export class ApiError extends Error {
  constructor(
    readonly status: number | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Memo por URL: el build pide lo mismo muchas veces (home, 404, catálogo…);
// una petición real por URL y por proceso. Un rechazo queda memoizado: el
// error se entrega igual a todos los consumidores (sin reintentos).
const cache = new Map<string, Promise<unknown>>();

async function fetchJSON<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET', // la capa es solo lectura: sin POST/PUT/DELETE
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    throw new ApiError(
      undefined,
      `[api] GET ${url} falló: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }
  if (!res.ok) {
    throw new ApiError(res.status, `[api] GET ${url} → ${res.status} ${res.statusText}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError(res.status, `[api] GET ${url} devolvió JSON inválido`);
  }
}

/**
 * GET JSON con `path` absoluto sobre API_BASE_URL (ej: `/products?page=2`).
 * Solo corre en modo api (la rama repo nunca lo invoca).
 */
export function getJSON<T>(path: string): Promise<T> {
  if (!USE_API) {
    throw new Error('[api] getJSON() solo corre con USE_API=true');
  }
  const url = `${API_BASE_URL.replace(/\/+$/, '')}${path}`;
  let hit = cache.get(url);
  if (!hit) {
    hit = fetchJSON<T>(url);
    cache.set(url, hit);
  }
  return hit as Promise<T>;
}

// Memo del wrapper seguro por path: UN banner por endpoint y por build.
// El rechazo de getJSON subyacente también queda memoizado (sin reintentos).
const safeCache = new Map<string, Promise<unknown>>();

/**
 * Variante NO throwing de getJSON para el modo api: si el fetch falla
 * (ApiError o cualquier rechazo) devuelve `empty` —vacío tipado T— y emite
 * un banner inignorable en consola. El build no se rompe: la página sale
 * vacía (error VISIBLE en el resultado) y el motivo queda LOUD en el log.
 */
export function getJSONSafe<T>(path: string, empty: T): Promise<T> {
  let hit = safeCache.get(path);
  if (!hit) {
    hit = getJSON<T>(path).catch((cause: unknown) => {
      const motivo =
        cause instanceof ApiError && cause.status !== undefined
          ? `HTTP ${cause.status} — ${cause.message}`
          : cause instanceof Error
            ? cause.message
            : String(cause);
      console.error(
        [
          '══════════════════════════════════════════════════════════',
          `[api] ERROR al cargar ${path}`,
          `Motivo: ${motivo}`,
          'Se devolvió un objeto vacío para ese endpoint.',
          'La página seguirá construyendo pero SIN esos datos.',
          'Revisa que la API responda o que API_BASE_URL sea correcta.',
          '══════════════════════════════════════════════════════════',
        ].join('\n'),
      );
      return empty;
    });
    safeCache.set(path, hit);
  }
  return hit as Promise<T>;
}
