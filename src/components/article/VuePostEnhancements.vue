<template>
  <!-- 阅读进度 -->
  <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
    <div
      class="h-full bg-primary-500 dark:bg-primary-400"
      :style="{ width: progress + '%' }"
    />
  </div>

  <!-- 回到顶部 -->
  <button
    v-show="showBackToTop"
    type="button"
    class="fixed bottom-8 right-8 p-3 rounded-full shadow-lg hover:opacity-80 transition-all duration-200 text-white bg-primary-500 dark:bg-primary-400"
    aria-label="回到顶部"
    @click="scrollToTop"
  >
    <VueIcon icon="lucide:arrow-up" />
  </button>

  <!-- 图片灯箱 -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="lightboxVisible" class="lightbox-overlay" @click="closeLightbox">
        <img :src="lightboxSrc" :alt="lightboxAlt" class="lightbox-image" @click.stop />
        <button type="button" class="lightbox-close" aria-label="关闭" @click="closeLightbox">
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
import VueIcon from '../ui/VueIcon.vue';

const progress = ref(0);
const showBackToTop = ref(false);

const lightboxVisible = ref(false);
const lightboxSrc = ref('');
const lightboxAlt = ref('');

function updateScrollUi() {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.value = scrollHeight > 0 ? (winScroll / scrollHeight) * 100 : 0;
  showBackToTop.value = winScroll > 300;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLightbox(img: HTMLImageElement) {
  lightboxSrc.value = img.src;
  lightboxAlt.value = img.alt;
  lightboxVisible.value = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxVisible.value = false;
  document.body.style.overflow = '';
}

function bindLightboxImages() {
  const prose = document.querySelector('.prose');
  if (!prose) return;
  prose.querySelectorAll('img').forEach((img) => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });
}

function updateTocActive() {
  const headings = Array.from(
    document.querySelectorAll('.prose h2, .prose h3, .prose h4'),
  ) as HTMLElement[];
  if (headings.length === 0) return;

  const scrollY = window.scrollY;
  const offset = 120;
  let activeId: string | null = null;

  for (const h of headings) {
    if (h.offsetTop - offset <= scrollY) activeId = h.id;
    else break;
  }
  if (activeId === null) activeId = headings[0].id;

  document.querySelectorAll('.toc a').forEach((a) => a.classList.remove('toc-active'));
  if (activeId) {
    document.querySelector(`.toc a[href="#${activeId}"]`)?.classList.add('toc-active');
  }
}

let scrollTicking = false;
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollUi();
    updateTocActive();
    scrollTicking = false;
  });
}

function getOrCreateCodeWrapper(block: HTMLElement): HTMLElement {
  const figure = block.closest('figure[data-rehype-pretty-code-figure]');
  if (figure instanceof HTMLElement) return figure;

  const parent = block.parentElement;
  if (parent?.classList.contains('code-block-wrapper')) return parent;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  block.parentNode?.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  return wrapper;
}

function setupCodeCopy() {
  document.querySelectorAll('pre').forEach((block) => {
    const wrapper = getOrCreateCodeWrapper(block);
    wrapper.classList.add('code-block-wrapper');

    const language = block.getAttribute('data-language');
    const hasTitle = Boolean(wrapper.querySelector('figcaption'));
    if (language && !hasTitle) {
      wrapper.setAttribute('data-code-language', language);
    } else {
      wrapper.removeAttribute('data-code-language');
    }

    if (wrapper.querySelector(':scope > .copy-button')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button absolute top-2 right-2 z-10 w-8 h-8 p-0 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer opacity-0 transition-opacity duration-200 flex items-center justify-center';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg class="copy-icon w-4 h-4 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
      <svg class="check-icon w-4 h-4 text-green-500 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    const showButton = () => { button.style.opacity = '1'; };
    const hideButton = () => { button.style.opacity = '0'; };
    wrapper.addEventListener('mouseenter', showButton);
    wrapper.addEventListener('mouseleave', hideButton);

    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const code = block.querySelector('code');
      if (!code) return;
      await navigator.clipboard.writeText(code.innerText);
      const copyIcon = button.querySelector('.copy-icon') as HTMLElement;
      const checkIcon = button.querySelector('.check-icon') as HTMLElement;
      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
      }, 2000);
    });

    wrapper.appendChild(button);
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && lightboxVisible.value) closeLightbox();
}

function onPageLoad() {
  nextTick(() => {
    bindLightboxImages();
    setupCodeCopy();
    updateTocActive();
    updateScrollUi();
  });
}

onMounted(() => {
  onPageLoad();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('astro:page-load', onPageLoad);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('astro:page-load', onPageLoad);
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
