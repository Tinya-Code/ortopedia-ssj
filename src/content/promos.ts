import mediasSiriformFlyer from '../assets/promos/medias-siriform-flyer.png';

/**
 * Promociones del sitio (modal automático del home — excepción §5.1
 * autorizada por el usuario el 2026-10-17, ver doc/plan-mejora-ui.md F5).
 *
 * Patrón de datos igual que src/api/data/db.ts: las imágenes se importan
 * estáticamente para que astro:assets las procese en build.
 */

export interface Promo {
  /** Identificador estable de la campaña: se usa en analytics y en el guard de cierre. */
  id: string;
  /** Flyer/creativo de la promoción (asset local). */
  image: ImageMetadata;
  /** Texto alternativo descriptivo del creativo. */
  imageAlt: string;
  /** Destino del CTA (ficha de producto). */
  href: string;
  /** Etiqueta del botón del CTA. */
  ctaLabel: string;
  /** Inicio de la ventana de campaña, ISO 'YYYY-MM-DD' (opcional). */
  startsAt?: string;
  /** Fin de la ventana de campaña, ISO 'YYYY-MM-DD' (opcional). */
  endsAt?: string;
}

export const PROMOS: Promo[] = [
  {
    id: 'medias-siriform-2026',
    image: mediasSiriformFlyer,
    imageAlt: 'Flyer de promoción: medias de compresión gradual Siriform',
    href: '/producto/medias-compresion-siriform/',
    ctaLabel: 'Ver medias Siriform',
    // TODO: fechas de campaña TBD — al definir la ventana, completar
    // startsAt/endsAt en formato 'YYYY-MM-DD' para activar el filtrado por fecha.
  },
];

/** Clave de fecha local 'YYYY-MM-DD' (sin desfase de zona horaria al comparar). */
function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Primer promo vigente según la fecha dada, o null si la lista está vacía o
 * la primera promoción está fuera de su ventana de campaña.
 * En un sitio estático esto se evalúa en build (por página), no en cada visita.
 */
export function activePromo(today = new Date()): Promo | null {
  if (PROMOS.length === 0) return null;

  const todayKey = dateKey(today);
  const promo = PROMOS[0];

  const started = !promo.startsAt || todayKey >= promo.startsAt;
  const notExpired = !promo.endsAt || todayKey <= promo.endsAt;

  return started && notExpired ? promo : null;
}
