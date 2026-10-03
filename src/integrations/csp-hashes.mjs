/**
 * CSP hash integration.
 *
 * After the build, scans every HTML file for inline <script> and <style> blocks, computes
 * their SHA-256 hashes and writes them into dist/_headers (replacing {{SCRIPT_HASHES}} and
 * {{STYLE_HASHES}} in public/_headers).
 *
 * This lets the site run a strict CSP with no 'unsafe-inline' anywhere.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_RE = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const STYLE_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const STYLE_ATTR_RE = /<[a-z][^>]*\sstyle=["'][^"']*["']/gi;

const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

const collect = (html, re) => {
  const out = new Set();
  for (const m of html.matchAll(re)) if (m[1].length) out.add(sha(m[1]));
  return out;
};

/** @returns {import('astro').AstroIntegration} */
export default function cspHashes() {
  return {
    name: 'csp-hashes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const scripts = new Set();
        const styles = new Set();
        let files = 0;

        for await (const file of walk(out)) {
          let html = await readFile(file, 'utf8');
          const s = collect(html, SCRIPT_RE);
          const st = collect(html, STYLE_RE);
          const offenders = html.match(STYLE_ATTR_RE);
          if (offenders) {
            logger.warn(`${file.replace(out, '/')}: ${offenders.length} inline style attribute(s) would be blocked by CSP, e.g. ${offenders[0].slice(0, 80)}`);
          }

          if (html.includes('__INLINE_SCRIPT_HASHES__') || html.includes('__INLINE_STYLE_HASHES__')) {
            // Page has its own meta CSP: hash only its own inline blocks and don't add them to the global header.
            html = html
              .replaceAll('__INLINE_SCRIPT_HASHES__', [...s].join(' '))
              .replaceAll('__INLINE_STYLE_HASHES__', [...st].join(' '));
            await writeFile(file, html);
          } else {
            s.forEach((h) => scripts.add(h));
            st.forEach((h) => styles.add(h));
          }
          files++;
        }

        const headersPath = join(out, '_headers');
        try {
          const tpl = await readFile(headersPath, 'utf8');
          const result = tpl
            .replaceAll('{{SCRIPT_HASHES}}', [...scripts].sort().join(' '))
            .replaceAll('{{STYLE_HASHES}}', [...styles].sort().join(' '));
          await writeFile(headersPath, result);
          logger.info(`CSP: ${scripts.size} script hash(es), ${styles.size} style hash(es) from ${files} HTML files → _headers`);
        } catch {
          logger.warn('No _headers file found in output; skipping CSP hash injection.');
        }
      },
    },
  };
}
