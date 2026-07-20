<template>
  <div ref="searchContainer" class="relative flex items-center">
    <!-- 桌面端搜索框（Firefly 风格） -->
    <div
      class="hidden lg:flex relative items-center h-11 rounded-lg transition-all
             bg-black/5 hover:bg-black/10
             dark:bg-white/5 dark:hover:bg-white/10"
    >
      <VueIcon
        icon="lucide:search"
        class="absolute text-[1.25rem] pointer-events-none ml-3 my-auto text-black/30 dark:text-white/30 transition-colors"
      />
      <input
        ref="desktopInputRef"
        v-model="desktopQuery"
        type="text"
        placeholder="搜索文章..."
        class="transition-all pl-10 pr-3 text-sm bg-transparent outline-0 h-full text-black/70 dark:text-white/70 placeholder-black/30 dark:placeholder-white/30"
        :class="panelVisible ? 'w-60' : 'w-40'"
        @input="handleInput"
        @keydown.esc="closePanel"
        @focus="onDesktopFocus"
        autocomplete="off"
      />
    </div>

    <!-- 移动端搜索按钮 -->
    <button
      @click="togglePanel"
      class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="搜索文章"
    >
      <VueIcon icon="lucide:search" class="text-gray-600 dark:text-gray-300" />
    </button>

    <!-- 搜索面板（浮动下拉，仿 Firefly） -->
    <div
      id="search-panel"
      class="search-panel fixed lg:absolute z-50 top-16 lg:top-full lg:mt-1 left-3 right-3 lg:left-auto lg:right-0 lg:w-96
             bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2
             transition-all duration-150 origin-top"
      :class="{ 'panel-closed': !panelVisible }"
    >
      <!-- 移动端搜索框（面板内） -->
      <div
        class="flex relative lg:hidden items-center h-11 rounded-xl mb-2 transition-all
               bg-black/5 hover:bg-black/10 focus-within:bg-black/10
               dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
      >
        <VueIcon
          icon="lucide:search"
          class="absolute text-[1.25rem] pointer-events-none ml-3 my-auto text-black/30 dark:text-white/30"
        />
        <input
          ref="mobileInputRef"
          v-model="mobileQuery"
          type="text"
          placeholder="搜索文章..."
          class="pl-10 absolute inset-0 text-sm bg-transparent outline-0 text-black/70 dark:text-white/70 placeholder-black/30 dark:placeholder-white/30"
          @input="handleInput"
          @keydown.esc="closePanel"
          autocomplete="off"
        />
      </div>

      <!-- 搜索结果 -->
      <div class="max-h-[60vh] overflow-y-auto">
        <div v-if="isSearching" class="block rounded-xl text-lg px-3 py-2 text-black/50 dark:text-white/50">
          正在搜索...
        </div>
        <div v-else-if="results.length > 0" class="flex flex-col gap-1">
          <a
            v-for="item in results"
            :key="item.url"
            :href="item.url"
            @click="handleResultClick"
            class="group block rounded-xl text-lg px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/5 focus:outline-none focus:bg-black/5 dark:focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500/40"
          >
            <div class="inline-flex font-bold text-black/90 dark:text-white/90 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span v-html="item.meta.title"></span>
              <VueIcon icon="lucide:chevron-right" class="text-[0.75rem] translate-x-1 my-auto text-primary-600 dark:text-primary-400" />
            </div>
            <div v-if="item.excerpt && item.excerpt.includes('<mark>')" class="text-sm text-black/50 dark:text-white/50 flex items-start mt-0.5">
              <span v-html="item.excerpt"></span>
            </div>
            <div v-if="item.content && item.content.includes('<mark>')" class="text-sm text-black/40 dark:text-white/40 flex items-start mt-0.5">
              <span class="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded text-xs font-semibold mr-2 shrink-0">内容</span>
              <span v-html="item.content"></span>
            </div>
          </a>
        </div>
        <div v-else-if="currentQuery" class="block rounded-xl text-lg px-3 py-2 text-black/50 dark:text-white/50">
          暂无匹配结果
        </div>
        <div v-else class="block rounded-xl text-lg px-3 py-2 text-black/50 dark:text-white/50">
          请输入搜索内容
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import VueIcon from '../ui/VueIcon.vue';

