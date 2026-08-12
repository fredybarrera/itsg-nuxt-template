<script setup lang="ts">
withDefaults(defineProps<{ max?: number }>(), { max: 5 })
const model = defineModel<number>({ default: 0 })
const hovered = ref<number | null>(null)
</script>

<template>
  <div class="flex gap-1.5" @mouseleave="hovered = null">
    <button
      v-for="i in max"
      :key="i"
      type="button"
      class="bg-transparent border-none p-0 cursor-pointer"
      :class="(hovered ?? model) >= i ? 'text-amarillo' : 'text-line-strong'"
      :aria-label="`Calificar con ${i} estrella${i > 1 ? 's' : ''}`"
      @mouseenter="hovered = i"
      @click="model = i"
    >
      <AppIcon name="star" :size="20" :class="(hovered ?? model) >= i ? 'fill-current' : ''" />
    </button>
  </div>
</template>
