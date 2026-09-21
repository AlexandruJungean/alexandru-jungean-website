import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../netlify/functions/contact.js', import.meta.url), 'utf8');
const valid = { name: 'Ana Popescu', email: 'ana@example.com', subject: 'Website', message: 'Bună! Aș dori o ofertă.', recaptchaToken: 'token-for-test' };
const event = (data = valid, overrides = {}) => ({
  httpMethod: 'POST', headers: { 'content-type': 'application/json', origin: 'https://alexjungean.com' },
  body: JSON.stringify(data), ...overrides
});
async function sandbox(options = {}) {
  const sent = [], requests = [], logs = [];
  const env = { RECAPTCHA_SECRET_KEY: 'test-secret&value', GMAIL_USER: 'owner@example.com', GMAIL_APP_PASSWORD: 'test-password', ...options.env };
  const context = vm.createContext({
    Buffer, URL, URLSearchParams, AbortSignal, process: { env },
    console: { error: (...args) => logs.push(args), warn: (...args) => logs.push(args) },
    fetch: async (...args) => {
      requests.push(args);
      if (options.fetchError) throw new Error('Private provider detail');
      return { ok: options.httpOk !== false, json: async () => options.verification ?? {
        success: true, score: 0.9, action: 'contact', hostname: 'alexjungean.com', challenge_ts: new Date().toISOString()
      } };
    }
  });
  const mailer = new vm.SyntheticModule(['default'], function () {
    this.setExport('default', { createTransport: () => ({
      sendMail: async mail => {
        sent.push(mail);
        if (options.mailFailureAt === sent.length) throw new Error('Private email content');
      }
    }) });
  }, { context });
  const module = new vm.SourceTextModule(source, { context });
  await module.link(name => { assert.equal(name, 'nodemailer'); return mailer; });
  await module.evaluate();
  return { handler: module.namespace.handler, config: module.namespace.config, sent, requests, logs };
}

test('valid request sends inquiry and receipt with JSON/no-store response', async () => {
  const app = await sandbox();
  const result = await app.handler(event());
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).confirmationSent, true);
  assert.equal(app.sent.length, 2);
  assert.equal(app.sent[0].replyTo, valid.email);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.match(result.headers['Content-Type'], /application\/json/);
  const params = new URLSearchParams(app.requests[0][1].body);
  assert.equal(params.get('secret'), 'test-secret&value');
  assert.equal(params.get('response'), valid.recaptchaToken);
  assert.ok(app.requests[0][1].signal);
  assert.equal(app.config.path, '/.netlify/functions/contact');
  assert.equal(app.config.rateLimit.windowLimit, 5);
});

test('non-POST, wrong content type and untrusted origin fail before external calls', async () => {
  for (const [overrides, code] of [
    [{ httpMethod: 'GET' }, 405],
    [{ headers: { 'content-type': 'text/plain' } }, 415],
    [{ headers: { 'content-type': 'application/json', origin: 'https://attacker.invalid' } }, 403]
  ]) {
    const app = await sandbox();
    assert.equal((await app.handler(event(valid, overrides))).statusCode, code);
    assert.equal(app.requests.length, 0);
    assert.equal(app.sent.length, 0);
  }
});

test('invalid JSON and non-object payloads return 400', async () => {
  for (const body of ['{', 'null', '[]', '42', '"string"']) {
    const app = await sandbox();
    assert.equal((await app.handler(event(valid, { body }))).statusCode, 400);
    assert.equal(app.requests.length, 0);
  }
});

test('reject oversized bodies before parsing, including base64 bodies', async () => {
  for (const overrides of [{ body: 'x'.repeat(49 * 1024) }, { body: Buffer.from('x'.repeat(49 * 1024)).toString('base64'), isBase64Encoded: true }]) {
    const app = await sandbox();
    assert.equal((await app.handler(event(valid, overrides))).statusCode, 413);
    assert.equal(app.requests.length, 0);
  }
});

test('valid base64 JSON and case-insensitive headers preserve contract', async () => {
  const app = await sandbox();
  const result = await app.handler(event(valid, {
    body: Buffer.from(JSON.stringify(valid)).toString('base64'), isBase64Encoded: true,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', Origin: 'https://alexjungean.com' }
  }));
  assert.equal(result.statusCode, 200);
});

