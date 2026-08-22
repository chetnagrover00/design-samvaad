/* ============================================================
   Design Samvaad 4.0 — entry point
   Wires DOM nodes to behaviour modules. All logic lives in
   ./modules; this file only decides what gets wired to what.
   ============================================================ */
import { initEntrance } from './modules/entrance.js';
import { initNav }      from './modules/nav.js';
import { initHorn }     from './modules/horn.js';
import { initStickyNav } from './modules/sticky-nav.js';
import { initLightbox }  from './modules/lightbox.js';

initEntrance(document.body);

initStickyNav(document.getElementById('nav'), {
  hero: document.querySelector('.hero'),
});

initNav({
  toggle: document.getElementById('navToggle'),
  links:  document.getElementById('navLinks'),
});

initHorn({
  button: document.getElementById('hornBtn'),
  truck:  document.getElementById('truck'),
  burst:  document.getElementById('hornBurst'),
});

initLightbox({
  gallery: document.getElementById('gallery-grid'),
  dialog:  document.getElementById('lightbox'),
});
