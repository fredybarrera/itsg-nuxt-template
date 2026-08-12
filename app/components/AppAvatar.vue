<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

const {
  initials,
  color = 'var(--color-corteza)',
  textColor = '#fff',
  size = 'md',
} = defineProps<{
  initials: string
  color?: string
  textColor?: string
  size?: Size
}>()

const sizeClasses: Record<Size, string> = {
  sm: 'w-[26px] h-[26px] text-[10.5px]',
  md: 'w-9 h-9 text-[12.5px]',
  lg: 'w-12 h-12 text-[15px]',
}
</script>

<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center font-mono font-bold shrink-0 border-2 border-card',
      sizeClasses[size],
    ]"
    :style="{ background: color, color: textColor }"
  >
    {{ initials }}
  </div>
</template>
