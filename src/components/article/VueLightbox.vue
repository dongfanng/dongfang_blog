<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox-overlay" @click="close">
        <img :src="src" :alt="alt" class="lightbox-image" @click.stop />
        <button class="lightbox-close" @click="close" aria-label="关闭">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const visible = ref(false);
const src = ref('');
const alt = ref('');

function open(img: HTMLImageElement) {
  src.value = img.src;
  alt.value = img.alt;
  visible.value = true;
  document.body.style.overflow = 'hidden';
}

function close() {
  visible.value = false;
  document.body.style.overflow = '';
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) {
    close();
  }
}

function bindImages() {
  const prose = document.querySelector('.prose');
  if (!prose) return;

  const images = Array.from(prose.querySelectorAll('img'));
  images.forEach((img) => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(img));
  });
}

onMounted(() => {
  nextTick(bindImages);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('astro:page-load', bindImages);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('astro:page-load', bindImages);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  backdrop-filter: blur(4px);
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 0.5rem;
  cursor: default;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
