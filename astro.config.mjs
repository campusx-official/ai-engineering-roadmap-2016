// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * The origin the built site believes it lives at. It feeds canonical URLs, the
 * sitemap and the absolute og:image URLs, so getting it wrong means social
 * scrapers fetch share images from a domain that does not serve them.
 *
 * Resolution order:
 *   1. SITE_URL                        — explicit override; set this once a
 *                                        custom domain is attached.
 *   2. VERCEL_PROJECT_PRODUCTION_URL   — the project's stable production
 *                                        domain, injected by Vercel at build
 *                                        time. Deliberately not VERCEL_URL,
 *                                        which changes on every deployment and
 *                                        would churn canonicals.
 *   3. the intended custom domain      — used for local builds.
 */
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE =
  process.env.SITE_URL ??
  (productionUrl ? `https://${productionUrl}` : 'https://roadmap.campusx.in');

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
