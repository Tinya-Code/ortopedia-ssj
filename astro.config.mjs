// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: dominio real (Previas Fase 0) — obligatorio para canonical y sitemap
  site: 'https://www.example.com',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
