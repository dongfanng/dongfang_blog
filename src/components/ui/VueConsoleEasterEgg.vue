<template></template>

<script setup lang="ts">
import { onMounted } from 'vue';

const asciiArt = `
  ██████╗ ██████╗ ███╗   ██╗ ██████╗ ███████╗ █████╗ ███╗   ██╗ ██████╗
  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗████╗  ██║██╔════╝
  ██║  ██║██║   ██║██╔██╗ ██║██║  ███╗█████╗  ███████║██╔██╗ ██║██║  ███╗
  ██║  ██║██║   ██║██║╚██╗██║██║   ██║██╔══╝  ██╔══██║██║╚██╗██║██║   ██║
  ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝██║     ██║  ██║██║ ╚████║╚██████╔╝
  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝

  ██████╗ ██╗      ██████╗  ██████╗
  ██╔══██╗██║     ██╔═══██╗██╔════╝
  ██████╔╝██║     ██║   ██║██║  ███╗
  ██╔══██╗██║     ██║   ██║██║   ██║
  ██████╔╝███████╗╚██████╔╝╚██████╔╝
  ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝

  欢迎来到东方的博客！🎉 (Vue 版本)
`;

onMounted(() => {
  const themePrimary = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#3b82f6';
  console.log('%c' + asciiArt, `color: ${themePrimary}; font-family: monospace; font-size: 12px;`);
  console.log('%c发现你打开了控制台，真不错！', 'color: #10b981; font-size: 14px; font-weight: bold;');
  console.log('%c既然来了，随便看看代码吧～', 'color: #6b7280;');
  console.log('%c有什么问题欢迎联系我！', 'color: #6b7280;');
  console.log('');

  const startDate = new Date('2026-07-18T00:00:00');
  const days = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  console.log('%c📚 博客已运行: %c' + days + '%c 天', `color: ${themePrimary};`, 'color: #10b981; font-weight: bold;', `color: ${themePrimary};`);
});
</script>
