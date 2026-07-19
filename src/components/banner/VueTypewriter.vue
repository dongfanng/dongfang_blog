<template>
  <span class="inline-block">
    <span class="inline-block">{{ displayedText }}</span>
    <span
      v-if="showCursor"
      class="inline-block w-0.5 h-6 md:h-8 align-middle ml-1 animate-pulse"
      :style="{ backgroundColor: cursorColor }"
    ></span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface Props {
  /** 要显示的文本 */
  text: string;
  /** 打字速度（毫秒/字） */
  speed?: number;
  /** 是否显示光标 */
  showCursor?: boolean;
  /** 光标颜色 */
  cursorColor?: string;
  /** 延迟开始时间（毫秒） */
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 80,
  showCursor: true,
  cursorColor: 'currentColor',
  delay: 300,
});

const displayedText = ref('');
const isTyping = ref(false);
let timeoutId: number | null = null;
let currentIndex = 0;

function startTyping() {
  if (isTyping.value || currentIndex >= props.text.length) return;

  isTyping.value = true;

  function typeNext() {
    if (currentIndex < props.text.length) {
      displayedText.value = props.text.slice(0, currentIndex + 1);
      currentIndex++;
      timeoutId = window.setTimeout(typeNext, props.speed);
    } else {
      isTyping.value = false;
    }
  }

  timeoutId = window.setTimeout(typeNext, props.delay);
}

function resetTyping() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  displayedText.value = '';
  currentIndex = 0;
  isTyping.value = false;
}

watch(() => props.text, () => {
  resetTyping();
  startTyping();
});

onMounted(() => {
  startTyping();
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
