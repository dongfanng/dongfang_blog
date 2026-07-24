<template>
  <!--
    顶栏结构（后续改设计时对照）：
    - 左：站点名
    - 右 nav：配置项（普通链 / dropdown 系列）→ 搜索 → 主题 → 移动端菜单按钮
    - 下方：仅 sm 以下展开的移动端菜单
    桌面用 CSS hover/focus-within 下拉；移动端用 button + v-show 展开子级。
  -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="container-prose">
      <div class="flex items-center justify-between h-16">
        <!-- 品牌 / 回首页 -->
        <a href="/" class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {{ siteConfig.name }}
        </a>

        <nav class="flex items-center gap-3">
          <!-- 主导航：顺序与 siteConfig.nav 一致；带 dropdown 的项渲染为系列菜单 -->
          <template v-for="item in siteConfig.nav" :key="item.href">
            <!-- 系列：桌面悬停 / 键盘 focus-within 下拉（sm+） -->
            <div v-if="hasDropdown(item)" class="group relative hidden sm:block">
              <a :href="item.href" :class="[desktopLinkClass, 'gap-1']">
                {{ item.title }}
                <VueIcon
                  icon="lucide:chevron-down"
                  class="text-sm transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                />
              </a>
              <!-- pt-2 扩大悬停热区，避免移入面板时中间断档 -->
              <div
                class="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              >
                <div class="rounded-xl border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
                  <HeaderSeriesLinks :series-list="seriesList" />
                </div>
              </div>
            </div>

            <!-- 普通导航链（桌面） -->
            <a v-else :href="item.href" :class="desktopLinkClass">
              {{ item.title }}
            </a>
          </template>

          <!-- 搜索（桌面输入框 + 移动端入口，由 VueSearch 内部适配） -->
          <VueSearch />

          <!-- 主题切换：用 CSS dark: 切图标，避免 JS isDark 与 SSR/VT 不同步 -->
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="切换主题"
            @click="toggleTheme"
          >
            <!-- 深色模式：太阳（点一下切回浅色） -->
            <VueIcon icon="lucide:sun" class="text-[1.25rem] text-yellow-500 hidden dark:block" />
            <!-- 浅色模式：月亮 -->
            <VueIcon icon="lucide:moon" class="text-[1.25rem] text-gray-600 dark:text-gray-400 block dark:hidden" />
          </button>

          <!-- 移动端汉堡 / 关闭 -->
          <button
            type="button"
            class="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="菜单"
            @click="toggleMobileMenu"
          >
            <VueIcon
              :icon="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
              class="text-[1.25rem] text-gray-600 dark:text-gray-300"
            />
          </button>
        </nav>
      </div>
    </div>

    <!-- 移动端抽屉：点击链接后 closeMobileMenu；系列为可折叠子菜单 -->
    <div v-show="mobileMenuOpen" class="sm:hidden border-t border-gray-200 dark:border-gray-800">
      <div class="container-prose py-2">
        <template v-for="item in siteConfig.nav" :key="`m-${item.href}`">
          <!-- 系列：点击展开/收起子列表 -->
          <div v-if="hasDropdown(item)">
            <button
              type="button"
              :class="[mobileLinkClass, 'flex w-full items-center justify-between']"
              :aria-expanded="mobileSeriesOpen"
              aria-controls="mobile-series-menu"
              @click="mobileSeriesOpen = !mobileSeriesOpen"
            >
              <span>{{ item.title }}</span>
              <VueIcon
                icon="lucide:chevron-down"
                :class="['text-base transition-transform', mobileSeriesOpen ? 'rotate-180' : '']"
              />
            </button>
            <div
              v-show="mobileSeriesOpen"
              id="mobile-series-menu"
              class="ml-3 border-l border-gray-200 py-1 pl-3 dark:border-gray-700"
            >
              <HeaderSeriesLinks :series-list="seriesList" @select="closeMobileMenu" />
            </div>
          </div>

          <!-- 普通导航链（移动端） -->
          <a
            v-else
            :href="item.href"
            :class="mobileLinkClass"
            @click="closeMobileMenu"
          >
            {{ item.title }}
          </a>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { siteConfig } from '@/config/site';
import type { SeriesListItem } from '@/utils/series';
import VueIcon from '../ui/VueIcon.vue';
import VueSearch from '../search/VueSearch.vue';
import HeaderSeriesLinks from './HeaderSeriesLinks.vue';

/** 构建期注入的系列列表（名 + 篇数），供下拉 / 移动端子菜单使用 */
defineProps<{
  seriesList: SeriesListItem[];
}>();

const mobileMenuOpen = ref(false);
/** 仅移动端：系列子菜单是否展开 */
const mobileSeriesOpen = ref(false);

/** 桌面导航链接样式（sm+ 显示） */
const desktopLinkClass =
  'hidden sm:inline-flex h-11 items-center text-gray-600 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:text-primary-400 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-900';

/** 移动端菜单项样式 */
const mobileLinkClass =
  'block rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400 dark:focus-visible:ring-primary-400';

/** siteConfig.nav 里带 dropdown 字段的项（当前为「系列」） */
function hasDropdown(item: (typeof siteConfig.nav)[number]) {
  return 'dropdown' in item;
}

function toggleTheme() {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  document.documentElement.classList.toggle('dark', next === 'dark');
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  // 收起主菜单时一并收起系列子级，避免下次打开仍是展开态
  if (!mobileMenuOpen.value) mobileSeriesOpen.value = false;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
  mobileSeriesOpen.value = false;
}
</script>
