/**
 * Gives the fixed nav a background once the page scrolls under it.
 *
 * The bar is transparent at rest because it sits on the dark hero. If
 * there is no hero to sit on — a different landing page, or the hero
 * removed — it starts with its background on rather than rendering
 * cream text onto a cream section.
 *
 * The listener is passive and the class is only written when the state
 * actually flips, so scrolling stays cheap.
 */
const THRESHOLD = 24;   // px of scroll before the bar takes on a ground

export function initStickyNav(nav, { hero, threshold = THRESHOLD } = {}) {
  if (!nav) return;

  // Nothing dark behind it: keep the ground permanently.
  if (!hero) {
    nav.classList.add('is-stuck');
    return;
  }

  let stuck = null;

  const update = () => {
    const next = window.scrollY > threshold;
    if (next === stuck) return;
    stuck = next;
    nav.classList.toggle('is-stuck', next);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}
