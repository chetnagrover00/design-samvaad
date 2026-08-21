# Design Samvaad 4.0 — Website

Marketing site for Design Samvaad Edition 4.0, run by **GDG Noida**.
Plain HTML, CSS and JavaScript — no framework, no build step.

Visual language follows the *Design Samvaad 2026 Brand Identity* deck:
**Desi Maximalism** — Indian truck art, layered ornament, bilingual type.

---

## Running it

```bash
cd "Design Samvaad" && python3 -m http.server 4747
```

Then open <http://localhost:4747>.

> Port **4747** is this project's own, so it can run alongside other
> local projects. Avoid `4321` (Astro's default) and `5000` (taken by
> macOS Control Center).

---

## Structure

```
index.html              markup — one page, five sections
css/
  main.css              entry point: @layer order + @imports
  tokens.css            design tokens — the single source of truth
  base.css              reset, document defaults, reduced-motion
  layout.css            shared measures (.wrap)
  components/           reusable, section-agnostic
  sections/             page-level composition
js/
  main.js               entry point — wires DOM to modules
  modules/              behaviour, one concern per file
Assets/                 optimised brand artwork (originals gitignored)
Speakers/               optimised speaker posters (originals gitignored)
variants/               alternative footer designs, kept for reference
```

### Cascade layers

`main.css` declares the order up front:

```css
@layer tokens, base, layout, components, sections;
```

A section rule always beats a component rule regardless of selector
specificity, so section overrides never need `!important` or selector
inflation to win.

---

## Design tokens

Everything lives in `css/tokens.css`. **Nothing outside that file should
hardcode a colour, radius, shadow or duration.** If a value is needed
twice, it becomes a token.

| Group | Examples |
|---|---|
| Brand palette | `--green` `--red` `--pink` `--blue` `--yellow` `--cream` `--ink` |
| Surfaces | `--surface-page` `--surface-raised` `--surface-asphalt` |
| Ink | `--ink-on-dark` `--ink-on-light` `--ink-bright` |
| Dusk scene | `--sky-top` `--sky-blue` `--glow` `--glow-warm` |
| Radius | `--radius-sm` … `--radius-2xl` `--radius-pill` |
| Elevation | `--shadow-card` `--shadow-poster` `--shadow-panel` |
| Layout | `--nav-h` `--gutter` `--measure-wide` `--measure-text` |
| Motion | `--ease` `--dur-fast` `--dur-base` `--dur-entrance` |

Two measures exist deliberately: the hero and footer use
`--measure-wide` so the two ends of the page line up, while content
sections use the narrower `--measure-text`.

### Palette note

The brand deck (pg 09) lists Electric Pink as `#FFD60A` — that's a
copy-paste of the yellow swatch. `--pink` is sampled from the printed
swatch instead. **Worth confirming the intended value.**

---

## Naming

BEM throughout: `.block`, `.block__element`, `.block--modifier`.
State classes are `.is-*` (`.is-ready`, `.is-open`, `.is-blaring`) and
are toggled by JavaScript, never styled directly by it.

---

## Components

| Component | Purpose |
|---|---|
| `button` | `.btn` with `--solid` / `--ghost` / `--outline` / `--lg` |
| `nav` | fixed bar — transparent over the hero, `.is-stuck` once scrolled |
| `section-head` | running head + dotted rule, from the deck's slides |
| `truck` | hero truck, dissolve mask and scene-light tint |
| `horn` | horn pill and the "पों पों!" burst |
| `bubble` | chat bubbles with tails |
| `dialogue` | About scene — miniature + bubbles + truck-art bands |
| `milestone` | Editions kilometre stones |
| `road` | full-bleed asphalt with lane markings |
| `speaker-card` | speaker posters + "more coming" tile |
| `tailgate` | the painted board that forms the whole footer |
| `footer-cols` | footer link columns and socials |

---

## JavaScript

ES modules, loaded with `<script type="module">`. No bundler.

| Module | Responsibility |
|---|---|
| `motion.js` | reduced-motion preference — asked in one place |
| `entrance.js` | staged entrance (`is-ready` → `is-settled`) |
| `nav.js` | mobile menu, keeps ARIA in step |
| `horn.js` | Web Audio air horn + replayable CSS animations |
| `sticky-nav.js` | gives the fixed nav a ground once the page scrolls |

The horn is **synthesised**, not an audio file — a detuned sawtooth
chord through a lowpass. Costs no bytes and can't 404.

---

## Assets

Source artwork is large; optimised derivatives are committed alongside.

| Original | Serve | Note |
|---|---|---|
| `truck.png` (20 MB) | `truck-w1200/1600/2200.png` | responsive `srcset` |
| — | `truck-mask.png` | 241 KB silhouette for the tint mask |
| `Sakhi Talks.jpg` | `sakhi-talks.jpg` | clean filename for URLs |
| `Speakers/DST*.png` (2.3 MB) | `Speakers/*.jpg` (~250 KB) | ~90% smaller |

**Source originals are not committed** — they total 206 MB and one
exceeds GitHub's 100 MB file limit. They are listed in `.gitignore`;
keep them in your own storage. Only the optimised files the site
actually loads are in the repo (~8 MB).

Regenerate an optimised poster with:

```bash
sips -s format jpeg -s formatOptions 82 -Z 1200 --out out.jpg in.png
```

**Paths in CSS are relative to the CSS file**, so component and section
files reference `../../Assets/…`.

---

## Cache busting

`index.html` links `css/main.css?v=N` and `js/main.js?v=N`. **Bump `N`
when you change CSS or JS**, otherwise browsers serve a stale copy —
stylesheets are cached separately from HTML, so a normal reload often
won't pick up changes.

---

## Before this goes live

- [ ] Confirm the 2026 speaker lineup; current posters are from a past edition
- [ ] Fix "Ambassdor" typo baked into a speaker poster's artwork
- [ ] Confirm rights for `sakhi-talks.jpg` — the painting is old enough to be
      public domain, but the photograph of it may not be
- [ ] Confirm the Electric Pink hex (see Palette note)

### Production

`@import` loads ~20 stylesheets serially. For production, concatenate:

```bash
npx lightningcss --bundle --minify css/main.css -o css/build.css
```

…then point `index.html` at `css/build.css`.
