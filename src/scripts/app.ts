/**
 * The site's entire client runtime: progress tracking, the complete/undo
 * toggle, scroll reveals and analytics hooks. Everything degrades to a working
 * static page if this never executes.
 */

const STORE_KEY = 'cxr.progress.v1';
const TOTAL_LEVELS = 15;

/* ------------------------------------------------------------------ */
/* analytics                                                           */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    dataLayer?: unknown[];
    cxrTrack?: (event: string, props?: Record<string, unknown>) => void;
  }
}

/** Vendor-neutral: pushes to dataLayer and emits a DOM event to hook into. */
function track(event: string, props: Record<string, unknown> = {}): void {
  const payload = { event: `cxr_${event}`, ...props };
  (window.dataLayer ||= []).push(payload);
  window.dispatchEvent(new CustomEvent('cxr:track', { detail: payload }));
}
window.cxrTrack = track;

/* ------------------------------------------------------------------ */
/* progress                                                            */
/* ------------------------------------------------------------------ */

function readProgress(): Set<number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < TOTAL_LEVELS),
    );
  } catch {
    // Private mode, disabled storage, corrupted value — progress is a nicety.
    return new Set();
  }
}

function writeProgress(done: Set<number>): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...done].sort((a, b) => a - b)));
  } catch {
    /* ignore */
  }
}

/** First level that is not yet done — where "resume" points. */
function resumeLevel(done: Set<number>): number | null {
  for (let n = 0; n < TOTAL_LEVELS; n++) if (!done.has(n)) return n;
  return null;
}

function applyProgress(done: Set<number>): void {
  // Node + mini-map completion state
  document.querySelectorAll<HTMLElement>('[data-level]').forEach((el) => {
    const n = Number(el.dataset.level);
    if (Number.isNaN(n)) return;
    el.toggleAttribute('data-done', done.has(n));
  });

  const resume = resumeLevel(done);

  // Resume marker on the map
  document.querySelectorAll<HTMLElement>('.node').forEach((el) => {
    el.toggleAttribute('data-resume', done.size > 0 && Number(el.dataset.level) === resume);
  });

  // Summary widgets
  const pct = Math.round((done.size / TOTAL_LEVELS) * 100);
  document.querySelectorAll<HTMLElement>('[data-progress-percent]').forEach((el) => {
    el.textContent = `${pct}%`;
  });
  document.querySelectorAll<HTMLElement>('[data-progress-count]').forEach((el) => {
    el.textContent = String(done.size);
  });
  document.querySelectorAll<HTMLElement>('[data-progress-bar]').forEach((el) => {
    el.style.width = `${pct}%`;
    const bar = el.closest<HTMLElement>('[role="progressbar"]');
    if (bar) {
      bar.setAttribute('aria-valuenow', String(done.size));
      bar.setAttribute('aria-valuetext', `${done.size} of ${TOTAL_LEVELS} levels complete`);
    }
  });

  // Resume / start CTA
  document.querySelectorAll<HTMLAnchorElement>('[data-resume-link]').forEach((el) => {
    const target = resume ?? TOTAL_LEVELS - 1;
    el.href = `/level/${target}/`;
    const label = el.querySelector('[data-resume-label]');
    if (label) {
      label.textContent =
        done.size === 0
          ? 'Start at Level 0'
          : resume === null
            ? 'Revisit Level 14'
            : `Resume at Level ${resume}`;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-progress-state]').forEach((el) => {
    el.dataset.progressState = done.size === 0 ? 'empty' : resume === null ? 'complete' : 'active';
  });

  // Complete/undo toggles
  document.querySelectorAll<HTMLButtonElement>('[data-complete-toggle]').forEach((btn) => {
    const n = Number(btn.dataset.level);
    const isDone = done.has(n);
    btn.setAttribute('aria-pressed', String(isDone));
    const text = btn.querySelector('[class*="done-text"]');
    if (text) text.textContent = isDone ? 'Completed' : 'Mark complete';
  });
}

function initProgress(): void {
  let done = readProgress();
  applyProgress(done);

  document.querySelectorAll<HTMLButtonElement>('[data-complete-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = Number(btn.dataset.level);
      if (Number.isNaN(n)) return;
      if (done.has(n)) done.delete(n);
      else done.add(n);
      writeProgress(done);
      applyProgress(done);
      track(done.has(n) ? 'level_complete' : 'level_uncomplete', { level: n });
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-progress-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      done = new Set();
      writeProgress(done);
      applyProgress(done);
      track('progress_reset');
    });
  });

  // Keep tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORE_KEY) return;
    done = readProgress();
    applyProgress(done);
  });
}

/* ------------------------------------------------------------------ */
/* scroll reveals                                                      */
/* ------------------------------------------------------------------ */

function initReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!targets.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ */
/* analytics wiring                                                    */
/* ------------------------------------------------------------------ */

function initTracking(): void {
  const page = document.body.dataset.page ?? 'unknown';
  const level = document.body.dataset.levelNumber;
  track('page_view', { page, ...(level ? { level: Number(level) } : {}) });

  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { value: el.dataset.trackData ?? null, page });
  });

  document.querySelectorAll<HTMLDetailsElement>('details[data-track-expand]').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) track(d.dataset.trackExpand!, { value: d.dataset.trackData ?? null, page });
    });
  });
}

/* ------------------------------------------------------------------ */

function boot(): void {
  initProgress();
  initReveals();
  initTracking();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

export {};
