<script setup lang="ts">
defineProps<{ icon?: string; title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col items-center text-center py-12 px-6">
    <div class="w-14 h-14 rounded-full bg-paper-2 flex items-center justify-center mb-[18px] text-ink-soft">
      <AppIcon v-if="icon" :name="icon" :size="26" />
    </div>
    <h3 class="font-display text-[17px] mb-2">{{ title }}</h3>
    <p v-if="description" class="text-[13.5px] text-ink-soft max-w-[320px] mb-5">{{ description }}</p>
    <slot />
  </div>
</template>
