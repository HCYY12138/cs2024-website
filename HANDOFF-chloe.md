# Handoff: Chloe's 3 pages -> CSS

Reference for styling these pages. CSS lives in `styles/site.css` (Yee Ann's file, with Chloe's section appended). The
HTML has no inline styles and no `<style>`; every hook is a BEM class, a state class, or a data-attribute. Feel: Yee
Ann's colours and buttons, with subtle glass panels.

## Status (4 Nov)
Done on `chloe`, uncommitted:
- Brought `styles/site.css` and `images/ear-mark.png` over from `yeeann`; other `yeeann` files were not brought over.
- All 3 pages link `styles/site.css`, use `ear-mark.png` as the logo (incl. JSON-LD on contact), and link `faq-reviews.html`.
- Chloe's rules are appended under the "Chloe's pages" comment. Yee Ann's rules above it are unchanged.

Decisions:
- Keep the BEM class names; do not rename to Yee Ann's. Shared parts repeat Yee Ann's look under these names:
  `.btn--primary` = `.button.dark`, `.btn--secondary` = `.button.light`, `.link-arrow` = `.text-link`,
  `.navbar*` = `.nav`/`.brand`, `.site-footer` = `.footer`.
- Do not edit Yee Ann's rules or pages; add to the end of `site.css` only, scoped to classes on these pages.
- `.glass` stays subtle translucent. A faint gradient on `.main` makes it visible; remove that rule if unwanted.

Next:
- Not viewed in a browser yet: check all 3 pages at desktop and phone widths, especially spacing and text on glass.
- Swatch colours (`.swatch--*`) are estimates: compare with the product photos.
- `git fetch` could not sign in, so `yeeann` was as last downloaded: check for newer `site.css` changes before merging.
- Yee Ann to fix: `index.html` uses `assets/ear-mark.png` and `assets/sleepbuds-concept.png`, but the files are in `images/`.

## Files
- `product-detail.html` - Loop Dream product page (hero + gallery, sound demo, how-it-works story, compare table)
- `product-guide.html` - fit guide: wearing steps, tip-size finder, removal, 3 nights, care, replacing tips
- `contact.html` - quick-help cards, contact form, contact details
- `js/main.js` - one vanilla file, loaded with `defer` on every page; each feature runs only if its elements exist
- links `styles/site.css`

## Shared pieces (same markup on every page)
Header and footer are copy-paste identical. Only `aria-current="page"` moves (header link or CTA, and footer link).
- `.skip-link` - first focusable element; visually hidden until focused
- `.site-header` - sticky wrapper (`data-site-header`); gets `.is-scrolled`
- `.navbar` (+ `.glass`) - `__logo`, `__logo-img`, `__logo-text`, `__toggle`, `__toggle-icon`, `__toggle-label`,
  `__menu`, `__links`, `__item`, `__link`, `__cta`
  - Desktop: logo left, links centred, CTA right. Phone: logo, then Menu button, then CTA at the far right
    (keeps focus order = visual order), `__menu` drops down under the bar.
  - Style `[aria-current="page"]` as the active link.
- `.btn` - `--primary` (one filled per screen), `--secondary`, `--buy`; `__hint` = the small "opens Shopee Mall" text
- `.site-footer` - `__inner`, `__legal`
- `.newsletter` (+ `.glass`) - `__title`, `__text`, `__form`
- `.footer-nav` - `__title`, `__list`, `__item`, `__link`
- `.form` - `__field`, `__field--check`, `__label`, `__check-label`, `__input`, `__select`, `__textarea`,
  `__checkbox`, `__hint`, `__optional`, `__error`, `__status`, `__submit`, `__noscript`
- `.glass` - modifier for translucent panels (cards, nav, buy bar). Keep text contrast on top of whatever shows through.
- `.visually-hidden` - screen-reader-only text (used in the compare table header)
- `.link-arrow` - text link that leads somewhere ("Read all FAQs")
- `[data-reveal]` - sections that fade in on scroll (see states)

## product-detail.html blocks
- `.breadcrumb` - `__list`, `__item`, `__link`
- `.product-hero` - two columns on desktop: `__gallery` (sticky while the panel scrolls) and `__panel`
- `.gallery` - `__stage`, `__main`, `__thumbs`, `__thumb-item`, `__thumb` (`[aria-current="true"]` = shown), `__thumb-img`
- `.buy-panel` (+ `.glass`) - `__eyebrow`, `__title` (the h1), `__lead`, `__facts`, `__fact`, `__actions`, `__sizes`, `__deal`
- `.award` - the SleepTech 2024 Award fact item
- `.swatches` - `__legend`, `__current`, `__options`; `.swatch` - `--black|--blue|--lilac|--peach`, `__input`, `__dot`, `__name`
  - Keep `__name` visible (colour is never the only signal); style `__input:checked + .swatch__dot` and focus-visible.
