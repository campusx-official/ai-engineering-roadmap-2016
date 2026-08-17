# CLAUDE.md — AI Engineering Roadmap Website

Persistent brief for building the **AI Engineering Roadmap** — a public, visual, 15-level learning map that links out to the CampusX platform. Read this fully before writing code, and re-consult it whenever making design or structure decisions.

---

## 1. What we're building

A standalone marketing-grade website that presents the AI Engineering roadmap as a **visual journey through 15 levels (0–14)**. It is a sibling to the main CampusX site — same brand, calmer/more editorial tone — and its job is to (a) orient a learner on the whole path, (b) let them drill into any level, and (c) route them to the relevant CampusX One courses.

**North stars:** on-brand, visually led (not text-heavy), fast, and obviously sequenced. The *sequence is the product* — the design must make progression legible at a glance.

---

## 2. Content source (do not invent content)

All level content already exists as flat files in `./AI ENGINEER ROADMAP/`. Parse these — never fabricate level content. Filenames are canonical:

```
level0-software-fundamentals.txt      level7-llm-evals.txt
level1-llm-101.txt                    level8-ai-security.txt
level2-llm-orchestration.txt          level9-ai-system-design.txt
level3-prompt-engineering.txt         level10-llmops.txt
level4-rag.txt                        level11-advanced-ai-systems.txt
level5-agents.txt                     level12-fine-tuning.txt
level6-context-engineering.txt        level13-projects.txt
                                      level14-interview-prep.txt
```

**Expected content model per level** (parse into this shape; adapt if a file's structure differs, and flag any level that can't be parsed rather than guessing):

- `number` (0–14) and `title`
- `scope` — one-line "what this level is about"
- `outcome` — the "you can…" capability statement
- `modules[]` — each with `name`, `sessionCount`, `objectives[]`
- `stack[]` — tools/tech tags
- `project` — the "ship it" capstone for the level
- `totalSessions` (sum, or stated)

If a level file is prose, extract this structure from it. Keep a single `levels.ts`/`levels.json` as the parsed source of truth so the UI never reads raw `.txt` at runtime.

---

## 3. Tech stack

- **Astro + Tailwind CSS + Lucide icons.** Astro suits a content-driven, mostly-static, visual site and ships almost no JS by default. Tailwind carries utilities; a small design-token layer (below) carries the brand.
- Content collections (or a build-time parse of the `.txt` files) → typed level data.
- Minimal client JS: only for progress tracking, the sticky level navigator, and scroll reveals. No heavy framework runtime.
- If the team prefers hand-authored static HTML (as on Graphy), that's acceptable — but keep the token layer and component conventions identical.

---

## 4. Information architecture

- `/` — **Roadmap overview**: the hero map of all 15 levels, grouped into phases, plus intro, "how to use", and a primary CampusX CTA.
- `/level/[n]` — **Level detail** (deep-linkable), one per level, with prev/next.
- Optional: `/start` (a short "who this is for / how it works" explainer).

**Phase grouping** (use for visual structure and color banding on the map — this is the mental model of the path):

| Phase | Levels | Theme |
|---|---|---|
| Foundations | 0–3 | software, LLM 101, orchestration, prompting |
| Retrieval | 4 | embeddings, vector search, RAG |
| Agentic | 5–6 | agents, context engineering |
| Evaluation & Trust | 7–8 | evals, security |
| Production | 9–10 | system design, LLMOps |
| Frontier & Proof | 11–13 | multimodal, fine-tuning, projects |
| Interview | 14 | positioning, scenarios, mock loops |

---

## 5. Design system — CampusX theme

Match the CampusX One landing page exactly. It is the canonical style reference. Extract these into `tokens.css` (CSS variables) and mirror in `tailwind.config`.

### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```
- **Space Grotesk** — display / headings / numbers (700 for headlines, tight tracking).
- **DM Sans** — body copy, buttons.
- **JetBrains Mono** — eyebrows, labels, tags, metadata (uppercase, wide letter-spacing).

