<script setup lang="ts">
defineProps<{
  name: string
  /** Optional override — defaults to the 18px set on .icon in main.css */
  size?: number
}>()
</script>

<template>
  <svg class="icon" :style="size ? { width: `${size}px`, height: `${size}px` } : undefined">
    <use :href="`#i-${name}`" />
  </svg>
</template>
