/**
 * Branded 1200×630 share images, rendered at build time.
 *
 * SVG is composed by hand and rasterised with resvg, using the same three
 * brand faces the site loads (downloaded to assets/fonts/). Nothing here runs
 * in the browser.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { phaseOfLevel, levels, phases, totalSessions, sentence, type Level } from '../data/levels';

const FONT_DIR = join(process.cwd(), 'assets/fonts');
const FONT_FILES = [
  'SpaceGrotesk-700.ttf',
  'DMSans-400.ttf',
  'DMSans-500.ttf',
  'JetBrainsMono-500.ttf',
].map((f) => join(FONT_DIR, f));

const W = 1200;
const H = 630;

const PHASE_COLORS: Record<string, { bg: string; br: string; ac: string }> = {
  foundations: { bg: '#EDE9FE', br: '#DDD6FE', ac: '#6D28D9' },
  retrieval: { bg: '#DBEAFE', br: '#BFDBFE', ac: '#1D4ED8' },
  agentic: { bg: '#D1FAE5', br: '#A7F3D0', ac: '#047857' },
  trust: { bg: '#FEF3C7', br: '#FDE68A', ac: '#B45309' },
  production: { bg: '#CFFAFE', br: '#A5F3FC', ac: '#0E7490' },
  frontier: { bg: '#FFE4E6', br: '#FECDD3', ac: '#BE123C' },
  interview: { bg: '#F1F5F9', br: '#E2E8F0', ac: '#334155' },
};

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Greedy wrap using an average advance width. Deliberately conservative so a
 * long title never bleeds past the safe area.
 */
function wrap(text: string, fontSize: number, maxWidth: number, avg: number, maxLines: number): string[] {
  const perChar = fontSize * avg;
  const limit = Math.max(1, Math.floor(maxWidth / perChar));
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= limit) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);

  if (lines.length === maxLines) {
    // signal truncation only if there is genuinely more text left
    const joined = lines.join(' ');
    if (joined.length < text.length - 1) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,;:]$/, '') + '…';
    }
  }
  return lines;
}

function render(svg: string): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'DM Sans' },
  });
  return Buffer.from(resvg.render().asPng());
}

