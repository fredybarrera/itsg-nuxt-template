<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
defineProps<{ title?: string }>()

const panel = ref<HTMLElement | null>(null)
useFocusTrap(panel, open, { onEscape: () => (open.value = false) })
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[150] flex justify-end bg-[rgba(20,16,10,.45)] transition-opacity duration-[250ms]"
      :class="open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click.self="open = false"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        class="cartela-left w-[400px] max-w-[88vw] h-full bg-card border-l border-line shadow-md flex flex-col transition-transform duration-[280ms]"
        :class="open ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between py-[18px] px-5 border-b border-line shrink-0">
          <h3 class="text-[15px] font-bold m-0">{{ title }}</h3>
          <button
            class="bg-transparent border-none text-ink-soft cursor-pointer flex p-1 hover:text-ink"
            aria-label="Cerrar"
            @click="open = false"
          >
            <AppIcon name="close" />
          </button>
        </div>
        <div class="p-5 overflow-y-auto flex-1">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex justify-end gap-2.5 py-4 px-5 border-t border-line shrink-0">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
