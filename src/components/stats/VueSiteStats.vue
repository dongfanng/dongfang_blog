<template>
  <span class="text-gray-500 dark:text-gray-400 text-sm">
    已运行 {{ days }}天 {{ hours.toString().padStart(2, '0') }}:{{ minutes.toString().padStart(2, '0') }}:{{ seconds.toString().padStart(2, '0') }}
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { siteConfig } from '@/config/site';

const startDate = new Date(siteConfig.startDate);

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let intervalId: number | null = null;

function updateTime() {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
}

onMounted(() => {
  updateTime();
  intervalId = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
