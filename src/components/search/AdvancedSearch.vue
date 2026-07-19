<template>
  <div>
    <!-- 标题区域 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-3">
        <div class="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
          <VueIcon icon="lucide:search" class="text-xl" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          搜索
        </h1>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <VueIcon icon="lucide:search" class="text-xl text-gray-400" />
        </div>
        <input
          type="text"
          class="block w-full p-4 pl-10 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors outline-none"
          placeholder="搜索文章..."
          v-model="keyword"
          @input="handleInput"
        />
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="space-y-4">
      <div v-if="isSearching" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      <div v-else-if="results.length > 0">
        <div
          v-for="result in results"
          :key="result.id"
          class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <a :href="result.url" class="block group">
            <h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span v-html="result.meta.title"></span>
            </h2>
            <p class="text-gray-600 dark:text-gray-300" v-html="result.excerpt"></p>
          </a>
        </div>
      </div>
      <div v-else-if="keyword" class="bg-white dark:bg-gray-800 p-10 text-center text-gray-500 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700">
        未找到与「{{ keyword }}」相关的文章
      </div>
      <div v-else class="bg-white dark:bg-gray-800 p-10 text-center text-gray-500 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700">
        输入关键词开始搜索
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VueIcon from '../ui/VueIcon.vue';

interface SearchResult {
  id: string;
  url: string;
  meta: { title: string };
  excerpt: string;
  content?: string;
}

const keyword = ref('');
const results = ref<SearchResult[]>([]);
const isSearching = ref(false);
const initialized = ref(false);

// 开发模式的文章数据
const devPosts: SearchResult[] = [
  {
    id: '1',
    url: '/blog/2026/getting-started',
    meta: { title: '欢迎来到我的博客' },
    excerpt: '这是博客的第一篇文章，介绍一下这个博客的技术栈和未来的写作计划。使用了 Astro、Tailwind CSS、TypeScript、MDX 等技术。',
  },
  {
    id: '2',
    url: '/blog/2026/astro-introduction',
    meta: { title: 'Astro 入门指南' },
    excerpt: '介绍 Astro 的基本概念和使用方法，帮助你快速上手这个优秀的静态站点生成器。核心概念包括群岛架构、组件语法等。',
  },
];

function highlightText(text: string, keywordStr: string): string {
  if (!keywordStr) return text;
  const regex = new RegExp(`(${keywordStr})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

async function performSearch() {
  if (!initialized.value || !keyword.value.trim()) {
    results.value = [];
    return;
  }

  isSearching.value = true;

  try {
    let searchResults: SearchResult[] = [];

    if (import.meta.env.PROD && (window as any).pagefind) {
      const pagefind = (window as any).pagefind;
      const response = await pagefind.search(keyword.value);
      searchResults = await Promise.all(
        response.results.map((item: any) => item.data()),
      );
    } else {
      // 开发模式下搜索本地文章数据
      searchResults = devPosts
        .filter((post) => {
          const title = post.meta.title.toLowerCase();
          const excerpt = post.excerpt.toLowerCase();
          const q = keyword.value.toLowerCase();
          return title.includes(q) || excerpt.includes(q);
        })
        .map((post) => ({
          ...post,
          meta: {
            title: highlightText(post.meta.title, keyword.value),
          },
          excerpt: highlightText(post.excerpt, keyword.value),
        }));
    }

    results.value = searchResults;
  } catch (error) {
    console.error('Search error:', error);
    results.value = [];
  } finally {
    isSearching.value = false;
  }
}

let debounceTimer: NodeJS.Timeout | null = null;
function handleInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    performSearch();
  }, 300);
}

function initialize() {
  initialized.value = true;

  // 从 URL 获取初始关键词
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get('q');
    if (q) {
      keyword.value = q;
      performSearch();
    }
  }
}

onMounted(() => {
  if (import.meta.env.PROD) {
    if ((window as any).pagefind) {
      initialize();
    } else {
      document.addEventListener('pagefindready', initialize, { once: true });
    }
  } else {
    console.log('Development advanced search mode enabled');
    initialize();
  }
});
</script>

<style>
mark {
  background: transparent;
  color: var(--primary-color, #3b82f6);
  font-weight: 600;
  padding: 0 0.1em;
}
</style>
