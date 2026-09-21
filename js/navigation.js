/* Only disclosures and the project strip. The existing hamburger handler is retained. */
(() => {
  'use strict';
  const header = document.querySelector('.nav-component[data-nav-mega-header]');
  if (!header) return;
  const menu = header.querySelector('.nav-menu-wrapper');
  const desktop = matchMedia('(min-width: 992px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const items = [...header.querySelectorAll('[data-nav-mega]')].map(group => ({
    group,
    button: group.querySelector('.nav-mega-disclosure-button'),
    link: group.querySelector('.nav-link'),
    panel: header.querySelector('#' + group.dataset.navMega)
  })).filter(item => item.button && item.link && item.panel);
  if (!items.length) return;
  let active = null, openedBy = null, restoringFocus = false, closeTimer;
  const cancelClose = () => clearTimeout(closeTimer);
  const close = (restoreFocus = false) => {
    cancelClose();
    if (!active) return;
    const previous = active;
    previous.button.setAttribute('aria-expanded', 'false');
    previous.group.classList.remove('is-expanded');
    previous.panel.hidden = true;
    previous.panel.dispatchEvent(new Event('navigationclosed'));
    active = null;
    openedBy = null;
    header.classList.remove('nav-mega-open');
    if (restoreFocus) {
      restoringFocus = true;
      previous.button.focus();
      restoringFocus = false;
    }
  };
  const open = (item, cause) => {
    if (!desktop.matches) return;
    cancelClose();
    if (active === item) {
      if (cause === 'button' || cause === 'keyboard') openedBy = cause;
      return;
    }
    close();
    active = item;
    openedBy = cause;
    item.button.setAttribute('aria-expanded', 'true');
    item.group.classList.add('is-expanded');
    item.panel.hidden = false;
    header.classList.add('nav-mega-open');
    item.panel.dispatchEvent(new Event('navigationopened'));
  };
  const deferClose = item => {
    cancelClose();
    closeTimer = setTimeout(() => {
      if (active === item && !item.group.contains(document.activeElement) && !item.panel.contains(document.activeElement)) close();
    }, 220);
  };

  items.forEach(item => {
    item.button.hidden = !desktop.matches;
    item.button.addEventListener('click', () => {
      if (active === item && openedBy === 'button') close();
      else open(item, 'button');
    });
    item.group.addEventListener('pointerenter', event => {
      if (desktop.matches && event.pointerType === 'mouse') open(item, 'hover');
    });
    item.group.addEventListener('pointerleave', () => { if (desktop.matches) deferClose(item); });
    item.panel.addEventListener('pointerenter', cancelClose);
    item.panel.addEventListener('pointerleave', () => { if (desktop.matches) deferClose(item); });
    item.group.addEventListener('focusin', () => { if (desktop.matches && !restoringFocus) open(item, 'focus'); });
    [item.group, item.panel].forEach(area => area.addEventListener('focusout', () => {
      setTimeout(() => {
        if (active === item && !item.group.contains(document.activeElement) && !item.panel.contains(document.activeElement)) close();
      }, 0);
    }));
    item.group.addEventListener('keydown', event => {
      if (desktop.matches && event.key === 'ArrowDown') {
        event.preventDefault();
        open(item, 'keyboard');
        item.panel.querySelector('a,button:not([hidden])')?.focus();
      }
    });
  });
  header.querySelectorAll('.nav-link').forEach(link => {
    if (items.some(item => item.link === link)) return;
    link.addEventListener('pointerenter', event => { if (desktop.matches && event.pointerType === 'mouse') close(); });
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  }, true);
  document.addEventListener('pointerdown', event => { if (!header.contains(event.target)) close(); });

  const placePanels = () => {
    const focusedItem = items.find(item => item.button === document.activeElement || item.panel.contains(document.activeElement));
    close();
    items.forEach(item => {
      item.button.hidden = !desktop.matches;
      item.panel.hidden = true;
      if (item.panel.parentElement !== header) header.appendChild(item.panel);
    });
    if (!desktop.matches && focusedItem) focusedItem.link.focus({ preventScroll: true });
  };
  const measureHeader = () => header.style.setProperty('--nav-header-height', header.offsetHeight + 'px');
  placePanels();
  header.classList.add('nav-mega-enhanced');
  desktop.addEventListener('change', placePanels);
  window.addEventListener('resize', measureHeader, { passive: true });
  measureHeader();
  // Observe the original hamburger handler; do not install a second one.
  if (menu) new MutationObserver(() => {
    if (!desktop.matches && !menu.classList.contains('is-open')) close();
  }).observe(menu, { attributes: true, attributeFilter: ['class'] });

  header.querySelectorAll('[data-project-carousel]').forEach(panel => {
    const track = panel.querySelector('.nav-mega-project-track');
    const cards = [...panel.querySelectorAll('.nav-mega-project-card')];
    if (!track || !cards.length) return;
    // A second visual copy lets the strip wrap without a visible reset.
    // Only the original cards participate in keyboard/screen-reader navigation.
    const copies = cards.map(card => {
      const copy = card.cloneNode(true);
      copy.dataset.marqueeCopy = '';
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      copy.querySelectorAll('a').forEach(link => {
        link.tabIndex = -1;
        link.addEventListener('mousedown', event => event.preventDefault());
      });
      track.appendChild(copy);
      return copy;
    });
    let frame = null, lastTime = null, position = 0, lastWritten = 0;
    let hovering = false, touching = false, interactionTimer;
    const baseSpeed = 48; // Matches the logo strip's 0.8px/frame at 60Hz.
    let speed = baseSpeed;
    const step = () => cards.length > 1 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : track.clientWidth;
    const period = () => copies[0].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    const index = () => Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / Math.max(1, step()))));
    const stop = () => { cancelAnimationFrame(frame); frame = null; lastTime = null; };
    const canAnimate = () => desktop.matches && !panel.hidden && !document.hidden && !reducedMotion.matches && !touching && !panel.contains(document.activeElement);
    const animate = now => {
      if (!canAnimate()) { stop(); return; }
      const elapsed = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, .05);
      lastTime = now;
      // Keep subpixel progress even when the browser rounds scrollLeft.
      if (Math.abs(track.scrollLeft - lastWritten) > 2) position = track.scrollLeft;
      const target = baseSpeed * (hovering ? .55 : 1);
      speed += (target - speed) * (1 - Math.exp(-5 * elapsed));
      const width = period();
      if (width > 0) {
        position = (position + speed * elapsed) % width;
        track.scrollLeft = position;
        lastWritten = track.scrollLeft;
      }
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      stop();
      copies.forEach(copy => { copy.hidden = !desktop.matches || reducedMotion.matches; });
      position = track.scrollLeft;
      lastWritten = position;
      if (canAnimate() && cards.length > 3) frame = requestAnimationFrame(animate);
    };
    const scrollToCard = destination => {
      track.scrollTo({ left: destination * step(), behavior: 'instant' });
      position = lastWritten = track.scrollLeft;
    };
    track.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') hovering = true;
    });
    track.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch') hovering = false;
    });
    track.addEventListener('pointerdown', event => {
      touching = true; sync();
    }, { passive: true });
    const releaseTouch = () => { if (touching) { touching = false; sync(); } };
    document.addEventListener('pointerup', releaseTouch, { passive: true });
    document.addEventListener('pointercancel', releaseTouch, { passive: true });
    track.addEventListener('wheel', () => {
      touching = true;
      clearTimeout(interactionTimer);
      sync();
      interactionTimer = setTimeout(() => { touching = false; sync(); }, 1200);
    }, { passive: true });
    panel.addEventListener('focusin', sync);
    panel.addEventListener('focusout', () => setTimeout(sync, 0));
    track.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const currentCard = event.target.closest('.nav-mega-project-card');
      const current = currentCard && cards.includes(currentCard) ? cards.indexOf(currentCard) : index();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const destination = (current + direction + cards.length) % cards.length;
      cards[destination].querySelector('a')?.focus({ preventScroll: true });
      scrollToCard(destination);
    });
    panel.addEventListener('navigationopened', () => { hovering = false; touching = false; sync(); });
    panel.addEventListener('navigationclosed', () => { stop(); clearTimeout(interactionTimer); hovering = false; touching = false; });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    desktop.addEventListener('change', () => { track.scrollLeft = 0; sync(); });
    new ResizeObserver(() => sync()).observe(track);
    sync();
  });
})();
