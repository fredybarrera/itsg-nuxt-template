<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'
type Sentiment = 'positive' | 'negative' | 'neutral'

const props = withDefaults(
  defineProps<{
    label: string
    value: string
    unit?: string
    /** Dirección de la flecha (up/down). Es solo la dirección, no el color. */
    trend: 'up' | 'down'
    trendLabel: string
    /**
     * Color del indicador, independiente de la flecha. Por defecto se deriva de
     * `trend` (up→positive, down→negative); pásalo cuando dirección y sentido no
     * coincidan, p. ej. mermas o dependencias que bajan (flecha abajo, positivo).
     */
    sentiment?: Sentiment
    size?: Size
  }>(),
  { unit: undefined, sentiment: undefined, size: 'md' }
)

const sentiment = computed<Sentiment>(
  () => props.sentiment ?? (props.trend === 'up' ? 'positive' : 'negative')
)

const toneClasses: Record<Sentiment, { stripe: string; text: string }> = {
  positive: { stripe: 'before:bg-success-ink', text: 'text-success-ink' },
  negative: { stripe: 'before:bg-rojo-deep', text: 'text-rojo-deep' },
  neutral: { stripe: 'before:bg-line-strong', text: 'text-ink-soft' },
}
const stripeClass = computed(() => toneClasses[sentiment.value].stripe)
const trendClass = computed(() => toneClasses[sentiment.value].text)

const sizeClasses: Record<
  Size,
  { root: string; label: string; value: string; unit: string; trend: string; icon: number }
> = {
  sm: {
    root: 'py-3.5 pr-4 pl-5',
    label: 'text-[11px] mb-1.5',
    value: 'text-[20px]',
    unit: 'text-[11.5px]',
    trend: 'text-[11px] mt-1.5',
    icon: 12,
  },
  md: {
    root: 'py-5 pr-5 pl-6',
    label: 'text-xs mb-2.5',
    value: 'text-[26px]',
    unit: 'text-[13px]',
    trend: 'text-xs mt-2.5',
    icon: 13,
  },
  lg: {
    root: 'py-7 pr-6 pl-7',
    label: 'text-[12.5px] mb-3',
    value: 'text-[34px]',
    unit: 'text-sm',
    trend: 'text-xs mt-3',
    icon: 15,
  },
}

const s = computed(() => sizeClasses[props.size])
</script>

<template>
  <div
    :class="[
      'relative overflow-hidden bg-card border border-line rounded-md',
      s.root,
      'before:content-[\'\'] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1',
      stripeClass,
    ]"
  >
    <div class="text-ink-soft" :class="s.label">{{ label }}</div>
    <div class="font-bold font-display text-ink tabular-nums" :class="s.value">
      {{ value }}<span v-if="unit" class="text-ink-soft font-normal ml-0.5" :class="s.unit">{{ unit }}</span>
    </div>
    <div :class="['inline-flex items-center gap-1.5 font-semibold', s.trend, trendClass]">
      <AppIcon :name="trend === 'up' ? 'trendup' : 'trenddown'" :size="s.icon" />
      {{ trendLabel }}
    </div>
  </div>
</template>
