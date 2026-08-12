<script setup lang="ts">
const { state, responder } = useConfirm()

const panel = ref<HTMLElement | null>(null)
const confirmBtn = ref<{ $el?: HTMLElement } | null>(null)
const isOpen = computed(() => state.value.open)

// Foco inicial en "Confirmar": Enter confirma de forma nativa, sin listener global.
useFocusTrap(panel, isOpen, {
  onEscape: () => responder(false),
  initialFocus: () => confirmBtn.value?.$el ?? null,
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(20,16,10,.45)] p-4 transition-opacity duration-[200ms]"
      :class="state.open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      @click.self="responder(false)"
    >
      <div
        ref="panel"
        class="w-full max-w-sm rounded-(--radius-lg) border border-line bg-card p-6 shadow-md transition-transform duration-[200ms]"
        :class="state.open ? 'scale-100' : 'scale-95'"
        role="alertdialog"
        aria-modal="true"
      >
        <h3 v-if="state.title" class="font-display text-lg font-bold text-ink">{{ state.title }}</h3>
        <p class="mt-1.5 text-sm text-ink-soft">{{ state.message }}</p>

        <div class="mt-6 flex justify-end gap-2.5">
          <AppButton variant="outline" size="sm" @click="responder(false)">
            {{ state.cancelLabel ?? 'Cancelar' }}
          </AppButton>
          <AppButton
            ref="confirmBtn"
            :variant="state.tone === 'danger' ? 'danger' : 'primary'"
            size="sm"
            @click="responder(true)"
          >
            {{ state.confirmLabel ?? 'Confirmar' }}
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
