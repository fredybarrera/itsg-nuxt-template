<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Diámetro en px. Hereda el color del texto (currentColor). */
    size?: number
    label?: string
  }>(),
  {
    size: 20,
    label: 'Cargando…',
  }
)
</script>

<template>
  <span
    role="status"
    :aria-label="label"
    class="inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>
