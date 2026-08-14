import type { APIRoute, GetStaticPaths } from 'astro';
import { levelImage } from '../../lib/og';
import { levels, type Level } from '../../data/levels';

export const getStaticPaths: GetStaticPaths = () =>
  levels.map((level) => ({ params: { n: String(level.number) }, props: { level } }));

export const GET: APIRoute = ({ props }) =>
  new Response(new Uint8Array(levelImage(props.level as Level)), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
