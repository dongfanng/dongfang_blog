<template></template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

/**
 * 根据滚动位置,高亮 TOC 中当前章节对应的链接
 * 通过 .toc-active 类标记(由 global.css 控制样式)
 */
function updateActive() {
  const headings = Array.from(
    document.querySelectorAll('.prose h2, .prose h3, .prose h4')
  ) as HTMLElement[];

  if (headings.length === 0) return;

  const scrollY = window.scrollY;
  const offset = 120; // sticky header 高度 + 余量
  let activeId: string | null = null;

  for (const h of headings) {
    if (h.offsetTop - offset <= scrollY) {
      activeId = h.id;
    } else {
      break;
    }
  }

  // 滚动到顶部之前,默认高亮第一个
  if (activeId === null) {
    activeId = headings[0].id;
  }

  document.querySelectorAll('.toc a').forEach((a) => {
    a.classList.remove('toc-active');
  });

  if (activeId) {
    const link = document.querySelector(`.toc a[href="#${activeId}"]`);
    link?.classList.add('toc-active');
  }
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateActive();
    ticking = false;
  });
}

onMounted(() => {
  // 等待 DOM 渲染完毕
  requestAnimationFrame(updateActive);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('astro:page-load', updateActive);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  document.removeEventListener('astro:page-load', updateActive);
});
</script>
