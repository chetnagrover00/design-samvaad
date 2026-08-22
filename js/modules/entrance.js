import { prefersReducedMotion } from './motion.js';

/**
 * Staged entrance.
 *
 * `is-ready`   — releases the CSS entrance transitions.
 * `is-settled` — set once those transitions have finished, which is what
 *                lets the truck's idle bob start without fighting them.
 *
 * The hero starts at `opacity: 0` so it can fade in, which means
 * `is-ready` is load-bearing: without it the page renders blank. A
 * rAF alone is not safe enough — browsers pause rAF in background
 * tabs, so a page opened in a new tab could sit invisible. The rAF
 * gives a clean first frame when it can; the timeout guarantees the
 * content appears either way.
 */
const SETTLE_MS = 2200;
const FAILSAFE_MS = 400;

export function initEntrance(root = document.body) {
  const reveal = () => root.classList.add('is-ready');

  const start = () => {
    requestAnimationFrame(reveal);
    setTimeout(reveal, FAILSAFE_MS);
    setTimeout(
      () => root.classList.add('is-settled'),
      prefersReducedMotion() ? 0 : SETTLE_MS
    );
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
