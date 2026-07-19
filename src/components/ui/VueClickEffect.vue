<template>
  <div ref="container" class="pointer-events-none fixed inset-0 z-50">
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="absolute rounded-full pointer-events-none"
      :style="getRippleStyle(ripple)"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const container = ref<HTMLElement>();
const ripples = ref<Ripple[]>([]);
let nextId = 0;

function createRipple(e: MouseEvent) {
  const ripple: Ripple = {
    id: nextId++,
    x: e.clientX,
    y: e.clientY,
  };
  ripples.value.push(ripple);

  // 350ms 后移除
  setTimeout(() => {
    const index = ripples.value.findIndex(r => r.id === ripple.id);
    if (index > -1) {
      ripples.value.splice(index, 1);
    }
  }, 350);
}

function getRippleStyle(ripple: Ripple) {
  const themePrimary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6';
  return {
    left: `${ripple.x}px`,
    top: `${ripple.y}px`,
    width: '60px',
    height: '60px',
    marginLeft: '-30px',
    marginTop: '-30px',
    backgroundColor: `color-mix(in srgb, ${themePrimary} 25%, transparent)`,
    transform: 'scale(0)',
    animation: 'ripple-anim 0.35s ease-out',
  };
}

onMounted(() => {
  document.addEventListener('click', createRipple);
});

onUnmounted(() => {
  document.removeEventListener('click', createRipple);
});
</script>

<style>
@keyframes ripple-anim {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}
</style>