### Color tokens
```css
:root{
  /* brand */
  --cx-purple:      #6c5ce7;  /* primary */
  --cx-purple-deep: #4338ca;  /* indigo — gradients, emphasis */
  --cx-purple-hover:#5b4cdb;  /* button hover */
  --cx-violet-700:  #6D28D9;

  /* ink & gray */
  --cx-ink:   #0f0f14;  --cx-ink-2:#18181b;
  --cx-g700:  #3f3f46;  --cx-g600: #52525b;
  --cx-g500:  #71717a;  --cx-g400: #a1a1aa;

  /* surfaces */
  --cx-white: #ffffff;
  --cx-cream: #faf8f3;   /* warm section bg */
  --cx-gray:  #F9FAFB;
  --cx-violet-bg:#FAF9FF; /* light purple tint section */

  /* lines */
  --cx-border:#e7e5e0;  --cx-border-2:#e4e4e7;

  /* success */
  --cx-green:#059669;   --cx-green-bg:#ECFDF5;
}
```

### Pastel pill palette (cyclic — assign per level/module for visual variety)
Each set is `{bg, border, leftAccent}`:
```
violet  #EDE9FE / #DDD6FE / #6D28D9
blue    #DBEAFE / #BFDBFE / #1D4ED8
emerald #D1FAE5 / #A7F3D0 / #047857
rose    #FFE4E6 / #FECDD3 / #BE123C
amber   #FEF3C7 / #FDE68A / #B45309
cyan    #CFFAFE / #A5F3FC / #0E7490
pink    #FCE7F3 / #FBCFE8 / #9D174D
indigo  #E0E7FF / #C7D2FE / #3730A3
green   #ECFDF5 / #D1FAE5 / #065F46
slate   #F1F5F9 / #E2E8F0 / #334155
```

### Type scale (reference)
- Eyebrow: JetBrains Mono, 13–14px, `letter-spacing:.18em`, uppercase, `--cx-purple`.
- H1 (hero): Space Grotesk 700, 56–86px, `letter-spacing:-.03em`, line-height ~1.05.
- H2 (section): Space Grotesk 700, 38–42px, `-.02em`.
- Card title: Space Grotesk 700, 19–22px.
- Body: DM Sans 400–500, 15–17px, line-height 1.55–1.7.

### Radii, shadows, motion
- Radius: cards 14–22px, pills & buttons `999px`.
- Card: `bg #fff; border 1px var(--cx-border); border-radius 16–18px;` soft shadow `0 8px 24px rgba(15,15,20,.05)`.
- Primary button: purple bg, white text, `999px`, shadow `0 10px 28px rgba(108,92,231,.25)`, hover → `--cx-purple-hover`.
- Secondary button: white bg, `1px var(--cx-border)`, hover border → purple.
- Emphasis gradient: `linear-gradient(135deg,#4338ca,#6c5ce7)`.

### ⚠️ Brand guardrails
- The **India tricolour accent** (`#FF9933 / #fff / #138808`) on the CampusX page is an **Independence-Day promo only**. Do **not** use it in the roadmap theme.
- Keep the roadmap calmer than the sales page — it's a reference/learning surface. Fewer badges, less urgency, more whitespace.

---

## 6. Component library (build once, reuse)

`Eyebrow`, `SectionHeader` (eyebrow + h2 + optional subhead), `Button` (primary/secondary), `Pill` (pastel + left-accent), `Card`, `NumberBadge` (circular level/step number), `StatBlock`, and roadmap-specific: `RoadmapMap`, `LevelNode`, `ModuleRow`, `ShipItCallout`, `LevelNav` (prev/next), `PhaseBand`, `ProgressDots`.

---

## 7. Visual-first mandate (this is the brief's core)

The roadmap must **read as a map, not an article**. Enforce these tactics:

