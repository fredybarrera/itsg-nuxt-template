<script setup lang="ts">
withDefaults(defineProps<{ text: string; placement?: 'top' | 'bottom' | 'left' | 'right' }>(), {
  placement: 'top',
})
</script>

<template>
  <span class="tooltip" :data-tooltip="text" :data-placement="placement" tabindex="0">
    <slot />
  </span>
</template>
