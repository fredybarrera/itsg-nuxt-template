<script setup lang="ts">
import type { ToastType } from '#itsg/composables/useToast'
const { toasts, dismiss } = useToast()

function iconoPorTipo(tipo: ToastType) {
  const m: Record<ToastType, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
  return m[tipo]
}
function colorPorTipo(tipo: ToastType) {
  const m: Record<ToastType, string> = {
    success: 'bg-card border-l-4 border-l-calipso text-ink',
    error: 'bg-card border-l-4 border-l-rojo text-ink',
    warning: 'bg-card border-l-4 border-l-naranja text-ink',
    info: 'bg-card border-l-4 border-l-calipso/60 text-ink',
  }
  return m[tipo]
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[200] flex flex-col gap-2" role="status" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex w-80 items-start gap-3 rounded-(--radius-md) p-3.5 shadow-(--shadow-md)"
          :class="colorPorTipo(toast.type)"
        >
          <span class="mt-0.5 text-sm font-bold">{{ iconoPorTipo(toast.type) }}</span>
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button
            type="button"
            class="ml-1 text-ink-soft hover:text-ink"
            aria-label="Cerrar"
            @click="dismiss(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
