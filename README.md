# AI Engineering Roadmap

A visual, 15-level learning map for AI engineering, built to the brief in [`CLAUDE.md`](./CLAUDE.md).
Static Astro site: the homepage is the map, `/level/[n]` is the detail page for each level.

```bash
npm install
npm run dev      # parses the .txt files, then serves
npm run build    # parses, then builds to ./dist
npm run preview  # serve ./dist
```

---

## Content pipeline

**The `level*.txt` files in [`AI ENGINEER ROADMAP/`](./AI%20ENGINEER%20ROADMAP) are the
only source of level content.** `scripts/parse-levels.mjs` turns them into
`src/data/levels.json` at build time; the UI never reads a `.txt` at runtime. The repo
root is kept as a fallback location, so a file dropped there is still picked up.

```
AI ENGINEER ROADMAP/level*.txt
    →  npm run parse  →  src/data/levels.json  →  src/data/levels.ts (typed)  →  pages
```

Currently parsed: **15 levels · 135 modules · 235 sessions**.

The parser extracts, per level: `title`, `scope`, `modules[]` (id, name, `sessionCount`,
`objectives[]`, `outcome`, `tryIt`, `mentalModel`, `finalResult`, `notes[]`), `stack[]`,
`project` (the capstone module id), `totalSessions` and `completionOutcomes[]`.
`completionOutcomes` is parsed and kept in the data but is not currently rendered.

Three things worth knowing:

- **Nothing is invented.** Every string rendered from a level comes verbatim from its
  source file. The presentational liberties are limited to: capitalising the first letter
  of the `Scope:` line (`sentence()`), dropping a trailing comma from list fragments, and
  dropping the trailing colon from the three capstone lines that render as sub-headings
  (all in `src/lib/objective.ts`). `npm run verify` asserts that all 729 objectives still
  appear verbatim in the built HTML.
- **Gaps are surfaced, not filled.** If a field is missing, the level gets an entry in
  `todos[]`, the parser prints it on every build, and the affected section is omitted
  rather than faked. Level pages also carry the TODOs as an HTML comment for maintainers.
  Known real gaps in the source: L1 and L8 have no capstone (those pages simply
  omit the ship-it section); the L3 capstone states no session count.
- **`stack[]` is extracted, not authored.** A tag is emitted only when its pattern
  actually occurs in that level's text (`STACK_VOCAB` in the parser). Add vocabulary
  there; do not hand-write tags into the data. Each tag carries a `kind`: membership of
  `STACK_TOOLS` makes it a **tool** (something you install, call or pay for), everything
  else is a **concept** (technique, protocol, format, metric, practice, regulation). The
  level page renders the two as equal columns. Judgement calls are documented at
  `STACK_TOOLS`: protocols and specs (MCP, A2A, OpenAPI) are concepts while the clients
  that speak them (Postman, curl) are tools; training techniques (LoRA, DPO, SFT) are
  concepts while the libraries implementing them (PEFT, Unsloth, Axolotl) are tools; SQL
  is a concept and PostgreSQL is the tool. Five levels (1, 3, 7, 9, 10) legitimately name
  no products at all and render a single full-width Concepts column.

Icons are assigned by keyword rules (`MODULE_ICON_RULES`), most-specific first, so a
level about agents doesn't render eleven identical robot icons. Every module resolves to
a real Lucide icon — `Icon.astro` throws at build time on an unknown name.

Objectives can be grouped under sub-headings. The parser recognises both the explicit
`Session N · …` form and bare headings like `Component-level evaluation`, detected as
short capitalised lines carrying no terminal punctuation (objectives are always full
sentences). A line ending in a colon opens a list whose short items are *not* headings —
that guard is what keeps the RAG Triad's "Contextual Relevancy / Faithfulness / Answer
Relevance" as items rather than three empty sections.

### Editing content

Edit the `.txt` file, then `npm run parse`. Editing `src/data/levels.json` directly is
pointless — it is regenerated on every dev/build run.

The one file that is *not* parsed is `src/data/courses.ts`: the CampusX One course
mapping from CLAUDE.md §10. Confirm those titles against the live catalog before launch.

---

## Design system

`src/styles/tokens.css` holds the CampusX brand tokens as CSS variables;
`src/styles/global.css` mirrors them into Tailwind v4's theme via `@theme inline`, so
utilities and hand-written CSS cannot drift apart.

Phase colour works by inheritance: put `data-phase="agentic"` on any element and its
subtree gets `--phase-bg`, `--phase-br`, `--phase-ac`. Components read those variables
rather than hard-coding a palette, which is why the same `LevelNode` renders violet in
Foundations and rose in Frontier.

Two accessibility rules are baked into the tokens:

- `--cx-g400` is a **decoration** colour (borders, swatches). Text uses `--cx-g500` or
  darker — `g400` on white is 2.6:1 and fails AA.
- `--cx-green` is for fills and borders; text and icons on `--cx-green-bg` use
  `--cx-green-ink` (7.3:1).

Every pastel pill pair clears WCAG AA for normal text (lowest is amber at 4.5:1).

### Components

