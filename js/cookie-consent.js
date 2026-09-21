(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent_v2';
  var MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
  var MEASUREMENT_ID = 'G-XC8SSPPMLV';
  var analyticsLoaded = false;
  var returnFocus = null;
  var currentConsent = null;

  // Basic consent mode: no Google Analytics request before an explicit opt-in.
  // A previous v1 choice did not distinguish advertising, so ask again.
  window['ga-disable-' + MEASUREMENT_ID] = true;
  try { localStorage.removeItem('cookie_consent_v1'); } catch (e) {}

  function readConsent() {
    try {
      var value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      var age = value && Date.now() - value.savedAt;
      if (value && typeof value.analytics === 'boolean' && typeof value.savedAt === 'number' && age >= 0 && age < MAX_AGE_MS) return value;
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return null;
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window['ga-disable-' + MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: MAX_AGE_MS / 1000,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    var script = document.createElement('script');
    script.id = 'consented-analytics';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    script.onerror = function () {
      // A blocked analytics script must never block the website itself.
      analyticsLoaded = false;
      script.remove();
    };
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    var domains = [''];
    var labels = window.location.hostname.split('.');
    for (var index = 0; index < labels.length - 1; index++) {
      domains.push(labels.slice(index).join('.'));
      domains.push('.' + labels.slice(index).join('.'));
    }
    var paths = ['/'];
    var segments = window.location.pathname.split('/').filter(Boolean);
    for (var count = 1; count <= segments.length; count++) {
      paths.push('/' + segments.slice(0, count).join('/'));
      paths.push('/' + segments.slice(0, count).join('/') + '/');
    }
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_|_gcl_)/.test(name)) return;
      domains.forEach(function (domain) {
        paths.forEach(function (path) {
          document.cookie = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
        });
      });
    });
  }

  function stopAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
    clearAnalyticsCookies();
    if (analyticsLoaded) {
      // The disable flag stops collection immediately; a reload also removes the
      // third-party runtime and its timers/listeners after consent withdrawal.
      window.location.reload();
    }
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.hidden = true;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    returnFocus = null;
  }

  function showBanner(moveFocus) {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.hidden = false;
    if (moveFocus) {
      returnFocus = document.activeElement;
      document.getElementById('cookie-decline').focus();
    }
  }

  function setConsent(granted) {
    currentConsent = { analytics: granted, savedAt: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConsent)); } catch (e) {}
    hideBanner();
    if (granted) loadAnalytics();
    else stopAnalytics();
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.hidden = true;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = '<div class="cookie-banner-inner">' +
      '<div class="cookie-banner-text">' +
        '<strong id="cookie-banner-title">Your privacy, your choice</strong>' +
        '<p>With your permission, Google Analytics helps me understand how this site is used. It may process identifiers and device information. Optional analytics stays off until you accept. Change your choice anytime on the <a href="/cookie-policy">Cookie policy</a> page.</p>' +
      '</div>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="cookie-btn cookie-btn-decline" id="cookie-decline">Reject optional</button>' +
        '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept analytics</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', function () { setConsent(true); });
    document.getElementById('cookie-decline').addEventListener('click', function () { setConsent(false); });
  }

  function initialize() {
    buildBanner();
    document.querySelectorAll('[data-manage-cookies]').forEach(function (link) {
      if (link.getAttribute('data-cookie-bound')) return;
      link.setAttribute('data-cookie-bound', 'true');
      link.addEventListener('click', function (event) {
        event.preventDefault();
        showBanner(true);
      });
    });
    currentConsent = readConsent();
    if (currentConsent && currentConsent.analytics) loadAnalytics();
    else clearAnalyticsCookies();
    if (!currentConsent) showBanner(false);
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    currentConsent = readConsent();
    if (currentConsent && currentConsent.analytics) { hideBanner(); loadAnalytics(); }
    else { stopAnalytics(); if (currentConsent) hideBanner(); else showBanner(false); }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    if (currentConsent && Date.now() - currentConsent.savedAt >= MAX_AGE_MS) {
      currentConsent = null;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      stopAnalytics();
      showBanner(false);
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();

