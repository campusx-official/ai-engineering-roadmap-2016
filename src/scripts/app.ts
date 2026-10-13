/**
 * The site's entire client runtime: deep links into collapsed modules, scroll
 * reveals and analytics hooks. Everything degrades to a working
 * static page if this never executes.
 */

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
/* deep links into collapsed modules                                   */
/* ------------------------------------------------------------------ */

/** A link to /level/1/#m1-3 should land on that module already expanded. */
function openHashTarget(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (el instanceof HTMLDetailsElement && !el.open) el.open = true;
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
  openHashTarget();
  window.addEventListener('hashchange', openHashTarget);
  initReveals();
  initTracking();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

export {};
