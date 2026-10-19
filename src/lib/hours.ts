// Horario legible — usado en /terminos-y-condiciones/ y en LocationCta para
// mantener una única redacción (coherencia NAP). Recibe el arreglo de horarios
// que baja del facade (src/api), sin estado propio.
import type { SiteHours } from '../api/types';

const dayShort: Record<string, string> = {
  Monday: 'Lun',
  Tuesday: 'Mar',
  Wednesday: 'Mié',
  Thursday: 'Jue',
  Friday: 'Vie',
  Saturday: 'Sáb',
  Sunday: 'Dom',
};

export function formatHours(hours: SiteHours[]): string {
  return hours
    .map((h) => `${h.days.map((d) => dayShort[d] ?? d).join(', ')}: ${h.opens}–${h.closes}`)
    .join(' · ');
}
