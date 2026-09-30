// Datos del negocio — TODO: sustituir por valores reales antes de publicar (Fase 9).

export const SITE = {
  name: 'Centro Ortopédico SSJ',
  url: 'https://www.example.com', // TODO: dominio real
  description:
    'Centro ortopédico: venta de productos ortopédicos, ortesis, prótesis y servicios de evaluación.',
  phone: '+51 000 000 000',
  whatsapp: '51000000000', // sin + ni espacios
  email: 'contacto@example.com',
  address: {
    street: 'Av. Ejemplo 123',
    city: 'Ciudad',
    region: 'Región',
    postalCode: '00000',
    country: 'PE',
  },
  geo: { lat: -12.0464, lng: -77.0428 },
  hours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
  social: ['https://facebook.com/example', 'https://instagram.com/example'],
  currency: 'PEN',
} as const;

// Datos legales (INDECOPI) — ver doc/legal.md 9.2
export const LEGAL = {
  legalName: 'RAZÓN SOCIAL DE PRUEBA S.A.C.',
  tradeName: 'Centro Ortopédico SSJ',
  ruc: '20000000001',
  fiscalAddress: 'Av. Ejemplo 123, Distrito, Ciudad, Perú',
  email: 'contacto@example.com',
  phone: '+51 000 000 000',
  reclamosEmail: 'reclamos@example.com',
  reclamosResponseDays: 15, // días hábiles [VALIDAR reglamento vigente]
  pricesIncludeIGV: true,
  currency: 'PEN',
  // Última actualización de las páginas legales (una sola fuente para las 3).
  lastUpdated: '30 de septiembre de 2026',
} as const;
