/**
 * Gallery lightbox.
 *
 * Uses a native <dialog>, so focus trapping, Esc-to-close and the
 * top-layer stacking come from the platform rather than from us.
 * Arrow keys step through the set; the trigger that opened it gets
 * focus back on close.
 */
export function initLightbox({ gallery, dialog }) {
  if (!gallery || !dialog || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector('.lightbox__img');
  const triggers = [...gallery.querySelectorAll('.gallery__btn')];
  let index = 0;

  const show = (i) => {
    index = (i + triggers.length) % triggers.length;
    const source = triggers[index].querySelector('.gallery__img');
    img.src = source.currentSrc || source.src;
    img.alt = source.alt;
  };

  triggers.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lightbox__nav--next').addEventListener('click', () => show(index + 1));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Clicking the backdrop (i.e. outside the figure) closes it
  dialog.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox__figure, .lightbox__nav, .lightbox__close')) dialog.close();
  });

  dialog.addEventListener('close', () => triggers[index]?.focus());
}
