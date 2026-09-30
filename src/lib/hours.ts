// Horario legible a partir de SITE.hours — usado en el footer, en la home
// y en /contacto/ para mantener una única redacción (coherencia NAP).
import { SITE } from './site';

const dayShort: Record<string, string> = {
  Monday: 'Lun',
  Tuesday: 'Mar',
  Wednesday: 'Mié',
  Thursday: 'Jue',
  Friday: 'Vie',
  Saturday: 'Sáb',
  Sunday: 'Dom',
};

export function formatHours(hours = SITE.hours): string {
  return hours
    .map((h) => `${h.days.map((d) => dayShort[d] ?? d).join(', ')}: ${h.opens}–${h.closes}`)
    .join(' · ');
}
