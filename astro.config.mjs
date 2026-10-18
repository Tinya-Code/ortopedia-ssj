// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import { site } from './src/api/data/site';

// https://astro.build/config
export default defineConfig({
  // Fuente única del dominio: cambiar site.url en src/api/data/site.ts (TODO: dominio real).
  // De aquí salen canonical, sitemap, og:url y — vía site.url — JSON-LD y WhatsApp.
  site: site.url,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
