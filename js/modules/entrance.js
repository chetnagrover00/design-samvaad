import { prefersReducedMotion } from './motion.js';

/**
 * Staged entrance.
 *
 * `is-ready`  — releases the CSS entrance transitions.
 * `is-settled` — set once those transitions have finished, which is what
 *                lets the truck's idle bob start without fighting them.
 */
const SETTLE_MS = 2200;

export function initEntrance(root = document.body) {
  const start = () => {
    requestAnimationFrame(() => root.classList.add('is-ready'));
    setTimeout(
      () => root.classList.add('is-settled'),
      prefersReducedMotion() ? 0 : SETTLE_MS
    );
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