- **Lead every level and the homepage with a visual**, not a paragraph. Text supports the graphic, never the reverse.
- Represent **session counts as bars/segments**, not sentences ("4 sessions" → a 4-segment meter).
- Render **skills/stack as pastel pills**, modules as **icon + title + count rows**, objectives behind a subtle expand (don't dump all objectives as body text).
- One **Lucide icon per module and per level** — consistent set, purple or phase-colored.
- Use the **phase colors** to band the journey so the eye groups 15 items into 6 chunks.
- Prefer **progress meters, node maps, and timelines** over prose blocks. If a section is >3 short paragraphs of running text, redesign it as a visual.
- Whitespace is a feature. Don't crowd.

---

## 8. Roadmap hero (homepage) spec

A single connected **path/track of 15 nodes** — vertical spine on desktop-narrow, or a winding/segmented track — grouped by the 6 phases with color bands. Each `LevelNode` shows: number, level title, a one-line outcome, a session-count meter, phase color, and completion state. Nodes are clickable → `/level/[n]`. Include a compact legend and a "start here / how it works" strip. This is the signature screen — invest here.

---

## 9. Level page spec (`/level/[n]`)

Structure, top to bottom:
1. **Level header** — phase eyebrow, big number + title, the `you can…` outcome, total-session meter, prerequisite pointer ("assumes Level n−1").
2. **Module map** — visual list of `ModuleRow`s (icon, name, session meter, expandable objectives).
3. **Stack** — pastel pills.
4. **Ship-it project** — a highlighted `ShipItCallout` (amber-accented, distinct from body).
5. **Related CampusX courses** — cross-links (see §10).
6. **LevelNav** — prev / next with titles, plus "back to map".

Keep each level page skimmable in ~20 seconds; depth lives behind expanders.

---

## 10. CampusX integration

- Persistent primary CTA to **CampusX One** (`#cxo-pricing` on the main site) — but soft, not salesy. Open external links in a new tab.
- On each level, **map to relevant CampusX One catalog items** as "learn this on CampusX" cards. Use the real catalog; mark unreleased ones "coming soon". Example mapping (extend per level, confirm against live catalog):
  - L0 → Python, Git & GitHub, SQL, Docker, Advanced FastAPI, Flask
  - L1 → GenAI using Gemini, Prompt Engineering
  - L3 → Prompt Engineering
  - L4 → Advanced RAG
  - L5 → LangGraph (notes), CrewAI, Agno, MCP (notes)
  - L6 → Context Engineering *(coming soon)*
  - L7 → LLM Evaluations *(coming soon)*
  - L8 → LLM Guardrails *(coming soon)*
  - L10 → LLMOps *(coming soon)*, Docker
  - L11 → DLCV
- Reuse CampusX voice/tokens so the handoff feels seamless.

---

## 11. Added considerations (my additions — apply these)

- **Progress tracking** — `localStorage`: mark levels complete, show a "you're on Level n" resume state and overall % on the map. (This is a real site, so browser storage is fine.)
- **Deep-linkable + navigable** — clean `/level/[n]` routes, prev/next, and a **sticky level navigator** (mini-map) so learners never feel lost across 15 levels.
- **Sequence & prerequisites are visible** — every level states what it assumes; the map makes "don't skip" obvious. The ordering is the value proposition.
- **Time-to-complete** — surface per-level and cumulative session counts as meters; optionally a total ("~215 sessions") on the homepage.
- **Accessibility (WCAG AA)** — check contrast on pastel pills (darken text if needed), full keyboard nav, visible focus rings, alt text, and honor `prefers-reduced-motion` (disable scroll/flow animations).
- **SEO** — per-level `<title>`/meta/canonical, Open Graph + a branded share image per level, sitemap, semantic headings. This page will be shared publicly.
- **Performance** — static-first, lazy-load images, no layout shift, minimal JS, subset/`display=swap` fonts. Target fast LCP on mobile (India-heavy, mobile-first audience).
- **Mobile-first** — design the map for a ~380px viewport first; it must be as legible on phone as desktop.
- **Consistent iconography** — one icon set (Lucide), one weight. No emoji as primary UI (the sales page uses some; keep this surface cleaner).
- **Analytics hooks** — fire events on level view, module expand, and CampusX CTA click, so funnel performance is measurable.
- **Don't over-animate** — subtle reveals only; the map should feel calm and authoritative, not busy.
- **Graceful gaps** — if a `.txt` lacks a field, degrade cleanly and leave a visible TODO in the parsed data rather than inventing content.
- **404 + favicon + share image** — basic polish; branded, on-theme.

---

## 12. Do / Don't

**Do:** match CampusX tokens precisely · lead with visuals · keep levels skimmable · source all content from the `.txt` files · make the sequence unmistakable · cross-link to CampusX courses.

**Don't:** use the Independence-Day tricolour · write paragraph-heavy level pages · invent level content · hardcode raw `.txt` reads at runtime · over-animate · break contrast with pale pills · ship a desktop-only map.

---

## 13. Definition of done

- All 15 levels parsed into typed data and rendered.
- Homepage map communicates the full path + phases at a glance, on mobile and desktop.
- Every level page: header, visual module map, stack pills, ship-it callout, CampusX cross-links, prev/next.
- Progress persists; sticky navigator works; deep links work.
- On-brand, AA-accessible, fast, reduced-motion-safe, SEO-complete.