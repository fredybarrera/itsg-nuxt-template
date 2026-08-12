<script setup lang="ts">
defineProps<{
  tabs: { key: string; label: string; show?: boolean; icon?: string; count?: number }[]
  modelValue: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="mb-6 flex gap-1 overflow-x-auto rounded-(--radius-lg) border border-line bg-card p-1.5">
    <button
      v-for="tab in tabs.filter((t) => t.show !== false)"
      :key="tab.key"
      type="button"
      class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors"
      :class="
        modelValue === tab.key
          ? 'bg-calipso/16 text-calipso-deep'
          : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
      "
      @click="$emit('update:modelValue', tab.key)"
    >
      <AppIcon v-if="tab.icon" :name="tab.icon" :size="16" />
      {{ tab.label }}
      <span
        v-if="tab.count !== undefined"
        class="rounded-full px-1.5 py-px text-[11px] font-bold"
        :class="modelValue === tab.key ? 'bg-calipso/25 text-calipso-deep' : 'bg-paper-2 text-ink-soft'"
        >{{ tab.count }}</span
      >
    </button>
  </div>
</template>
