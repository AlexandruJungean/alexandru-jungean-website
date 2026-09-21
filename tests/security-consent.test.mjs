import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../js/cookie-consent.js', import.meta.url), 'utf8');
const KEY = 'cookie_consent_v2';
const consent = analytics => JSON.stringify({ analytics, savedAt: Date.now() });
function sandbox(initial = {}, options = {}) {
  const store = new Map(Object.entries(initial));
  const ids = new Map(), scripts = [], cookies = new Map(Object.entries(options.cookies || {})), cookieWrites = [];
  const windowEvents = {}, documentEvents = {};
  let reloads = 0;
  const node = (id = '') => ({
    id, hidden: false, attributes: {}, events: {}, parentElement: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; },
    addEventListener(name, callback) { this.events[name] = callback; },
    focus() { document.activeElement = this; },
    remove() { this.removed = true; },
    click() { this.events.click?.({ preventDefault() {} }); },
    set innerHTML(value) {
      this.html = value;
      for (const match of value.matchAll(/id="([^"]+)"/g)) ids.set(match[1], node(match[1]));
    }
  });
  const manage = node('manage');
  const cookieLink = node('policy');
  cookieLink.className = 'footer-link';
  cookieLink.insertAdjacentElement = (_, element) => { ids.set('manage-injected', element); };
  const document = {
    readyState: 'loading', hidden: false, activeElement: null,
    createElement: () => node(),
    getElementById: id => ids.get(id),
    querySelector: selector => selector.includes('[data-manage-cookies]') ? manage : cookieLink,
    querySelectorAll: selector => selector === '[data-manage-cookies]' ? [manage] : [],
    contains: () => true,
    addEventListener: (name, callback) => { documentEvents[name] = callback; },
    head: { appendChild: element => scripts.push(element) },
    body: { appendChild: element => ids.set(element.id, element) },
    get cookie() { return [...cookies].map(([key, value]) => key + '=' + value).join('; '); },
    set cookie(value) {
      cookieWrites.push(value);
      const name = value.split('=')[0];
      if (/Max-Age=0/.test(value)) cookies.delete(name);
    }
  };
  const window = {
    location: { hostname: 'www.alexjungean.com', pathname: '/services/website-creation', reload: () => { reloads++; } },
    addEventListener: (name, callback) => { windowEvents[name] = callback; }
  };
  const localStorage = {
    getItem: key => { if (options.storageBlocked) throw new Error('blocked'); return store.get(key) ?? null; },
    setItem: (key, value) => { if (options.storageBlocked) throw new Error('blocked'); store.set(key, value); },
    removeItem: key => { if (options.storageBlocked) throw new Error('blocked'); store.delete(key); }
  };
  vm.runInNewContext(source, { window, document, localStorage, Date });
  documentEvents.DOMContentLoaded();
  return { store, ids, scripts, cookies, cookieWrites, document, window, windowEvents, documentEvents, manage, reloads: () => reloads };
}

test('no analytics loads before a choice, even with legacy consent', () => {
  for (const values of [{}, { cookie_consent_v1: 'granted' }, { [KEY]: 'broken-json' }]) {
    const app = sandbox(values);
    assert.equal(app.scripts.length, 0);
    assert.equal(app.ids.get('cookie-banner').hidden, false);
    assert.equal(app.window['ga-disable-G-XC8SSPPMLV'], true);
    assert.equal(app.store.has('cookie_consent_v1'), false);
  }
});

test('reject persists without loading Google and clears only analytics cookies', () => {
  const app = sandbox({}, { cookies: { _ga: 'x', _ga_XC8SSPPMLV: 'x', _gid: 'x', session: 'keep', _GRECAPTCHA: 'keep' } });
  app.ids.get('cookie-decline').click();
  assert.equal(JSON.parse(app.store.get(KEY)).analytics, false);
  assert.equal(app.ids.get('cookie-banner').hidden, true);
  assert.equal(app.scripts.length, 0);
  assert.equal(app.cookies.has('_ga'), false);
  assert.equal(app.cookies.get('session'), 'keep');
  assert.equal(app.cookies.get('_GRECAPTCHA'), 'keep');
  assert.ok(app.cookieWrites.some(value => value.includes('domain=.alexjungean.com')));
  assert.ok(app.cookieWrites.some(value => value.includes('path=/services/website-creation')));
});

