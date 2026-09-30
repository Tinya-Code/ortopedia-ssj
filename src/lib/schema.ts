import { SITE, LEGAL } from '../data/site';

type Condition = 'new' | 'refurbished' | 'used';

const conditionToSchema = (condition: Condition = 'new') =>
  condition === 'new'
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition';

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'Store'],
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  legalName: LEGAL.legalName,
  taxID: LEGAL.ruc,
  url: SITE.url,
  image: `${SITE.url}/og-default.jpg`,
  telephone: SITE.phone,
  email: SITE.email,
  description: SITE.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHoursSpecification: SITE.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: SITE.social,
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
  brand?: string;
  price?: number;
  availability: string;
  condition?: Condition;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  description: p.description,
  image: p.images,
  sku: p.sku,
  brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
  // offers solo si hay precio (Google lo exige para rich results)
  offers: p.price
    ? {
        '@type': 'Offer',
        url: p.url,
        priceCurrency: SITE.currency,
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
