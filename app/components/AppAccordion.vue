<script setup lang="ts">
export interface AccordionItem {
  question: string
  answer: string
}

const props = defineProps<{ items: AccordionItem[]; defaultOpen?: number[] }>()
const openSet = reactive(new Set(props.defaultOpen ?? []))

function toggle(i: number) {
  if (openSet.has(i)) openSet.delete(i)
  else openSet.add(i)
}
</script>

<template>
  <div>
    <div v-for="(item, i) in items" :key="i" class="border-b border-line first:border-t">
      <button
        class="flex items-center justify-between gap-3 w-full py-4 px-1 bg-transparent border-none font-body text-sm font-semibold text-ink text-left cursor-pointer"
        :aria-expanded="openSet.has(i)"
        @click="toggle(i)"
      >
        {{ item.question }}
        <AppIcon
          name="chevdown"
          :size="14"
          :class="[
            'text-ink-soft transition-transform duration-[180ms] shrink-0',
            openSet.has(i) ? 'rotate-180' : '',
          ]"
        />
      </button>
      <div
        class="overflow-hidden transition-[max-height] duration-200"
        :style="{ maxHeight: openSet.has(i) ? '220px' : '0' }"
      >
        <p class="px-1 pb-4 text-[13.5px] text-ink-soft">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>
