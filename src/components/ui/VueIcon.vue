<template>
  <svg
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
  >
    <template v-if="name === 'arrow-up'">
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </template>
    <template v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path d="m9 18 6-6-6-6" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </template>
    <template v-else-if="name === 'message-circle'">
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </template>
    <template v-else-if="name === 'search'">
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </template>
    <template v-else-if="name === 'x'">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const className = computed(() => props.class);
const name = computed(() => props.icon.replace(/^lucide:/, ''));
</script>
