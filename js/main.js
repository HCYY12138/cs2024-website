/*
 * Somnus - main.js
 * Vanilla JS, no libraries. Progressive enhancement: every page works without
 * this file. Each feature first checks that its elements exist, so the same
 * file can load on every page.
 * State classes it toggles: .js / .no-js (on <html>), .is-open, .is-scrolled,
 * .is-visible, .is-active, .is-invalid, .is-success. See HANDOFF-chloe.md.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* 1. Mobile nav toggle: button opens/closes #site-menu; Esc closes and
        returns focus to the button. CSS hides the menu on phones only under .js. */
  (function mobileNav() {
    var toggle = $('.navbar__toggle');
    var menu = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
    if (!toggle || !menu) return;
    var navbar = toggle.closest('.navbar');
    toggle.hidden = false;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      if (navbar) navbar.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    // Close after choosing a link (also covers same-page anchors).
    $$('a', menu).forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
  })();

  /* 2. Header on scroll: .is-scrolled once the page moves, so CSS can
        strengthen the glass header (shadow / more opaque background). */
  (function headerScroll() {
    var header = $('[data-site-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* 3. Reveal on scroll: [data-reveal] gets .is-visible when it enters the
        viewport. Reduced motion or no IntersectionObserver: show everything now. */
  (function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduceMotion || !hasIO) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* 4. "How it works" story: the step in the middle of the screen gets
        .is-active, and the matching [data-story-visual] gets .is-active too.
        [data-story] carries data-active-step for CSS. State only, no motion. */
  (function story() {
    var storyEl = $('[data-story]');
    if (!storyEl || !hasIO) return;
    var steps = $$('[data-story-step]', storyEl);
    var visuals = $$('[data-story-visual]', storyEl);
    if (!steps.length) return;

    function activate(n) {
      storyEl.setAttribute('data-active-step', n);
      steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-story-step') === n); });
      visuals.forEach(function (v) { v.classList.toggle('is-active', v.getAttribute('data-story-visual') === n); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target.getAttribute('data-story-step'));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    activate(steps[0].getAttribute('data-story-step'));
  })();

  /* 5. Gallery + colour swatches: thumbnails are real links to the image
        (work without JS); with JS they swap the main image instead. Colour
        radios swap the main image and update the "Colour:" label. */
  (function gallery() {
    var galleryEl = $('[data-gallery]');
    var main = galleryEl && $('[data-gallery-main]', galleryEl);
    if (!main) return;
    var thumbs = $$('[data-gallery-thumb]', galleryEl);

    function show(src, alt) {
      main.src = src;
      if (alt) main.alt = alt;
    }
    function markThumb(active) {
      thumbs.forEach(function (t) {
        if (t === active) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
    }
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function (e) {
        e.preventDefault();
        show(thumb.getAttribute('href'), thumb.getAttribute('data-alt'));
        markThumb(thumb);
      });
    });

    var swatches = $('[data-swatches]');
    if (!swatches) return;
    var label = $('[data-colour-label]', swatches);
    $$('input[type="radio"]', swatches).forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        show(radio.getAttribute('data-src'), radio.getAttribute('data-alt'));
        if (label) label.textContent = radio.value;
        // Mark the matching thumbnail if there is one, otherwise clear.
        markThumb(thumbs.filter(function (t) { return t.getAttribute('href') === radio.getAttribute('data-src'); })[0] || null);
      });
    });
  })();

  /* 6. Before/after sound toggle: two buttons switch between the two clips,
        keeping the playback position. The native <audio> players stay as the
        no-JS fallback. Never autoplays; a second press on the playing clip pauses. */
  (function soundToggle() {
    var box = $('[data-sound]');
    if (!box) return;
    var controls = $('[data-sound-controls]', box);
    var status = $('[data-sound-status]', box);
    var tracks = {
      before: $('[data-sound-track="before"]', box),
      after: $('[data-sound-track="after"]', box)
    };
    var buttons = $$('[data-sound-btn]', box);
    if (!controls || !tracks.before || !tracks.after || !buttons.length) return;
    controls.hidden = false;

    var names = { before: 'snoring without earplugs', after: 'snoring with Loop Dream' };
    function say(msg) { if (status) status.textContent = msg; }
    function press(which) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-sound-btn') === which));
      });
      box.setAttribute('data-playing', which || 'none');
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var which = btn.getAttribute('data-sound-btn');
        var other = which === 'before' ? 'after' : 'before';
        var track = tracks[which];
        if (!track.paused) { track.pause(); return; }
        var t = tracks[other].currentTime || 0;
        tracks[other].pause();
        try { track.currentTime = t; } catch (err) { /* not loaded yet */ }
        var p = track.play();
        if (p && p.catch) {
          p.catch(function () { press(null); say('Sorry, this sound clip is not available yet.'); });
        }
      });
    });
    // Keep buttons and status in sync with the native players too.
    Object.keys(tracks).forEach(function (key) {
      var track = tracks[key];
      track.addEventListener('play', function () {
        var other = tracks[key === 'before' ? 'after' : 'before'];
        if (!other.paused) other.pause();
        press(key);
        say('Playing: ' + names[key] + '.');
      });
      track.addEventListener('pause', function () {
        if (tracks.before.paused && tracks.after.paused) { press(null); say('Paused.'); }
      });
      track.addEventListener('ended', function () { press(null); say('Finished.'); });
    });
  })();

  /* 7. Tip-size finder: three radio questions -> a starting size (XS-L) and
        tip type, shown in an aria-live region. Logic is a rule of thumb (see the
        PLACEHOLDER in product-guide.html). */
  (function tipFinder() {
    var form = $('[data-tip-finder]');
    var result = $('[data-tip-result]');
    var body = result && $('[data-tip-result-body]', result);
    if (!form || !body) return;
    form.setAttribute('novalidate', '');

    var SIZES = ['XS', 'S', 'M', 'L'];
    var START = { small: 1, average: 2, large: 3, unsure: 2 };
    var NUDGE = { fallout: 1, sore: -1, fine: 0 };
    var TIPS = {
      comfort: { name: 'oval tips', why: 'The oval tip wraps memory foam in soft silicone, the softest option to lie on.' },
      seal: { name: 'double-stacked tips', why: 'The double-stacked tip gives a firmer seal against snoring.' }
    };

    function answer(name) {
      var picked = $('input[name="' + name + '"]:checked', form);
      return picked ? picked.value : null;
    }
    function setError(name, msg) {
      var input = $('input[name="' + name + '"]', form);
      var fieldset = input && input.closest('fieldset');
      if (!fieldset) return;
      var err = document.getElementById(fieldset.getAttribute('aria-describedby'));
      fieldset.classList.toggle('is-invalid', !!msg);
      if (err) err.textContent = msg || '';
    }

    form.addEventListener('change', function (e) {
      if (e.target.name) setError(e.target.name, '');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var canal = answer('canal'), past = answer('past'), priority = answer('priority');
      var missing = null;
      [['canal', canal], ['past', past], ['priority', priority]].forEach(function (q) {
        if (!q[1]) {
          setError(q[0], 'Choose an answer to this question.');
          if (!missing) missing = q[0];
        }
      });
      if (missing) {
        $('input[name="' + missing + '"]', form).focus();
        return;
      }

      var i = Math.max(0, Math.min(SIZES.length - 1, START[canal] + NUDGE[past]));
      var tip = TIPS[priority];
      var why = tip.why;
      if (past === 'fallout') why += ' One size up helps if plugs usually work loose.';
      if (past === 'sore') why += ' One size down eases pressure if plugs usually feel sore.';

      $('[data-tip-size]', body).textContent = SIZES[i];
      $('[data-tip-type]', body).textContent = tip.name;
      $('[data-tip-why]', body).textContent = why;
      body.hidden = false;
      result.classList.add('is-visible');
    });
  })();

  /* 8. Guide in-page nav: highlights the link for the section in view
        (aria-current="location" + .is-active). Links work as anchors without JS. */
  (function guideNav() {
    var nav = $('[data-guide-nav]');
    if (!nav || !hasIO) return;
    var links = $$('a[href^="#"]', nav);
    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) { map[target.id] = link; sections.push(target); }
    });
    if (!sections.length) return;

    function activate(id) {
      links.forEach(function (link) {
        var on = map[id] === link;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* 9. Form validation (contact + newsletter): any form[data-validate].
        Checks on blur and on submit, writes each error under its field, keeps
        what was typed, focuses the first invalid field. Front end only: no
        network request; success text comes from data-success. */
  (function forms() {
    var formsList = $$('form[data-validate]');
    if (!formsList.length) return;

    // Preselect the enquiry topic from ?topic=sizing (links from the guide).
    var topicSelect = document.getElementById('contact-topic');
    if (topicSelect && window.URLSearchParams) {
      var topic = (new URLSearchParams(window.location.search).get('topic') || '').replace(/[^a-z]/g, '');
      if (topic && $('option[value="' + topic + '"]', topicSelect)) {
        topicSelect.value = topic;
      }
    }

    function messageFor(field) {
      var v = field.validity;
      if (v.valueMissing) return field.getAttribute('data-error-required') || 'Fill in this field.';
      if (v.typeMismatch) return field.getAttribute('data-error-type') || 'Check the format of this field.';
      if (v.tooShort) return field.getAttribute('data-error-short') || 'Add a little more detail.';
      if (field.value && field.value.trim() === '' && field.required) {
        return field.getAttribute('data-error-required') || 'Fill in this field.';
      }
      return '';
    }
    function check(field) {
      var msg = messageFor(field);
      var err = document.getElementById(field.id + '-error');
      field.classList.toggle('is-invalid', !!msg);
      if (msg) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      if (err) err.textContent = msg;
      return !msg;
    }

    formsList.forEach(function (form) {
      form.setAttribute('novalidate', '');
      var fields = $$('input, select, textarea', form).filter(function (f) {
        return f.type !== 'submit' && f.type !== 'button';
      });
      var status = $('[data-form-status]', form);

      fields.forEach(function (field) {
        field.addEventListener('blur', function () {
          // Only nag once the user has typed something or tried to submit.
          var typed = field.type !== 'checkbox' && field.value;
          if (typed || form.classList.contains('is-submitted')) check(field);
        });
        field.addEventListener('change', function () {
          if (field.classList.contains('is-invalid')) check(field);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.classList.add('is-submitted');
        if (status) { status.textContent = ''; form.classList.remove('is-success'); }
        var firstBad = null;
        fields.forEach(function (field) {
          if (!check(field) && !firstBad) firstBad = field;
        });
        if (firstBad) { firstBad.focus(); return; }

        // PLACEHOLDER: no backend yet. Values are not logged or sent anywhere.
        form.reset();
        form.classList.remove('is-submitted');
        form.classList.add('is-success');
        if (status) status.textContent = form.getAttribute('data-success') || 'Thanks, done.';
      });
    });
  })();

  /* 10. Sticky buy bar (product page, phones): visible once the hero buy panel
         has scrolled above the viewport; hidden (and inert) while it is in view. */
  (function buyBar() {
    var bar = $('[data-buy-bar]');
    var anchor = $('[data-buy-anchor]');
    if (!bar || !anchor || !hasIO) return;
    function setVisible(on) {
      bar.classList.toggle('is-visible', on);
      if (on) bar.removeAttribute('inert');
      else bar.setAttribute('inert', '');
      root.classList.toggle('has-buy-bar', on);
    }
    var io = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(anchor);
  })();
})();
