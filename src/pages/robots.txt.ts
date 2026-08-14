import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches whatever
 * origin the build resolved (see SITE in astro.config.mjs). A hardcoded
 * robots.txt silently points crawlers at the wrong domain on preview and
 * on any deployment that is not the intended custom domain.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
