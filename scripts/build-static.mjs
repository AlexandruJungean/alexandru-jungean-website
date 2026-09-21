import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// Only this exact generated directory may be replaced. Never publish the repository.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unsafe output path');
const existing = await lstat(output).catch(() => null);
if (existing?.isSymbolicLink()) throw new Error('Refusing to replace a linked output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const pages = [
  'index.html', '401.html', '404.html', 'services.html', 'projects.html', 'tools.html',
  'contact.html', 'start.html', 'blog.html', 'privacy-policy.html', 'cookie-policy.html', 'terms.html', 'collaboration-policy.html'
];
for (const directory of ['services', 'projects']) {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) pages.push(`${directory}/${entry.name}`);
  }
}

const scriptHashes = new Set();
for (const page of pages) {
  // HTML parsing normalizes line endings before checking a CSP hash.
  let html = (await readFile(path.join(root, page), 'utf8')).replace(/\r\n?/g, '\n');
  const absolute = value => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(value)) return value;
    const url = new URL(value, `https://build.invalid/${page}`);
    return url.pathname + url.search + url.hash;
  };
  // A clean URL may be served with a trailing slash. Root-relative public asset
  // URLs keep both forms working; script bodies are deliberately left intact.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>|<[^>]+>/gi, tag => {
    if (/^<script\b/i.test(tag) && !/\bsrc\s*=/.test(tag.slice(0, tag.indexOf('>')))) return tag;
    return tag.replace(/\b(src|href|poster|(?:image)?srcset)=(['"])(.*?)\2/gi, (attribute, name, quote, value) => {
      const transformed = /srcset$/i.test(name)
        ? value.split(',').map(candidate => candidate.trim().replace(/^\S+/, absolute)).join(', ')
        : absolute(value);
      return `${name}=${quote}${transformed}${quote}`;
    });
  });
  if (/\son[a-z]+\s*=/i.test(html)) throw new Error(`Inline event handler requires an external script: ${page}`);
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (!/\bsrc\s*=/i.test(match[1]) && match[2].trim()) {
      scriptHashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
    }
  }
  await mkdir(path.dirname(path.join(output, page)), { recursive: true });
  await writeFile(path.join(output, page), html);
  // Clean URLs do not depend on Netlify mutating HTML after CSP hashing.
  if (!['index.html', '401.html', '404.html'].includes(page)) {
    const clean = path.join(output, page.replace(/\.html$/, ''), 'index.html');
    await mkdir(path.dirname(clean), { recursive: true });
    await writeFile(clean, html);
  }
}

const extensions = {
  css: new Set(['.css']), js: new Set(['.js']), fonts: new Set(['.woff', '.woff2']),
  images: new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico'])
};
for (const [directory, allowed] of Object.entries(extensions)) {
  await cp(path.join(root, directory), path.join(output, directory), {
    recursive: true,
    filter: async source => {
      const entry = await lstat(source);
      if (entry.isSymbolicLink()) return false;
      return entry.isDirectory() || allowed.has(path.extname(source).toLowerCase());
    }
  });
}
for (const file of ['robots.txt', 'sitemap.xml', 'humans.txt', 'llms.txt', 'llms-full.txt', '.well-known/security.txt']) {
  await mkdir(path.dirname(path.join(output, file)), { recursive: true });
  await cp(path.join(root, file), path.join(output, file));
}

const policy = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com " + [...scriptHashes].join(' '),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google.com https://www.gstatic.com https://*.google-analytics.com https://www.googletagmanager.com https://*.r2.cloudflarestorage.com https://*.r2.dev",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://recaptcha.google.com",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", 'upgrade-insecure-requests'
].join('; ');
await writeFile(path.join(output, '_headers'), `/*\n  Content-Security-Policy: ${policy}\n`);
console.log(`Built ${pages.length} pages and public assets in dist; ${scriptHashes.size} inline script hashes. Source, internal documents, tests and secrets are excluded.`);
