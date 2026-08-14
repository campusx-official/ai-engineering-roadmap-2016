/**
 * Fidelity check: every objective in levels.json must appear verbatim in the
 * built HTML.
 *
 * The level pages apply presentational formatting (technical terms bolded,
 * lead clauses emphasised, trailing list commas dropped). This asserts that the
 * formatting never changes the words. Run after `npm run build`.
 *
 * The only permitted differences are the trailing colons on capstone lines that
 * render as uppercase sub-headings — listed explicitly below.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/levels.json'), 'utf8'));

/** Capstone lines rendered as sub-headings, which shed their trailing colon. */
const HEADING_EXCEPTIONS = new Set(['Build:', 'Build an agent that:', 'Then add:']);

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let checked = 0;
const missing = [];

for (const level of data.levels) {
  const file = join(root, `dist/level/${level.number}/index.html`);
  if (!existsSync(file)) {
    console.error(`No build output for level ${level.number}. Run npm run build first.`);
    process.exit(1);
  }
  // strip only the tags this site injects into objective text
  const flat = readFileSync(file, 'utf8').replace(/<\/?(b|span)[^>]*>/g, '');

  for (const module of level.modules) {
    for (const objective of module.objectives) {
      checked++;
      if (HEADING_EXCEPTIONS.has(objective.text)) continue;
      const expected = escapeHtml(objective.text.replace(/[,;]\s*$/, ''));
      if (!flat.includes(expected)) {
        missing.push(`L${level.number} ${module.id}: ${objective.text.slice(0, 70)}`);
      }
    }
  }
}

console.log(`checked ${checked} objectives across ${data.levels.length} levels`);
if (missing.length) {
  console.log(`ALTERED OR MISSING: ${missing.length}`);
  for (const m of missing.slice(0, 20)) console.log('  ' + m);
  process.exitCode = 1;
} else {
  console.log('all objectives render verbatim');
}
