<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="frame">
    <div v-if="label" class="font-mono text-[11px] text-ink-soft tracking-[.04em] uppercase mb-4">
      {{ label }}
    </div>
    <slot />
  </div>
</template>
