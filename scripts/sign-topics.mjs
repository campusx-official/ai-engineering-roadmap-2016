/**
 * Writes the `sig` for every entry in src/data/topics.ts from the current
 * parsed objectives, and reports coverage.
 *
 * The label sets are read by importing the module (Node strips the types), not
 * by parsing the file as text — a regex over the source silently miscounted
 * when the formatting changed.
 *
 * Run after authoring labels, or after editing a level's .txt and confirming
 * the existing labels still line up:  npm run topics
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { signature } from '../src/lib/sig.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const topicsPath = join(root, 'src/data/topics.ts');

const data = JSON.parse(readFileSync(join(root, 'src/data/levels.json'), 'utf8'));
const { topics } = await import(pathToFileURL(topicsPath).href);

/** module id -> { level, objective texts } */
const modules = new Map();
for (const level of data.levels) {
  for (const m of level.modules) {
    modules.set(m.id, { level: level.number, texts: m.objectives.map((o) => o.text) });
  }
}

let source = readFileSync(topicsPath, 'utf8');
let updated = 0;
const problems = [];

for (const [id, set] of Object.entries(topics)) {
  const mod = modules.get(id);
  if (!mod) {
    problems.push(`${id}: no such module in levels.json`);
    continue;
  }
  if (mod.texts.length !== set.labels.length) {
    problems.push(`${id}: ${set.labels.length} labels vs ${mod.texts.length} objectives`);
    continue;
  }
  const blank = set.labels.findIndex((l) => !l || !l.trim());
  if (blank !== -1) {
    problems.push(`${id}: label ${blank} is empty`);
    continue;
  }

  const sig = signature(mod.texts);
  const re = new RegExp(`('${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{\\s*sig:\\s*)'[^']*'`);
  if (!re.test(source)) {
    problems.push(`${id}: could not locate its sig field to update`);
    continue;
  }
  const next = source.replace(re, `$1'${sig}'`);
  if (next !== source) updated++;
  source = next;
}

writeFileSync(topicsPath, source);

const covered = Object.keys(topics).filter((id) => modules.has(id)).length;
console.log(`signed ${updated} module(s) · ${covered}/${modules.size} modules have topic labels`);

if (problems.length) {
  console.log('NEEDS ATTENTION:');
  for (const m of problems) console.log('  ' + m);
  process.exitCode = 1;
}

const missing = [...modules.keys()].filter((id) => !(id in topics));
if (missing.length) {
  const byLevel = {};
  for (const id of missing) (byLevel[modules.get(id).level] ??= []).push(id);
  console.log(
    'no labels yet: ' +
      Object.entries(byLevel)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([lvl, ids]) => `L${lvl} (${ids.length})`)
        .join(', '),
  );
}