test('strict field types, lengths, control characters and email header syntax are rejected', async () => {
  const invalid = [
    { name: {} }, { name: '' }, { name: 'a'.repeat(121) }, { name: 'Ana\r\nBcc: attacker@example.com' },
    { email: 'ana@example.com, attacker@example.com' }, { email: 'Ana <ana@example.com>' },
    { email: 'ana@example.com\r\nBcc: attacker@example.com' }, { email: 'not-an-email' },
    { email: 'ana@example.com?bcc=attacker@example.com' }, { email: 'ana@-example.com' }, { email: '.ana@example.com' },
    { subject: 'a'.repeat(161) }, { subject: 'a\nb' }, { message: 'a'.repeat(5001) },
    { message: '\u0000hello' }, { recaptchaToken: [] }, { recaptchaToken: 't'.repeat(4097) }
  ];
  for (const fields of invalid) {
    const app = await sandbox();
    assert.equal((await app.handler(event({ ...valid, ...fields }))).statusCode, 400, JSON.stringify(fields).slice(0, 120));
    assert.equal(app.requests.length, 0);
    assert.equal(app.sent.length, 0);
  }
});

test('HTML is escaped in emails without silently changing the original plain message', async () => {
  const app = await sandbox();
  const message = '<img src=x onerror=alert(1)>\nAT&T "quoted"';
  assert.equal((await app.handler(event({ ...valid, name: 'Ana <Admin>', subject: '<b>website</b>', message }))).statusCode, 200);
  for (const mail of app.sent.slice(0, 1)) {
    assert.doesNotMatch(mail.html, /<img src=x/);
    assert.match(mail.html, /&lt;img src=x onerror=alert\(1\)&gt;<br>/);
    assert.match(mail.html, /AT&amp;T &quot;quoted&quot;/);
    assert.ok(mail.text.includes(message));
  }
  assert.ok(!app.sent[1].text.includes(message));
  assert.doesNotMatch(app.sent[1].html, /onerror|&lt;Admin&gt;/);
});

test('mailto links encode special characters in an otherwise valid local part', async () => {
  const app = await sandbox();
  const email = 'ana?tag@example.com';
  assert.equal((await app.handler(event({ ...valid, email }))).statusCode, 200);
  assert.match(app.sent[0].html, /mailto:ana%3Ftag%40example\.com/);
  assert.equal(app.sent[0].replyTo, email);
});

test('verification requires score, exact action, trusted hostname and a fresh timestamp', async () => {
  const base = { success: true, score: 0.9, action: 'contact', hostname: 'alexjungean.com', challenge_ts: new Date().toISOString() };
  for (const changed of [
    { success: false }, { score: undefined }, { score: '0.9' }, { score: NaN }, { score: 0.49 }, { score: 1.01 },
    { action: 'login' }, { action: undefined }, { hostname: 'attacker.invalid' }, { hostname: 'alexjungean.com.attacker.invalid' },
    { challenge_ts: undefined }, { challenge_ts: new Date(Date.now() - 180000).toISOString() },
    { challenge_ts: new Date(Date.now() + 60000).toISOString() }
  ]) {
    const app = await sandbox({ verification: { ...base, ...changed } });
    assert.equal((await app.handler(event())).statusCode, 400, JSON.stringify(changed));
    assert.equal(app.sent.length, 0);
  }
});

test('trusted Netlify preview origin and matching CAPTCHA hostname can submit', async () => {
  const app = await sandbox({
    env: { DEPLOY_PRIME_URL: 'https://deploy-preview-9--site.netlify.app' },
    verification: { success: true, score: 0.8, action: 'contact', hostname: 'deploy-preview-9--site.netlify.app', challenge_ts: new Date().toISOString() }
  });
  assert.equal((await app.handler(event(valid, { headers: { 'content-type': 'application/json', origin: 'https://deploy-preview-9--site.netlify.app' } }))).statusCode, 200);
});

test('missing credentials fails closed without exposing configuration', async () => {
  const app = await sandbox({ env: { RECAPTCHA_SECRET_KEY: '' } });
  assert.equal((await app.handler(event())).statusCode, 503);
  assert.equal(app.requests.length, 0);
  assert.equal(app.sent.length, 0);
});

test('provider failure or rejected first email returns a generic error without personal data in logs', async () => {
  for (const options of [{ fetchError: true }, { httpOk: false }, { mailFailureAt: 1 }]) {
    const app = await sandbox(options);
    const response = await app.handler(event());
    assert.equal(response.statusCode, 502);
    assert.doesNotMatch(JSON.stringify(app.logs), /Private|Ana|example\.com/);
  }
});

test('receipt failure does not turn a delivered inquiry into an error or retry', async () => {
  const app = await sandbox({ mailFailureAt: 2 });
  const result = await app.handler(event());
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).confirmationSent, false);
  assert.equal(app.sent.length, 2);
});