`Icon` `Eyebrow` `SectionHeader` `Button` `Pill` `Card` `NumberBadge` `StatBlock`
`SessionMeter` · roadmap: `RoadmapMap` `PhaseBand` `LevelNode` `HeroPath` `ModuleRow`
`ShipItCallout` `LevelNav` `StickyLevelNav` `ProgressDots` `ProgressStrip` `CourseCard`.

`Icon.astro` inlines Lucide geometry from `@iconify-json/lucide` at build time — no icon
runtime, no network request. It forwards unknown props so Astro's scoped-style attribute
reaches the `<svg>`; without that, parent components cannot colour their icons.

---

## Reading the objective lists

Each objective renders as a **short topic bullet**, with the source sentence revealed on
click. The labels live in `src/data/topics.ts` — the one piece of authored copy in the
level pipeline. Each condenses exactly one objective and must not add information the
sentence does not contain; the expander puts the original one click away, so nothing is
lost.

`topics.ts` maps a module id to labels in objective order, alongside a `sig` — a hash of
the objective text the labels were written against, written by `npm run topics`. If a
`.txt` is edited, the signature stops matching and that module falls back to rendering
full sentences rather than pairing labels with the wrong lines. `npm run topics` reports
which modules are unlabelled and which have drifted.

Currently 699 of 721 objectives are topic bullets. The 22 exceptions are levels 12–14,
whose modules hold a single already-terse line each — a label there would hide a
70-character sentence behind a 25-character bullet for no gain, so they render as plain
bullets.

Underneath, `src/lib/objective.ts` handles the expanded text:

- **Two columns above 1040px**, via CSS multi-column so reading order stays vertical. This
  is the main fix — it takes the measure from ~120 characters per line down to ~55.
- **Technical terms bolded** (`markTerms`) so a reader can find `pytest` or `pgvector`
  without reading every line. The vocabulary is deliberately limited to concrete product,
  protocol and format names; adding generic words like "streaming" would highlight half
  the sentence and defeat the purpose.
- **Lead clauses emphasised** (`splitLead`) where a sentence already contains a
  "lead: detail" break. Only about 11% do, so this is a bonus rather than the structure.

The same treatment is applied to the capstone brief, which uses the same topic bullets.

## Client JavaScript

One file, `src/scripts/app.ts` (~3 KB), doing four things:

- **Progress** — completed levels in `localStorage` under `cxr.progress.v1`. Drives the
  done state on nodes and the mini-map, the overall percentage, and the "resume at
  Level n" CTA (the first incomplete level). Syncs across tabs via the `storage` event.
- **Scroll reveals** — IntersectionObserver, skipped entirely under
  `prefers-reduced-motion`.
- **Analytics** — `track()` pushes to `window.dataLayer` and dispatches a `cxr:track`
  DOM event, so any vendor can be wired up without touching components. Events:
  `page_view`, `level_open`, `level_complete`/`level_uncomplete`, `module_expand`,
  `campusx_cta_click`, `campusx_course_click`, `minimap_jump`, `resume_click`,
  `prereq_click`, and the nav events. Add one by putting `data-track="name"` on any
  element.
- Nothing else. The server render is the "not started" state, so the page is complete
  and correct before any JS runs; module expanders are native `<details>`.

---

## Share images

`/og/default.png` and `/og/level-[n].png` are rendered at build time by `src/lib/og.ts`
(hand-composed SVG → resvg), using the real brand faces from `assets/fonts/`. Those three
TTFs are build-time only; the site itself loads webfonts from Google Fonts.

---

## Checks

```bash
npm run verify                    # after a build: every objective still renders verbatim
node scripts/shots.mjs            # screenshots at 380/820/1440 + horizontal-overflow
                                  # and console-error check across the key pages
```

`shots.mjs` requires a local dev server and Chrome at the macOS default path. Its overflow
check is the important one: it catches the min-width blowouts that break the map on
phones.

---

## Deployment

Static output, no adapter and no server runtime — any static host works. `vercel.json`
pins the framework preset, build command and output directory, and adds long cache
headers for the generated share images.

The origin used for canonical URLs, the sitemap and absolute `og:image` URLs resolves in
this order (see `astro.config.mjs`):

1. `SITE_URL` — explicit override. Set this in the host's environment variables once a
   custom domain is attached.
2. `VERCEL_PROJECT_PRODUCTION_URL` — injected by Vercel at build time. Deliberately not
   `VERCEL_URL`, which changes on every deployment and would churn canonicals.
3. `https://roadmap.campusx.in` — the fallback used by local builds.

`robots.txt` is generated from the same value (`src/pages/robots.txt.ts`), so the sitemap
line can never point at a different domain than the pages do.

---

## Before launch

- Attach the custom domain, then set `SITE_URL` to it in the host's environment
  variables so canonicals and share images stop pointing at the deployment subdomain.
- Confirm `src/data/courses.ts` against the live CampusX One catalog, including which
  items are still `status: 'soon'`.
- Point `CAMPUSX_ONE_URL` at the real `#cxo-pricing` anchor if the host domain differs.
