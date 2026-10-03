// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.ts';
import cspHashes from './src/integrations/csp-hashes.mjs';
import { styleToClass, writeShikiCss } from './src/integrations/shiki-classes.mjs';

const CODE_THEME = 'github-dark-default';
await writeShikiCss(CODE_THEME, './src/styles/shiki.generated.css');

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'never',
  },
  integrations: [
    mdx(),
    sitemap(),
    cspHashes(),
  ],
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
      transformers: [styleToClass()],
      wrap: false,
    },
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1200,
    },
  },
});
