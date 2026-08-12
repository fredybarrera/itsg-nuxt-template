<script setup lang="ts">
export interface SegmentedOption {
  value: string
  label: string
  icon?: string
}

defineProps<{ options: SegmentedOption[] }>()
const model = defineModel<string>()
</script>

<template>
  <div class="inline-flex bg-paper-2 rounded-md p-1 gap-0.5" role="tablist">
    <button
      v-for="opt in options"
      :key="opt.value"
      role="tab"
      :aria-selected="model === opt.value"
      :class="[
        'border-none py-2 px-4 text-[13px] font-semibold rounded-sm cursor-pointer font-body inline-flex items-center gap-1.5',
        model === opt.value ? 'bg-card text-ink shadow-sm' : 'bg-transparent text-ink-soft',
      ]"
      @click="model = opt.value"
    >
      <AppIcon v-if="opt.icon" :name="opt.icon" :size="14" />
      {{ opt.label }}
    </button>
  </div>
</template>
