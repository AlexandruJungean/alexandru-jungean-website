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
        '<p>I use Google Analytics to understand how visitors use this website. Your data stays anonymous and helps me improve the site. <a href="/cookie-policy">Learn more</a>.</p>' +
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

  function bindManageButton() {
    document.querySelectorAll('[data-manage-cookies]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildBanner();
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
})();
