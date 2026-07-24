<template>
  <!-- 系列菜单链接列表：桌面下拉与移动端子菜单共用 -->
  <a
    href="/blog/series"
    :class="linkClass"
    @click="emit('select')"
  >
    <span class="font-medium text-gray-700 dark:text-gray-200">全部系列</span>
    <span class="text-xs text-gray-400 dark:text-gray-500">{{ seriesList.length }}</span>
  </a>
  <div v-if="seriesList.length > 0" class="my-1 border-t border-gray-100 dark:border-gray-800" />
  <a
    v-for="series in seriesList"
    :key="series.name"
    :href="getSeriesHref(series.name)"
    :class="linkClass"
    @click="emit('select')"
  >
    <span class="truncate">{{ series.name }}</span>
    <span class="shrink-0 text-xs text-gray-400 dark:text-gray-500">{{ series.count }} 篇</span>
  </a>
</template>

<script setup lang="ts">
import type { SeriesListItem } from '@/utils/posts';
import { getSeriesHref } from '@/utils/posts';

defineProps<{
  seriesList: SeriesListItem[];
}>();

const emit = defineEmits<{
  select: [];
}>();

const linkClass =
  'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400 dark:focus-visible:ring-primary-400';
</script>
