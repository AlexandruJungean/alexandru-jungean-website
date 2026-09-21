(() => {
  'use strict';

  const main = document.querySelector('.legal-page main');
  const content = main?.querySelector('.legal-content');
  if (!content) return;

  const buttons = [...content.querySelectorAll('[data-legal-language]')];
  const panels = [...content.querySelectorAll('[data-legal-panel]')];
  const policyPaths = new Set(['/terms', '/privacy-policy', '/cookie-policy', '/collaboration-policy']);
  let activeLanguage = 'en';

  const hashTarget = () => {
    try {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      return target && content.contains(target) ? target : null;
    } catch {
      return null;
    }
  };

  const selectLanguage = language => {
    activeLanguage = language === 'ro' ? 'ro' : 'en';
    content.lang = activeLanguage;
    main.querySelector('.legal-document-header').lang = activeLanguage;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.legalLanguage === activeLanguage)));
    panels.forEach(panel => { panel.hidden = panel.dataset.legalPanel !== activeLanguage; });
    content.querySelectorAll('[data-legal-note]').forEach(note => { note.hidden = note.dataset.legalNote !== activeLanguage; });
    main.querySelectorAll('[data-legal-text-ro]').forEach(element => {
      element.textContent = element.getAttribute(`data-legal-text-${activeLanguage}`);
      element.lang = activeLanguage;
    });
    main.querySelectorAll('[data-legal-label-ro]').forEach(element => {
      element.setAttribute('aria-label', element.getAttribute(`data-legal-label-${activeLanguage}`));
    });
    content.querySelectorAll('.legal-related a').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('lang', activeLanguage);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
    content.querySelectorAll('.legal-toc a').forEach(link => link.removeAttribute('aria-current'));
    const target = hashTarget();
    if (target?.closest('[data-legal-panel]')?.dataset.legalPanel === activeLanguage) {
      content.querySelectorAll('.legal-toc a').forEach(link => {
        if (link.hash === `#${target.id}`) link.setAttribute('aria-current', 'location');
      });
    }
  };

  const followLocation = (scroll = true) => {
    const target = hashTarget();
    const language = target?.closest('[data-legal-panel]')?.dataset.legalPanel
      || new URL(location.href).searchParams.get('lang')
      || 'en';
    selectLanguage(language);
    if (scroll && target) target.scrollIntoView({ block: 'start' });
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const language = button.dataset.legalLanguage;
      const target = hashTarget();
      const counterpart = target && document.getElementById(target.id.replace(/-(ro|en)$/, `-${language}`));
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      if (counterpart && content.contains(counterpart)) url.hash = counterpart.id;
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      selectLanguage(language);
    });
  });

  // Keep the selected language when following another legal document.
  content.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (url.origin !== location.origin || !policyPaths.has(path) || url.hash) return;
    url.searchParams.set('lang', activeLanguage);
    link.setAttribute('href', url.pathname + url.search);
  });

  followLocation();
  window.addEventListener('hashchange', () => followLocation());
  window.addEventListener('popstate', () => followLocation());
})();
