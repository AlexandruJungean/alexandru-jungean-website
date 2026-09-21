import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const build = spawnSync(process.execPath, ['scripts/build-static.mjs'], { cwd: root, encoding: 'utf8' });
assert.equal(build.status, 0, build.stderr);
const headers = await readFile(path.join(dist, '_headers'), 'utf8');

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}

test('publish output excludes source, internal strategy, tests, dependencies and secrets', async () => {
  const rootEntries = await readdir(dist);
  for (const forbidden of ['.git', '.env', '.env.example', 'netlify', 'node_modules', 'docs', 'tests', 'scripts', 'UPWORK', 'FIVERR-OPTIMIZATION', 'LAWYER-APP-CONCEPT', 'package.json', 'netlify.toml', 'README.md']) {
    assert.ok(!rootEntries.includes(forbidden), forbidden);
  }
  const allFiles = await files(dist);
  assert.ok(allFiles.length > 100);
  for (const file of allFiles) {
    assert.doesNotMatch(file, /[\\/](?:\.git|node_modules|docs|tests|netlify)[\\/]/);
    assert.doesNotMatch(file, /\.(?:md|pdf|docx|zip|env)$/i);
  }
  assert.ok(existsSync(path.join(dist, '.well-known/security.txt')));
});

test('clean URLs include the same page with root-relative public assets', async () => {
  for (const page of ['contact', 'services', 'services/website-creation', 'projects/oradea-experience', 'collaboration-policy']) {
    const html = await readFile(path.join(dist, page + '/index.html'), 'utf8');
    assert.equal(html, await readFile(path.join(dist, page + '.html'), 'utf8'));
    for (const match of html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/gi)) {
      if (/^(?:https?:|data:|mailto:|tel:|#|\?)/.test(match[1])) continue;
      assert.ok(match[1].startsWith('/'), page + ': ' + match[1]);
      if (/^\/(?:css|js|fonts|images)\//.test(match[1])) {
        assert.ok(existsSync(path.join(dist, decodeURI(match[1].split('?')[0]))), page + ': missing ' + match[1]);
      }
    }
  }
});

test('every published page resolves its image candidates, stylesheets and scripts to public files', async () => {
  const publicFiles = new Set((await files(dist)).map(file => path.resolve(file)));
  const missing = [];
  let checked = 0;
  for (const file of [...publicFiles].filter(value => value.endsWith('.html'))) {
    // Ignore commented-out markup and HTML-looking strings inside script bodies.
    const html = (await readFile(file, 'utf8'))
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, '$1</script>');
    const documentUrl = new URL(path.relative(dist, file).split(path.sep).join('/'), 'https://public.invalid/');
    for (const match of html.matchAll(/<(img|source|script|link)\b[^>]*>/gi)) {
      const tag = match[1].toLowerCase();
      const attributes = Object.fromEntries([...match[0].matchAll(/\s([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map(attribute => [attribute[1].toLowerCase(), attribute[3]]));
      if (tag === 'link' && !/(?:^|\s)stylesheet(?:\s|$)/i.test(attributes.rel || '')) continue;
      const candidates = [tag === 'link' ? attributes.href : attributes.src].filter(Boolean);
      if ((tag === 'img' || tag === 'source') && attributes.srcset) {
        for (const candidate of attributes.srcset.matchAll(/(?:^|,)\s*(data:[^\s]+|[^,\s]+)(?:\s+[^,]*)?/gi)) candidates.push(candidate[1]);
      }
      for (const raw of candidates) {
        const value = raw.trim().replace(/&amp;/gi, '&');
        if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
        const resolvedUrl = new URL(value, documentUrl);
        const target = path.resolve(dist, '.' + decodeURIComponent(resolvedUrl.pathname));
        checked++;
        if (!publicFiles.has(target)) missing.push(path.relative(dist, file) + ': ' + raw + ' -> ' + resolvedUrl.pathname);
      }
    }
  }
  assert.ok(checked > 100, 'The public asset scan must cover the full website');
  assert.deepEqual(missing, [], 'Broken generated public asset references:\n' + missing.join('\n'));
});

test('CSP permits only hashed inline script bodies and blocks inline event handlers', async () => {
  const scriptPolicy = headers.match(/script-src ([^;]+)/)[1];
  assert.ok(!scriptPolicy.includes("'unsafe-inline'"));
  assert.ok(!scriptPolicy.includes("'unsafe-eval'"));
  assert.match(headers, /script-src-attr 'none'/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /object-src 'none'/);
  const allHtml = (await files(dist)).filter(file => file.endsWith('.html'));
  for (const file of allHtml) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      if (/\bsrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
      const hash = createHash('sha256').update(match[2].replace(/\r\n?/g, '\n')).digest('base64');
      assert.ok(scriptPolicy.includes("'sha256-" + hash + "'"), 'Missing CSP hash: ' + file);
    }
  }
});

test('analytics has a single consent-controlled loader across every published page', async () => {
  for (const file of (await files(dist)).filter(value => value.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js/);
    assert.doesNotMatch(html, /gtag\('config'/);
    const expected = ['401.html', '404.html'].includes(path.basename(file)) ? 0 : 1;
    assert.equal((html.match(/<script[^>]+src="[^"]*cookie-consent\.js"/g) || []).length, expected, file);
  }
});

