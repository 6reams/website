// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
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
    processor: unified({
      rehypePlugins: [
        [rehypeSanitize, {
          ...defaultSchema,
          tagNames: [...(defaultSchema.tagNames ?? []), 'mark', 'details', 'summary'],
          attributes: { ...defaultSchema.attributes, code: [['className']] },
        }],
      ],
    }),
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1200,
    },
  },
});
