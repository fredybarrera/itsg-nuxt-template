<script setup lang="ts">
defineProps<{
  variant?: 'line' | 'block' | 'avatar'
  width?: string
  height?: string
  rows?: number
}>()
</script>

<template>
  <div v-if="variant === 'avatar'" class="h-9 w-9 shrink-0 animate-pulse rounded-full bg-paper-2" />
  <div
    v-else-if="variant === 'block'"
    class="animate-pulse rounded-(--radius-md) bg-paper-2"
    :style="{ height: height ?? '80px', width: width ?? '100%' }"
  />
  <div v-else class="flex flex-col gap-2">
    <div
      v-for="i in rows ?? 1"
      :key="i"
      class="animate-pulse rounded bg-paper-2"
      :style="{ height: height ?? '14px', width: i === (rows ?? 1) ? '60%' : (width ?? '100%') }"
    />
  </div>
</template>
