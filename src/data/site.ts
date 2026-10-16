// Datos del negocio — TODO: sustituir por valores reales antes de publicar (Fase 9).

export const SITE = {
  name: 'Centro Ortopédico Solidario San Jose',
  url: 'https://www.example.com', // TODO: dominio real
  description:
    'Centro ortopédico: venta de productos ortopédicos, ortesis, prótesis y servicios de evaluación.',
  phone: '+51 957 850 865',
  whatsapp: '51957850865', // sin + ni espacios
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
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  social: {
    facebook: 'https://facebook.com/example',
    tiktok: 'https://tiktok.com/@example',
    instagram: 'https://instagram.com/example',
  },
  currency: 'PEN',
} as const;

// Datos legales (INDECOPI) — ver doc/legal.md 9.2
export const LEGAL = {
  legalName: 'Centro Ortopédico Solidario San Jose S.A.C.',
  tradeName: 'Centro Ortopédico SSJ',
  ruc: '20000000001',
  fiscalAddress: 'Av 26 de Noviembre N°121, Villa María del Triunfo 15817',
  email: 'contacto@example.com',
  phone: '+51 957 850 865',
  reclamosEmail: 'reclamos@example.com',
  reclamosResponseDays: 15, // días hábiles [VALIDAR reglamento vigente]
  currency: 'PEN',
  // Última actualización de las páginas legales (una sola fuente para las 3).
  lastUpdated: '30 de septiembre de 2026',
} as const;
