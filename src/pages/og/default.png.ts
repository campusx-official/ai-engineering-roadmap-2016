import type { APIRoute } from 'astro';
import { defaultImage } from '../../lib/og';

export const GET: APIRoute = () =>
  new Response(new Uint8Array(defaultImage()), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
