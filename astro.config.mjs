import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeExternalLinks from 'rehype-external-links';
import icon from 'astro-icon';
import { siteConfig } from './src/config/site';

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    vue(),
    icon(),
  ],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
        protocols: ['http', 'https'],
      }],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
