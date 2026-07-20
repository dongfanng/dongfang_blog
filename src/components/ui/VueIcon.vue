<template>
  <Icon :icon="icon" :class="className" width="1em" height="1em" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Props {
  icon: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const className = props.class;
</script>