interface SearchResult {
  id: string;
  url: string;
  meta: { title: string };
  excerpt: string;
  content?: string;
}

const desktopQuery = ref('');
const mobileQuery = ref('');
const currentQuery = ref('');
const results = ref<SearchResult[]>([]);
const isSearching = ref(false);
const initialized = ref(false);
const panelVisible = ref(false);

const desktopInputRef = ref<HTMLInputElement | null>(null);
const mobileInputRef = ref<HTMLInputElement | null>(null);
const searchContainer = ref<HTMLElement | null>(null);

let debounceTimer: NodeJS.Timeout | null = null;

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

function highlightText(text: string, keyword: string): string {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function getCurrentKeyword(): string {
  return desktopQuery.value || mobileQuery.value;
}

async function performSearch() {
  const kw = getCurrentKeyword().trim();
  currentQuery.value = kw;
  if (!kw) {
    results.value = [];
    isSearching.value = false;
    return;
  }
  if (!initialized.value) {
    isSearching.value = false;
    return;
  }

  isSearching.value = true;

  try {
    let searchResults: SearchResult[] = [];

    if (import.meta.env.PROD && (window as any).pagefind) {
      const pagefind = (window as any).pagefind;
      const response = await pagefind.search(kw);
      searchResults = await Promise.all(
        response.results.map((item: any) => item.data()),
      );
    } else {
      // 开发模式搜索本地数据
      searchResults = devPosts
        .filter((post) => {
          const title = post.meta.title.toLowerCase();
          const excerpt = post.excerpt.toLowerCase();
          const q = kw.toLowerCase();
          return title.includes(q) || excerpt.includes(q);
        })
        .map((post) => ({
          ...post,
          meta: {
            title: highlightText(post.meta.title, kw),
          },
          excerpt: highlightText(post.excerpt, kw),
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

function handleInput() {
  const kw = getCurrentKeyword();
  if (kw.trim()) {
    showPanel();
    currentQuery.value = kw.trim();
    isSearching.value = true;
  } else {
    results.value = [];
    currentQuery.value = '';
    isSearching.value = false;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch();
  }, 300);
}

function onDesktopFocus() {
  showPanel();
}

function showPanel() {
  panelVisible.value = true;
}

function hidePanel() {
  panelVisible.value = false;
}

function closePanel() {
  hidePanel();
  desktopQuery.value = '';
  mobileQuery.value = '';
  currentQuery.value = '';
  results.value = [];
}

function togglePanel() {
  if (panelVisible.value) {
    closePanel();
  } else {
    showPanel();
    nextTick(() => {
      if (window.innerWidth >= 1024) {
        desktopInputRef.value?.focus();
      } else {
        mobileInputRef.value?.focus();
      }
    });
  }
}

function handleResultClick() {
  hidePanel();
}

// 点击面板外部关闭
function handleGlobalClick(e: MouseEvent) {
  const target = e.target as Node;
  const panel = document.getElementById('search-panel');
  if (!panel || !panelVisible.value) return;
  if (panel.contains(target)) return;
  if (searchContainer.value && searchContainer.value.contains(target)) return;
  closePanel();
}

// 全局快捷键 Ctrl/Cmd + K
function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    togglePanel();
  }
}

function initialize() {
  initialized.value = true;
  const kw = getCurrentKeyword();
  if (kw) {
    performSearch();
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleGlobalKeydown);

  if (import.meta.env.PROD) {
    if ((window as any).pagefind) {
      initialize();
    } else {
      window.addEventListener('pagefindready', initialize, { once: true });
      window.addEventListener('pagefindloaderror', initialize, { once: true });
    }
  } else {
    console.log('Development search mode enabled');
    initialize();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style>
mark {
  background: transparent;
  color: var(--color-primary-500);
  font-weight: 600;
  padding: 0 0.1em;
}
.dark mark {
  color: var(--color-primary-400);
}

.search-panel {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}
.search-panel.panel-closed {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
  pointer-events: none;
}
</style>
