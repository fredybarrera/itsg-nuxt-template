<script setup lang="ts">
/**
 * Magnitude comparison — single sequential hue (calipso), rounded data-ends,
 * direct value labels. Never use this for identity/categorical comparisons
 * across unrelated series; that needs a categorical palette instead.
 */
export interface BarDatum {
  label: string
  value: number
}

const props = defineProps<{
  data: BarDatum[]
  label?: string
  unit?: string
  formatValue?: (v: number) => string
}>()

const width = 320
const height = 155
const baseline = 120
const topPadding = 20
const barWidth = 22
const radius = 4

const format = (v: number) => (props.formatValue ? props.formatValue(v) : v.toLocaleString('es-CL'))
const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))

const bars = computed(() => {
  const n = props.data.length
  const slotWidth = (width - 12) / n
  return props.data.map((d, i) => {
    const cx = 6 + slotWidth * (i + 0.5)
    const barHeight = (d.value / maxValue.value) * (baseline - topPadding)
    const yTop = baseline - barHeight
    const x1 = cx - barWidth / 2
    const x2 = cx + barWidth / 2
    const r = Math.min(radius, barHeight)
    const path =
      barHeight <= 0
        ? `M${x1},${baseline} L${x2},${baseline} Z`
        : `M${x1},${yTop + r} Q${x1},${yTop} ${x1 + r},${yTop} L${x2 - r},${yTop} Q${x2},${yTop} ${x2},${yTop + r} L${x2},${baseline} L${x1},${baseline} Z`
    return { ...d, cx, path, valueY: Math.max(yTop - 8, 12) }
  })
})
</script>

<template>
  <div>
    <div v-if="label" class="font-mono text-[11px] tracking-[.05em] uppercase text-ink-soft mb-3.5">
      {{ label }}
    </div>
    <svg
      class="w-full h-auto block"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="`Gráfico de barras: ${data.map((d) => `${d.label} ${format(d.value)}`).join(', ')}`"
    >
      <line
        x1="6"
        :y1="baseline"
        :x2="width - 6"
        :y2="baseline"
        class="stroke-line-strong"
        stroke-width="1"
      />
      <template v-for="(b, i) in bars" :key="i">
        <path :d="b.path" class="fill-calipso">
          <title>{{ b.label }}: {{ format(b.value) }}{{ unit ? ' ' + unit : '' }}</title>
        </path>
        <text :x="b.cx" :y="b.valueY" text-anchor="middle" class="font-mono text-[11px] fill-ink">
          {{ format(b.value) }}
        </text>
        <text :x="b.cx" y="136" text-anchor="middle" class="font-mono text-[10px] fill-ink-soft">
          {{ b.label }}
        </text>
      </template>
    </svg>
  </div>
</template>
