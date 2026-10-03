// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { site } from './site.config.ts';
import cspHashes from './src/integrations/csp-hashes.mjs';
import { styleToClass, writeShikiCss } from './src/integrations/shiki-classes.mjs';

const CODE_THEME = 'github-dark-default';
await writeShikiCss(CODE_THEME, './src/styles/shiki.generated.css');

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: {
    // Never inline CSS: keeps the CSP free of 'unsafe-inline' for styles.
    inlineStylesheets: 'never',
  },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/admin') }),
    cspHashes(),
  ],
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
      transformers: [styleToClass()],
      wrap: false,
    },
    rehypePlugins: [
      [rehypeSanitize, {
        ...defaultSchema,
        tagNames: [...(defaultSchema.tagNames ?? []), 'mark', 'details', 'summary'],
        attributes: { ...defaultSchema.attributes, code: [['className']] },
      }],
    ],
  },
  vite: {
    build: {
      // Never inline assets as data: URIs (fonts, small images) — keeps img/font-src 'self'.
      assetsInlineLimit: 0,
      // The Firebase SDK bundle is large but loads only on /admin, so the warning is expected.
      chunkSizeWarningLimit: 1200,
    },
  },
});
