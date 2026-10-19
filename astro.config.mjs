// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// Excepción documentada: astro.config.mjs se ejecuta ANTES de que Vite popule
// `import.meta.env`, por lo que no puede usar el facade `api.site.get()` (ese
// camino depende de USE_API/API_BASE_URL). Aquí solo se lee el mock local para
// obtener el dominio. Toda la página/componente pasa por el facade.
import { site } from './src/api/data/site';

// https://astro.build/config
export default defineConfig({
  // Fuente única del dominio: cambiar site.url en src/api/data/site.ts (TODO: dominio real).
  // De aquí salen canonical, sitemap, og:url y — vía site.url — JSON-LD y WhatsApp.
  site: site.url,
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // /enlaces/ es noindex (página de enlaces para bio): listarla en el
      // sitemap contradiría su meta robots, así que queda fuera.
   
    }),
  ],
});
