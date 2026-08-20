/**
 * Dev helper: screenshot the site at a few viewports and report any page that
 * scrolls horizontally (the mobile-first check that matters most here).
 *
 * Usage: node scripts/shots.mjs [baseUrl] [outDir]
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4322';
const OUT = process.argv[3] ?? './.shots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = [
  { name: 'mobile', width: 380, height: 900, dsf: 2 },
  { name: 'tablet', width: 820, height: 1100, dsf: 1 },
  { name: 'desktop', width: 1440, height: 1000, dsf: 1 },
];

/* '404' deliberately requests a missing route: its own HTTP 404 is expected and
   is filtered out of the console-error check below. */
const PAGES = [
  ['home', '/'],
  ['level0', '/level/0/'],
  ['level6', '/level/6/'],
  ['level15', '/level/15/'],   // the last level; update if the sequence changes
  ['start', '/start/'],
  ['404', '/this-page-does-not-exist/'],
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const problems = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });

  const errors = [];
  let expected404 = false;
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (expected404 && /404/.test(m.text())) return;
    errors.push(m.text());
  });
  page.on('response', (r) => {
    if (r.status() < 400) return;
    if (expected404) return;
    errors.push(`HTTP ${r.status()} ${r.url()}`);
  });

  for (const [name, path] of PAGES) {
    expected404 = name === '404';
    await page.goto(BASE + path, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      innerW: window.innerWidth,
      // widest element sticking out past the viewport
      offenders: [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`),
    }));

    if (metrics.scrollW > metrics.clientW + 1) {
      problems.push(
        `${vp.name} ${path}: scrollWidth ${metrics.scrollW} > clientWidth ${metrics.clientW} — ${metrics.offenders.join(', ')}`,
      );
    }

    await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png`, fullPage: vp.width < 1000 ? false : false });
  }

  if (errors.length) problems.push(`${vp.name}: console errors — ${errors.slice(0, 3).join(' | ')}`);
  await page.close();
}

await browser.close();

if (problems.length) {
  console.log('ISSUES:');
  for (const p of problems) console.log('  ' + p);
  process.exitCode = 1;
} else {
  console.log('no horizontal overflow, no console errors');
}