- `.price` - `__amount`, `__currency`, `__note`
- `.trust-note` - `__title`, `__text` (Shopee Mall / lookalikes)
- `.expectations` - `__text`, `__title`, `__lead`, `__list`, `__item`
- `.sound-compare` (+ `.glass`) - the signature demo: `__caption`, `__title`, `__hint`, `__toggle`, `__btn`
  (`[aria-pressed="true"]` = playing), `__status`, `__tracks`, `__track`, `__label`, `__audio`, `__transcript`,
  `__transcript-toggle`. A segmented two-button switch fits well.
- `.story` - scroll-told how-it-works: `__intro`, `__eyebrow`, `__title`, `__lead`, `__visuals`, `__visual`,
  `__steps`, `__step` (+ `.glass`), `__step-title`, `__step-text`, `__more`
  - Desktop idea: `__visuals` sticky on one side, steps scroll past on the other; show the `__visual.is-active` one.
  - Without JS (no `.js` on html) show all visuals, or just the first.
- `.in-box` - `__media`, `__img`, `__text`, `__title`, `__list`, `__item` (+ `.glass`), `__note`
- `.compare` - `__title`, `__lead`, `__scroll` (focusable region; let only the table scroll sideways on phones),
  `__table`, `__caption`, `__col--featured` (Loop Dream column), `__footnote`
- `.stories` - `__title`, `__list`, `__item`; `.testimonial` (+ `.glass`) - `__quote`, `__cite`
- `.faq-teaser` - `__title`, `__list`, `__item` (`<details>`), `__question` (`<summary>`), `__answer`, `__more`
- `.buy-bar` (+ `.glass`) - sticky bottom bar, phones only: `__info`, `__name`, `__price`, `__sizes`, `__btn`

## product-guide.html blocks
- `.guide-hero` - `__eyebrow`, `__title`, `__lead`, `__actions`
- `.guide-nav` (+ `.glass`) - sticky in-page nav: `__list`, `__item`, `__link` (`.is-active` / `[aria-current="location"]`)
  - On phones: one row that scrolls sideways inside itself, never the page.
- `.guide-section` - `--wear`, `--removal`, `--care`; `__title`, `__lead`, `__media`, `__img`
- `.steps` - numbered cards: `--compact` (removal, no images); `__item` (+ `.glass`), `__media`, `__img`, `__title`, `__text`
- `.video-slot` (+ `.glass`) - `__video`, `__caption`; reserve 16:9 space (`aspect-ratio`)
- `.tip-finder` - `__form` (+ `.glass`), `__question` (fieldset; `.is-invalid`), `__legend`, `__option`, `__submit`,
  `__result` (+ `.glass`; `.is-visible` once answered), `__result-body`, `__result-title`, `__size`, `__why`,
  `__fallbacks`, `__rules`, `__rules-title`, `__rules-list`
  - Options are radios inside labels: make each label a big tappable row (44px+), with a clear checked state.
- `.three-nights` - `__card` (+ `.glass`), `__title`, `__lead`, `__list`, `__night`, `__night-title`
- `.care-steps` - `__item` (+ `.glass`), `__title`
- `.replace` - `__card` (+ `.glass`), `__lead`, `__signs`, `__timing`, `__remind`
- `.cta-band` (+ `.glass`) - `__title`, `__text`

## contact.html blocks
- `.contact-hero` - `__title`, `__lead`
- `.quick-help` - `__title`, `__list`, `__item`; `.help-card` (+ `.glass`) - `__title`, `__link` (make the whole card
  clickable with a stretched `::after` on the link), `__hint`, `__text`
- `.contact` - two columns on desktop: `__form-wrap` (+ `.glass`), `__title`, `__note`
- `.contact-form` - uses the `.form` elements above
- `.contact-details` (+ `.glass`) - `__title`, `__list`, `__row`, `__term`, `__value`, `__hint`

