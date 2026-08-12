<script setup lang="ts">
type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'neutral' })

const toneClasses: Record<Tone, string> = {
  success: 'bg-verde/16 text-success-ink',
  warning: 'bg-amarillo/22 text-warning-ink',
  danger: 'bg-rojo/16 text-rojo-deep',
  info: 'bg-calipso/16 text-primary-ink',
  neutral: 'bg-paper-2 text-ink-soft',
}

const classes = computed(() => [
  'inline-flex items-center gap-1.5 text-[11.5px] font-bold tracking-[.01em] px-[11px] py-1 rounded-full',
  toneClasses[props.tone],
])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
