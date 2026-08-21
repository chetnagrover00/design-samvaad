/**
 * Mobile navigation toggle.
 * Keeps aria-expanded and aria-label in step with the visual state, and
 * closes the panel once a link inside it is followed.
 */
export function initNav({ toggle, links }) {
  if (!toggle || !links) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') setOpen(false);
  });
}
