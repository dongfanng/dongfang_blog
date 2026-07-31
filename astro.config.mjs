import { defineConfig } from 'astro/config';
import path from 'path';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeExternalLinks from 'rehype-external-links';
import tailwindcss from '@tailwindcss/vite';
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
  // 预取页面，减轻 View Transitions 换页等待（Cloudflare 静态站尤其明显）
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    vue(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
        protocols: ['http', 'https'],
      }],
      // KaTeX 数学公式：remark-math 标记 $...$ / $$...$$，此处渲染为 HTML
      [rehypeKatex, {
        throwOnError: false,
        output: 'html',
      }],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