/** Shared page furniture: background, corner wash, CampusX lockup. */
function frame(inner: string, accent: string, wash: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${wash}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${accent}"/>

  ${inner}

  <g transform="translate(72, 545)">
    <rect x="0" y="0" width="34" height="34" rx="10" fill="url(#brand)"/>
    <path d="M9 24 C 13 12, 21 12, 25 10" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="25" cy="10" r="3" fill="#ffffff"/>
    <circle cx="9" cy="24" r="3" fill="#ffffff"/>
    <text x="48" y="16" font-family="Space Grotesk" font-weight="700" font-size="17" fill="#0f0f14">AI Engineering Roadmap</text>
    <text x="48" y="32" font-family="JetBrains Mono" font-size="12" letter-spacing="2.2" fill="#71717a">BY CAMPUSX</text>
  </g>
</svg>`;
}

/** Segmented session meter, matching the one used across the site. */
function meter(x: number, y: number, count: number, color: string, width = 300, gap = 4): string {
  const segW = (width - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) =>
    `<rect x="${(x + i * (segW + gap)).toFixed(2)}" y="${y}" width="${segW.toFixed(2)}" height="8" rx="4" fill="${color}" opacity="0.85"/>`,
  ).join('');
}

export function levelImage(level: Level): Buffer {
  const phase = phaseOfLevel(level.number);
  const c = PHASE_COLORS[phase.id];
  const titleLines = wrap(level.title, 58, 900, 0.52, 2);
  const scopeLines = wrap(sentence(level.scope), 25, 940, 0.5, 2);

  const titleY = 300;
  const scopeY = titleY + (titleLines.length - 1) * 64 + 54;
  const pillW = 22 + phase.name.length * 11.5;

  const inner = `
  <g transform="translate(72, 88)">
    <rect x="0" y="0" width="128" height="128" rx="34" fill="${c.bg}" stroke="${c.br}" stroke-width="3"/>
    <text x="64" y="89" text-anchor="middle" font-family="Space Grotesk" font-weight="700"
      font-size="64" fill="${c.ac}">${level.number}</text>
  </g>

  <g transform="translate(228, 88)">
    <text x="0" y="46" font-family="JetBrains Mono" font-size="15" letter-spacing="3.4" fill="#6c5ce7">LEVEL ${level.number}</text>
    <rect x="0" y="66" width="${pillW}" height="36" rx="18" fill="${c.bg}" stroke="${c.br}" stroke-width="2"/>
    <text x="${pillW / 2}" y="90" text-anchor="middle" font-family="JetBrains Mono"
      font-size="14" letter-spacing="2" fill="${c.ac}">${esc(phase.name.toUpperCase())}</text>
  </g>

  ${titleLines
    .map(
      (line, i) =>
        `<text x="72" y="${titleY + i * 64}" font-family="Space Grotesk" font-weight="700" font-size="58"
          letter-spacing="-1.6" fill="#0f0f14">${esc(line)}</text>`,
    )
    .join('')}

  ${scopeLines
    .map(
      (line, i) =>
        `<text x="72" y="${scopeY + i * 36}" font-family="DM Sans" font-size="25" fill="#52525b">${esc(line)}</text>`,
    )
    .join('')}

  <g transform="translate(72, 478)">
    ${meter(0, 0, level.totalSessions, c.ac, 360, 3)}
    <text x="0" y="36" font-family="JetBrains Mono" font-size="15" letter-spacing="2" fill="#3f3f46">${level.totalSessions} SESSIONS · ${level.modules.length} MODULES</text>
  </g>`;

  return render(frame(inner, c.ac, c.bg));
}

export function defaultImage(): Buffer {
  const capstoneCount = levels.filter((l) => l.project !== null).length;
  const segGap = 7;
  const segW = (1056 - segGap * 14) / 15;

  const strip = levels
    .map((l, i) => {
      const c = PHASE_COLORS[phaseOfLevel(l.number).id];
      const x = i * (segW + segGap);
      return `<rect x="${x.toFixed(2)}" y="0" width="${segW.toFixed(2)}" height="54" rx="12" fill="${c.bg}" stroke="${c.br}" stroke-width="2"/>
        <text x="${(x + segW / 2).toFixed(2)}" y="35" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="${c.ac}">${l.number}</text>`;
    })
    .join('');

  const keys = phases
    .map((p, i) => {
      const c = PHASE_COLORS[p.id];
      const x = i * 176;
      return `<rect x="${x}" y="0" width="14" height="14" rx="4" fill="${c.bg}" stroke="${c.ac}" stroke-width="2"/>
        <text x="${x + 24}" y="12" font-family="DM Sans" font-size="16" fill="#52525b">${esc(p.name)}</text>`;
    })
    .join('');

  const inner = `
  <text x="72" y="118" font-family="JetBrains Mono" font-size="15" letter-spacing="3.4" fill="#6c5ce7">AI ENGINEERING ROADMAP</text>

  <text x="72" y="196" font-family="Space Grotesk" font-weight="700" font-size="64" letter-spacing="-2" fill="#0f0f14">Fifteen levels from writing</text>
  <text x="72" y="266" font-family="Space Grotesk" font-weight="700" font-size="64" letter-spacing="-2" fill="#0f0f14">software to shipping AI systems.</text>

  <text x="72" y="322" font-family="DM Sans" font-size="26" fill="#52525b">Not a playlist — a sequence. Every level ends with something you deploy.</text>

  <g transform="translate(72, 372)">${strip}</g>
  <g transform="translate(72, 456)">${keys}</g>

  <g transform="translate(72, 500)">
    <text x="0" y="16" font-family="JetBrains Mono" font-size="15" letter-spacing="2" fill="#3f3f46">${levels.length} LEVELS · ${totalSessions} SESSIONS · ${capstoneCount} CAPSTONES</text>
  </g>`;

  return render(frame(inner, '#6c5ce7', '#FAF9FF'));
}