test('opt-in loads once, only analytics, with bounded non-renewing cookies', () => {
  const app = sandbox();
  app.ids.get('cookie-accept').click();
  app.ids.get('cookie-accept').click();
  assert.equal(app.scripts.length, 1);
  assert.match(app.scripts[0].src, /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-XC8SSPPMLV$/);
  assert.equal(JSON.parse(app.store.get(KEY)).analytics, true);
  const records = app.window.dataLayer.map(args => [...args]);
  const defaults = records.find(args => args[0] === 'consent')[2];
  assert.equal(defaults.analytics_storage, 'granted');
  assert.equal(defaults.ad_storage, 'denied');
  assert.equal(defaults.ad_user_data, 'denied');
  assert.equal(defaults.ad_personalization, 'denied');
  const configuration = records.find(args => args[0] === 'config')[2];
  assert.equal(configuration.cookie_expires, 180 * 86400);
  assert.equal(configuration.cookie_update, false);
  assert.equal(configuration.allow_google_signals, false);
  assert.equal(configuration.allow_ad_personalization_signals, false);
});

test('valid stored choices are honored; expired/future/malformed preferences are renewed', () => {
  const granted = sandbox({ [KEY]: consent(true) });
  assert.equal(granted.scripts.length, 1);
  assert.equal(granted.ids.get('cookie-banner').hidden, true);
  const denied = sandbox({ [KEY]: consent(false) });
  assert.equal(denied.scripts.length, 0);
  assert.equal(denied.ids.get('cookie-banner').hidden, true);
  for (const record of [
    { analytics: true, savedAt: Date.now() - 181 * 86400000 },
    { analytics: true, savedAt: Date.now() + 60000 },
    { analytics: 'true', savedAt: Date.now() },
    { analytics: true, savedAt: 'yesterday' }
  ]) {
    const app = sandbox({ [KEY]: JSON.stringify(record) });
    assert.equal(app.scripts.length, 0);
    assert.equal(app.ids.get('cookie-banner').hidden, false);
  }
});

test('withdrawal disables collection, clears accessible cookies, and unloads the runtime', () => {
  const app = sandbox({ [KEY]: consent(true) }, { cookies: { _ga: 'x', _gcl_au: 'x' } });
  app.manage.focus();
  app.manage.click();
  assert.equal(app.document.activeElement.id, 'cookie-decline');
  app.ids.get('cookie-decline').click();
  assert.equal(app.document.activeElement.id, 'manage');
  assert.equal(app.window['ga-disable-G-XC8SSPPMLV'], true);
  assert.equal(app.cookies.size, 0);
  assert.equal(app.reloads(), 1);
  assert.equal(JSON.parse(app.store.get(KEY)).analytics, false);
});

test('withdrawal in another tab stops analytics in the current tab', () => {
  const app = sandbox({ [KEY]: consent(true) });
  app.store.set(KEY, consent(false));
  app.windowEvents.storage({ key: KEY });
  assert.equal(app.window['ga-disable-G-XC8SSPPMLV'], true);
  assert.equal(app.reloads(), 1);
});

test('clearing preferences in another tab asks again without enabling analytics', () => {
  const app = sandbox({ [KEY]: consent(false) });
  app.store.clear();
  app.windowEvents.storage({ key: null });
  assert.equal(app.ids.get('cookie-banner').hidden, false);
  assert.equal(app.scripts.length, 0);
});

test('storage errors leave the website and current-session choice usable', () => {
  const app = sandbox({}, { storageBlocked: true });
  assert.equal(app.ids.get('cookie-banner').hidden, false);
  app.ids.get('cookie-decline').click();
  assert.equal(app.ids.get('cookie-banner').hidden, true);
  assert.equal(app.scripts.length, 0);
});

