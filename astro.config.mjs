// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import { SITE } from './src/data/site';

// https://astro.build/config
export default defineConfig({
  // Fuente única del dominio: cambiar SITE.url en src/data/site.ts (TODO: dominio real).
  // De aquí salen canonical, sitemap, og:url y — vía SITE.url — JSON-LD y WhatsApp.
  site: SITE.url,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
