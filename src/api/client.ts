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
// una petición real por URL y por proceso. Un rechazo queda memoizado: si la
// API falla, el build falla igual en todos los consumidores (sin reintentos).
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
