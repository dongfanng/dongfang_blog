<template>
  <button
    v-show="isVisible"
    @click="scrollToTop"
    class="fixed bottom-8 right-8 p-3 rounded-full shadow-lg hover:opacity-80 transition-all duration-200 text-white bg-primary-500 dark:bg-primary-400"
    aria-label="回到顶部"
  >
    <VueIcon icon="lucide:arrow-up" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import VueIcon from './VueIcon.vue';

const isVisible = ref(false);

function handleScroll() {
  isVisible.value = window.scrollY > 300;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
