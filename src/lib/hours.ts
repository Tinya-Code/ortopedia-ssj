// Horario legible a partir de site.hours — usado en el footer, en la home
// y en /contacto/ para mantener una única redacción (coherencia NAP).
// TODO de arquitectura: idealmente recibiría el objeto Site como parámetro
// para que el facade (src/api) sea la única entrada de datos.
import { site } from '../api/data/site';

const dayShort: Record<string, string> = {
  Monday: 'Lun',
  Tuesday: 'Mar',
  Wednesday: 'Mié',
  Thursday: 'Jue',
  Friday: 'Vie',
  Saturday: 'Sáb',
  Sunday: 'Dom',
};

export function formatHours(hours = site.hours): string {
  return hours
    .map((h) => `${h.days.map((d) => dayShort[d] ?? d).join(', ')}: ${h.opens}–${h.closes}`)
    .join(' · ');
}
