<script setup lang="ts">
type Tone = 'primary' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    /** 0–100. Sin valor: modo indeterminado (barra animada). */
    value?: number
    tone?: Tone
    label?: string
    showValue?: boolean
  }>(),
  {
    value: undefined,
    tone: 'primary',
    label: undefined,
    showValue: false,
  }
)

const toneClasses: Record<Tone, string> = {
  primary: 'bg-calipso',
  success: 'bg-verde',
  warning: 'bg-amarillo',
  danger: 'bg-rojo-deep',
}

const clamped = computed(() =>
  props.value === undefined ? undefined : Math.min(100, Math.max(0, props.value))
)
</script>

<template>
  <div>
    <div v-if="label || showValue" class="mb-1.5 flex items-baseline justify-between gap-2">
      <span v-if="label" class="text-[13px] font-semibold text-ink">{{ label }}</span>
      <span v-if="showValue && clamped !== undefined" class="font-mono text-[12px] text-ink-soft"
        >{{ Math.round(clamped) }}%</span
      >
    </div>
    <div
      role="progressbar"
      :aria-valuenow="clamped"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
      class="h-2 overflow-hidden rounded-full bg-paper-2 border border-line"
    >
      <div
        class="h-full rounded-full transition-[width] duration-300"
        :class="[toneClasses[tone], clamped === undefined ? 'progress-indeterminate w-1/3' : '']"
        :style="clamped !== undefined ? { width: `${clamped}%` } : undefined"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-indeterminate {
  animation: progress-slide 1.2s ease-in-out infinite;
}
@keyframes progress-slide {
  0% {
    margin-left: -33%;
  }
  100% {
    margin-left: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .progress-indeterminate {
    animation: none;
    margin-left: 0;
    width: 100%;
    opacity: 0.5;
  }
}
</style>
