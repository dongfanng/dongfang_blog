<template>
  <Icon :icon="icon" :class="className" :style="iconStyle" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { IconifyIcon } from '@iconify/vue';

interface Props {
  icon: string | IconifyIcon;
  size?: string | number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  class: '',
});

const className = props.class;
const iconStyle = typeof props.size === 'number'
  ? { width: `${props.size}px`, height: `${props.size}px` }
  : {};
</script>
