(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent_v1';
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  function setConsent(granted) {
    try { localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied'); } catch (e) {}
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied'
      });
    }
    hideBanner();
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = false;
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = '<div class="cookie-banner-inner">' +
      '<div class="cookie-banner-text">' +
        '<strong>Cookies</strong>' +
        '<p>I use Google Analytics to understand how visitors use this website. Your data stays anonymous and helps me improve the site. <a href="/cookie-policy">Read the cookie policy</a>.</p>' +
      '</div>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>' +
        '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', function () { setConsent(true); });
    document.getElementById('cookie-decline').addEventListener('click', function () { setConsent(false); });
  }

  function injectManageLink() {
    if (document.querySelector('.footer-link-wrap [data-manage-cookies]')) return;
    var cookiesLink = document.querySelector('.footer-bottom a[href="/cookie-policy"], .footer-bottom a[href="/cookie-policy.html"]');
    if (!cookiesLink) {
      cookiesLink = document.querySelector('a[href="/cookie-policy"], a[href="/cookie-policy.html"]');
    }
    if (!cookiesLink || !cookiesLink.parentElement) return;
    var link = document.createElement('a');
    link.href = '/cookie-policy';
    link.className = cookiesLink.className;
    link.setAttribute('data-manage-cookies', '');
    link.textContent = 'Manage cookies';
    cookiesLink.insertAdjacentElement('afterend', link);
  }

  function bindManageButton() {
    document.querySelectorAll('[data-manage-cookies]').forEach(function (link) {
      if (link.getAttribute('data-cookie-bound')) return;
      link.setAttribute('data-cookie-bound', 'true');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildBanner();
    injectManageLink();
    bindManageButton();
    if (stored === 'granted') {
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted'
        });
      }
      hideBanner();
    } else if (stored === 'denied') {
      hideBanner();
    } else {
      showBanner();
    }
  });

  if (!document.querySelector('script[src*="seen-catalog.js"]')) {
    var seenScript = document.createElement('script');
    seenScript.src = '/js/seen-catalog.js';
    seenScript.defer = true;
    (document.body || document.head).appendChild(seenScript);
  }
})();
