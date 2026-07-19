<template>
  <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
    <div
      class="h-full transition-none theme-primary-bg"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

function handleScroll() {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.value = scrollHeight > 0 ? (winScroll / scrollHeight) * 100 : 0;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  // 也在 resize 时更新
  window.addEventListener('resize', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>
