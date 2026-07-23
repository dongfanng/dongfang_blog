<template>
  <section v-if="enabled" class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">评论</h2>
    <div v-show="!loaded" class="flex justify-center py-4">
      <button
        @click="loadComments"
        class="inline-flex items-center gap-2 px-4 h-11 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <VueIcon icon="lucide:message-circle" class="text-[1.25rem]" />
        查看评论
      </button>
    </div>
    <div v-show="loaded" ref="giscusContainer" class="giscus"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import VueIcon from '../ui/VueIcon.vue';
import { siteConfig } from '@/config/site';

const { repo, repoId, category, categoryId } = siteConfig.comment;
const enabled = !!(repoId && categoryId);

const loaded = ref(false);
const giscusContainer = ref<HTMLElement | null>(null);
let observer: MutationObserver | null = null;

function getGiscusTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

async function loadComments() {
  loaded.value = true;
  await nextTick();

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', repo);
  script.setAttribute('data-repo-id', repoId);
  script.setAttribute('data-category', category);
  script.setAttribute('data-category-id', categoryId);
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '1');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', getGiscusTheme());
  script.setAttribute('data-lang', 'zh-CN');
  script.setAttribute('data-loading', 'lazy');
  script.crossOrigin = 'anonymous';
  script.async = true;

  giscusContainer.value?.appendChild(script);
}

function updateGiscusTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: getGiscusTheme() } } },
      'https://giscus.app',
    );
  }
}

onMounted(() => {
  observer = new MutationObserver(() => {
    if (loaded.value) updateGiscusTheme();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
