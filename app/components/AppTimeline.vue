<script setup lang="ts">
export interface TimelineEvent {
  time: string
  title: string
  desc: string
  tone?: 'default' | 'warning' | 'danger' | 'neutral'
}

defineProps<{ events: TimelineEvent[] }>()

const markerTone: Record<string, string> = {
  default: 'bg-calipso',
  warning: 'bg-amarillo',
  danger: 'bg-rojo-deep',
  neutral: 'bg-ink-soft',
}
</script>

<template>
  <div class="relative pl-[26px]">
    <div class="absolute left-1 top-1 bottom-1 w-px bg-line-strong" />
    <div v-for="(e, i) in events" :key="i" class="relative pb-6 last:pb-0">
      <span
        :class="[
          'absolute -left-[26px] top-[3px] w-2.5 h-2.5 rounded-full border-2 border-card shadow-[0_0_0_1px_var(--color-line-strong)]',
          markerTone[e.tone || 'default'],
        ]"
      />
      <div class="font-mono text-[11px] text-ink-soft mb-1">{{ e.time }}</div>
      <div class="font-semibold text-[13.5px] mb-0.5">{{ e.title }}</div>
      <div class="text-[13px] text-ink-soft">{{ e.desc }}</div>
    </div>
  </div>
</template>
