import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const headers = await readFile(path.join(root, '_headers'), 'utf8');
const csp = headers.split('Content-Security-Policy: ')[1].trim();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    let file = path.resolve(root, '.' + decodeURI(url.pathname));
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('outside public root');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Security-Policy': csp, 'X-Content-Type-Options': 'nosniff' });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ headless: true });
let checks = 0;
try {
  for (const route of ['/', '/contact/', '/services/website-creation/', '/collaboration-policy/']) {
    const context = await browser.newContext();
    const requests = [], violations = [], failures = [];
    await context.route('https://**/*', request => {
      const url = request.request().url();
      requests.push(url);
      if (url.startsWith('https://www.googletagmanager.com/gtag/js')) {
        return request.fulfill({ contentType: 'application/javascript', body: "window.__analyticsLoaded=true;document.cookie='_ga=test;path=/';" });
      }
      return request.abort();
    });
    const page = await context.newPage();
    page.on('console', message => { if (/Content Security Policy/i.test(message.text())) violations.push(message.text()); });
    page.on('pageerror', failure => failures.push(failure.message));
    await page.goto(origin + route);
    await page.getByRole('button', { name: 'Reject optional', exact: true }).waitFor();
    // Exceeds the legacy loader's 4s delay, so accidental reintroduction is caught.
    await page.waitForTimeout(4500);
    if (requests.some(url => /google-analytics|googletagmanager/.test(url))) throw new Error('Premature analytics: ' + route);
    await page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
    await page.waitForFunction(() => window.__analyticsLoaded === true);
    if (await page.locator('footer [data-manage-cookies]').count()) throw new Error('Unexpected footer control: ' + route);
    if (requests.filter(url => /googletagmanager/.test(url)).length !== 1) throw new Error('Duplicate analytics load: ' + route);
    await page.locator('footer a[href="/cookie-policy"]').click();
    await page.waitForFunction(() => window.__analyticsLoaded === true);
    await page.getByRole('button', { name: 'Manage cookie preferences', exact: true }).click();
    await page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    await page.waitForFunction(() => localStorage.getItem('cookie_consent_v2') && JSON.parse(localStorage.getItem('cookie_consent_v2')).analytics === false && !window.__analyticsLoaded);
    if ((await context.cookies()).some(cookie => /^_ga/.test(cookie.name))) throw new Error('GA cookie not removed: ' + route);
    // One load on each of the two consented pages; none after withdrawal/reload.
    if (requests.filter(url => /googletagmanager/.test(url)).length !== 2) throw new Error('Unexpected analytics loads: ' + route);
    if (violations.length) throw new Error('CSP violations at ' + route + ': ' + violations.join('\n'));
    if (failures.length) throw new Error('JS errors at ' + route + ': ' + failures.join('\n'));
    checks++;
    await context.close();
  }
  console.log(JSON.stringify({ passed: checks, pages: ['/', '/contact/', '/services/website-creation/', '/collaboration-policy/'], checks: 'built routes, real browser CSP, no tracking before consent, opt-in, withdrawal, cookie deletion, no duplicate tracking, no JavaScript errors', externalRequests: 'intercepted locally; no data or email sent' }));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

