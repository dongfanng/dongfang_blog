<template>
  <svg
    v-if="body"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="body"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getIconPath, type IconName } from './icon-paths';

interface Props {
  icon: IconName;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const className = computed(() => props.class);
const body = computed(() => getIconPath(props.icon));
</script>
