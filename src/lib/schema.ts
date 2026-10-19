// Constructores JSON-LD puros: reciben site/legal/currency que bajan del
// facade (src/api), sin importar ningún origen de datos directamente.
import type { Legal, Site } from '../api/types';

type Condition = 'new' | 'refurbished' | 'used';

const conditionToSchema = (condition: Condition = 'new') =>
  condition === 'new'
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition';

export const organizationSchema = (site: Site, legal: Legal) => ({
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'Store'],
  '@id': `${site.url}/#business`,
  name: site.name,
  legalName: legal.legalName,
  taxID: legal.ruc,
  url: site.url,
  image: `${site.url}/og-default.jpg`,
  telephone: site.phone,
  email: site.email,
  description: site.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: site.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: Object.values(site.social),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: it.url,
  })),
});

export const productSchema = (p: {
  name: string;
  description: string;
  images: string[];
  url: string;
  sku?: string;
  /** '' (sin marca) y null se descartan: la clave no viaja al JSON-LD. */
  brand?: string | null;
  /** null (sin precio publicado) se descarta: sin precio no hay offers. */
  price?: number | null;
  availability: string;
  condition?: Condition;
  /** Moneda del sitio (PEN), inyectada por el caller desde site.currency. */
  currency: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  description: p.description,
  image: p.images,
  sku: p.sku,
  brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
  // offers solo si hay precio (Google lo exige para rich results); el guard
  // truthy también descarta null y 0 igual que antes con la clave ausente.
  offers: p.price
    ? {
        '@type': 'Offer',
        url: p.url,
        priceCurrency: p.currency,
        price: p.price,
        availability: `https://schema.org/${p.availability}`,
        itemCondition: conditionToSchema(p.condition),
      }
    : undefined,
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});

export const itemListSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: it.url, name: it.name })),
});