## State classes and attributes set by main.js
| Hook | On | Meaning |
| --- | --- | --- |
| `.no-js` -> `.js` | `<html>` | JS ran. Hide/animate things only under `.js` so no-JS users see everything. |
| `.is-scrolled` | `.site-header` | page scrolled > 8px: firmer glass, shadow |
| `.is-open` | `#site-menu` and `.navbar` | phone menu open (`aria-expanded="true"` on `.navbar__toggle`) |
| `hidden` removed | `.navbar__toggle`, `[data-sound-controls]` | JS-only controls appear |
| `.is-visible` | `[data-reveal]` | entered the viewport. Hide only `.js [data-reveal]:not(.is-visible)`. |
| `.is-active` | `.story__step`, `.story__visual` | step in the middle of the screen |
| `data-active-step="1-4"` | `[data-story]` | same, for CSS selectors on the section |
| `aria-current="true"` | `.gallery__thumb` | thumbnail being shown |
| `aria-pressed`, `data-playing` | `.sound-compare__btn`, `[data-sound]` | which clip plays (`before`, `after`, `none`) |
| `.is-active`, `aria-current="location"` | `.guide-nav__link` | section in view |
| `.is-invalid`, `aria-invalid="true"` | form fields, `.tip-finder__question` | show error border + message |
| `.is-submitted`, `.is-success` | `form[data-validate]` | tried to submit / success message shown in `.form__status` |
| `.is-visible`, `inert` removed | `.buy-bar` | hero buy panel scrolled away |
| `.has-buy-bar` | `<html>` | bar showing: add bottom padding so it never covers content or focus |

## Notes for the CSS
- Motion: one signature moment (the story or the sound switch); reveals in reading order. Animate only
  `opacity` and `transform`. Under `prefers-reduced-motion: reduce` JS shows everything at once; keep CSS fades
  gentle or off, and use `scroll-behavior: smooth` only inside `prefers-reduced-motion: no-preference`.
- Sticky things (header, guide nav, buy bar) must not hide focused elements: set `scroll-padding-top` (header +
  guide nav) and `scroll-padding-bottom` when `.has-buy-bar`; respect `env(safe-area-inset-bottom)` on the bar.
- Use a named z-index scale (e.g. 10 raised, 20 sticky, 30 menu, 50 modal), no 9999.
- `.no-js .buy-bar { display: none }`; `.js .buy-bar` hidden off-screen until `.is-visible`; hide on desktop.
- Phones: reflow at 320px, no sideways page scroll (only `.compare__scroll` and `.guide-nav` scroll inside),
  inputs 16px, touch targets 44px, visible focus on every control (incl. swatches, radios, summary).
- `.glass` over photos: test text contrast on the busiest part of the image.
- Images carry `width`/`height`; set `max-width: 100%; height: auto` and `aspect-ratio` on media slots.

## Open decisions (team)
- Two filled buttons on one screen on product-detail: the header `.navbar__cta` and the hero Buy now. Suggest
  styling `.navbar__cta[aria-current="page"]` as an outline so Buy now stays the only filled button there.
- "Sleepbuds" (nav "Why Sleepbuds", CTA "Shop Sleepbuds") is Ozlo's product name. Consider "Why Loop Dream" /
  "Shop Loop Dream"; if changed, update the header on every page.
- Teammates: copy the header and footer (with the newsletter) from any of these 3 pages so all 9 pages match;
  move `aria-current="page"` to your own page's links.
- Nav and footer link to teammate pages. `index.html`, `why-choose-us.html` and `faq-reviews.html` exist on `yeeann`
  but not yet on `chloe`; `shop.html`, `privacy-policy.html` and `our-story.html` do not exist on any branch.

## Images
- `images/product/` - 10 official Loop Dream photos from loopearplugs.com (1000px; colour heroes `dream-<colour>-1.png`).
- `images/ear-mark.png` - Yee Ann's logo, used in the header on all 3 pages.
- `images/logo-placeholder.svg` - old dashed "Somnus" box; no longer used, safe to delete.

## PLACEHOLDER list (search the HTML for `PLACEHOLDER`)
- Audio `audio/snoring-before.mp3`, `audio/snoring-after.mp3` + rewrite the transcript to match
- Videos `video/how-to-wear.mp4`, `video/removal.mp4`, posters in `images/guide/`, captions `.vtt`
- Guide step photos `images/guide/step-1-pick-tip.jpg`, `step-2-open-ear.jpg`, `step-3-insert.jpg`, `step-5-check-seal.jpg`
- Shipping fee / final total on the Shopee listing; colours in stock; authorised-seller status
- Which tip size ships pre-fitted; whether a fit card is in the box
- Alarm claim (from the brief, untested); 3-night plan; wearing, removal and cleaning steps vs Loop's instructions
- Tip-finder sizing logic (rule of thumb, not Loop's official sizing)
- Replacement interval (3-6 months is an estimate) and the replacement-tip product link
- Electronic earbuds: side-comfort and dB cells in the compare table
- 3 testimonials (real, consented quotes only; no ratings or review counts)
- Contact details: hello@somnus.sg, WhatsApp +65 0000 0000, address, reply time (page + JSON-LD)
- Forms are front end only: connect a form/email service before launch
