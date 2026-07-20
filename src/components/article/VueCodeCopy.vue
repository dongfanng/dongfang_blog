<template></template>

<script setup lang="ts">
import { onMounted } from 'vue';

/**
 * 复制按钮必须挂在不产生横向滚动的包裹层上，
 * 不能放进带 overflow-x: auto 的 pre 里，否则会随滚动条移动。
 */
function getOrCreateWrapper(block: HTMLElement): HTMLElement {
  const figure = block.closest('figure[data-rehype-pretty-code-figure]');
  if (figure instanceof HTMLElement) {
    return figure;
  }

  const parent = block.parentElement;
  if (parent?.classList.contains('code-block-wrapper')) {
    return parent;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  block.parentNode?.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  return wrapper;
}

onMounted(() => {
  document.querySelectorAll('pre').forEach((block) => {
    const wrapper = getOrCreateWrapper(block);
    wrapper.classList.add('code-block-wrapper');

    // 语言标签改挂在包裹层，避免随 pre 横向滚动
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
      if (code) {
        await navigator.clipboard.writeText(code.innerText);
        const copyIcon = button.querySelector('.copy-icon') as HTMLElement;
        const checkIcon = button.querySelector('.check-icon') as HTMLElement;
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
        }, 2000);
      }
    });

    wrapper.appendChild(button);
  });
});
</script>
