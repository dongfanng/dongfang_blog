<template>
  <!-- 单根节点：承接 transition:persist 落下的 attribute -->
  <span class="hidden" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const asciiArt = `
██████╗  ██████╗ ███╗   ██╗ ██████╗ ███████╗ █████╗ ███╗   ██╗ ██████╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗████╗  ██║██╔════╝
██║  ██║██║   ██║██╔██╗ ██║██║  ███╗█████╗  ███████║██╔██╗ ██║██║  ███╗
██║  ██║██║   ██║██║╚██╗██║██║   ██║██╔══╝  ██╔══██║██║╚██╗██║██║   ██║
██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝██║     ██║  ██║██║ ╚████║╚██████╔╝
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝
`;

const PRINTED_KEY = '__dongfangConsoleEggPrinted';

onMounted(() => {
  // window 标记更稳：VT 换页时模块可能被重新求值，模块级变量会丢
  const w = window as Window & { [PRINTED_KEY]?: boolean };
  if (w[PRINTED_KEY]) return;
  w[PRINTED_KEY] = true;

  const themePrimary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6';
  console.log('%c' + asciiArt, `color: ${themePrimary}; font-family: monospace; font-size: 12px;`);
  console.log('%c既然来了，随便看看代码吧～', 'color: #6b7280;');
  console.log('%c有什么问题欢迎联系我！', 'color: #6b7280;');
});
</script>
