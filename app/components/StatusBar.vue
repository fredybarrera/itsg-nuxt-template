<script setup lang="ts">
/**
 * Part-to-whole for status — a single stacked bar, never a donut/pie.
 * Status color is always paired with an icon + label in the legend below,
 * so identity is never carried by color alone.
 */
export interface StatusSegment {
  label: string
  percent: number
  color: string
  icon: string
}

const props = defineProps<{ segments: StatusSegment[]; label?: string }>()

const width = 320
const height = 22
const radius = 4
const gap = 2

const parts = computed(() => {
  const n = props.segments.length
  const availableWidth = width - gap * (n - 1)
  let x = 0
  return props.segments.map((s, i) => {
    const segWidth = (s.percent / 100) * availableWidth
    const x1 = x
    const x2 = x + segWidth
    x = x2 + gap
    const isFirst = i === 0
    const isLast = i === n - 1

    let path: string
    if (isFirst && isLast) {
      path = `M${x1 + radius},0 L${x2 - radius},0 Q${x2},0 ${x2},${radius} L${x2},${height - radius} Q${x2},${height} ${x2 - radius},${height} L${x1 + radius},${height} Q${x1},${height} ${x1},${height - radius} L${x1},${radius} Q${x1},0 ${x1 + radius},0 Z`
    } else if (isFirst) {
      path = `M${x1 + radius},0 L${x2},0 L${x2},${height} L${x1 + radius},${height} Q${x1},${height} ${x1},${height - radius} L${x1},${radius} Q${x1},0 ${x1 + radius},0 Z`
    } else if (isLast) {
      path = `M${x1},0 L${x2 - radius},0 Q${x2},0 ${x2},${radius} L${x2},${height - radius} Q${x2},${height} ${x2 - radius},${height} L${x1},${height} Z`
    } else {
      path = `M${x1},0 L${x2},0 L${x2},${height} L${x1},${height} Z`
    }
    return { ...s, path }
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
      aria-label="Distribución de estado"
    >
      <path v-for="(p, i) in parts" :key="i" :d="p.path" :fill="p.color">
        <title>{{ p.label }}: {{ p.percent }}%</title>
      </path>
    </svg>
    <div class="flex flex-wrap gap-4 mt-4">
      <div v-for="(s, i) in segments" :key="i" class="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
        <span class="w-[9px] h-[9px] rounded-full shrink-0" :style="{ background: s.color }" />
        <AppIcon :name="s.icon" :size="13" class="shrink-0" />
        {{ s.label }} — {{ s.percent }}%
      </div>
    </div>
  </div>
</template>
