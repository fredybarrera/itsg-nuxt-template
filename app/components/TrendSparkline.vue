<script setup lang="ts">
/**
 * Change-over-time for a single series — line + faint area fill, direct
 * label on the last point instead of a legend (one series needs no legend
 * box; the label names it).
 */
const props = defineProps<{
  data: number[]
  label?: string
  unit?: string
  formatValue?: (v: number) => string
}>()

const width = 340
const height = 80
const padTop = 10
const padBottom = 10
const padLeft = 10
const padRight = 70

const format = (v: number) => (props.formatValue ? props.formatValue(v) : v.toLocaleString('es-CL'))

const points = computed(() => {
  const vals = props.data
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const range = max - min || 1
  const plotWidth = width - padLeft - padRight
  const plotHeight = height - padTop - padBottom
  return vals.map((v, i) => ({
    x: padLeft + (i / (vals.length - 1)) * plotWidth,
    y: padTop + plotHeight - ((v - min) / range) * plotHeight,
    v,
  }))
})

const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '))
const areaPath = computed(() => {
  const pts = points.value
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${linePath.value} L${last.x},${height - padBottom} L${first.x},${height - padBottom} Z`
})
const lastPoint = computed(() => points.value[points.value.length - 1])
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
      :aria-label="label || 'Tendencia'"
    >
      <path :d="areaPath" class="fill-calipso" opacity="0.1" stroke="none" />
      <path
        :d="linePath"
        fill="none"
        class="stroke-calipso"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle :cx="lastPoint.x" :cy="lastPoint.y" r="5" class="fill-calipso stroke-card" stroke-width="2" />
      <text :x="lastPoint.x + 12" :y="lastPoint.y + 4" class="font-mono text-xs font-bold fill-ink">
        {{ format(lastPoint.v) }}{{ unit ? ' ' + unit : '' }}
      </text>
    </svg>
  </div>
</template>
