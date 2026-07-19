<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {{ siteConfig.name }}
        </a>
        <nav class="flex items-center gap-3">
          <a
            v-for="item in siteConfig.nav"
            :key="item.href"
            :href="item.href"
            class="hidden sm:inline-flex text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ item.title }}
          </a>
          <!-- 搜索按钮（由 VueSearch 组件提供） -->
          <VueSearch />
          <!-- 主题切换按钮 -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="切换主题"
          >
            <!-- 深色模式时显示太阳 -->
            <VueIcon v-if="isDark" icon="lucide:sun" class="text-yellow-500" />
            <!-- 浅色模式时显示月亮 -->
            <VueIcon v-else icon="lucide:moon" class="text-gray-600 dark:text-gray-400" />
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { siteConfig } from '@/config/site';
import VueIcon from '../ui/VueIcon.vue';
import VueSearch from '../search/VueSearch.vue';

const isDark = ref(false);

function setTheme(theme: string) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    isDark.value = true;
  } else {
    document.documentElement.classList.remove('dark');
    isDark.value = false;
  }
}

function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  setTheme(newTheme);
}

onMounted(() => {
  // 同步 isDark 状态，主题已经在 BaseHead 中设置好了
  isDark.value = document.documentElement.classList.contains('dark');
});
</script>
