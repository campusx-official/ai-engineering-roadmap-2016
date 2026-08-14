// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Change this to the real deployment origin before going live — it feeds the
// sitemap, canonical URLs and the absolute og:image URLs.
export const SITE = 'https://roadmap.campusx.in';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
