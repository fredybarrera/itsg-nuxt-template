<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    title?: string
    size?: Size
    /** En false oculta la X y desactiva cierre por backdrop/Escape (flujos obligatorios). */
    closable?: boolean
  }>(),
  {
    title: undefined,
    size: 'md',
    closable: true,
  }
)

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

const panel = ref<HTMLElement | null>(null)

function cerrar() {
  if (props.closable) open.value = false
}

useFocusTrap(panel, open, { onEscape: cerrar })
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(20,16,10,.45)] p-4 transition-opacity duration-[200ms]"
      :class="open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click.self="cerrar"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        class="cartela flex max-h-[88vh] w-full flex-col border border-line bg-card shadow-md transition-transform duration-[200ms]"
        :class="[sizeClasses[size], open ? 'scale-100' : 'scale-95']"
      >
        <div
          v-if="title || closable"
          class="flex shrink-0 items-center justify-between border-b border-line px-5 py-[18px]"
        >
          <h3 class="m-0 text-[15px] font-bold text-ink">{{ title }}</h3>
          <button
            v-if="closable"
            type="button"
            class="flex border-none bg-transparent p-1 text-ink-soft hover:text-ink"
            aria-label="Cerrar"
            @click="open = false"
          >
            <AppIcon name="close" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-5">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex shrink-0 justify-end gap-2.5 border-t border-line px-5 py-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
