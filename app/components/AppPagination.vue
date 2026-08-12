<script setup lang="ts">
const page = defineModel<number>({ default: 1 })

const props = defineProps<{ totalPages: number }>()

const paginas = computed<(number | '…')[]>(() => {
  const t = props.totalPages
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const p = page.value
  if (p <= 4) return [1, 2, 3, 4, 5, '…', t]
  if (p >= t - 3) return [1, '…', t - 4, t - 3, t - 2, t - 1, t]
  return [1, '…', p - 1, p, p + 1, '…', t]
})
</script>

<template>
  <nav class="flex items-center gap-1" aria-label="Paginación">
    <button
      type="button"
      class="page-btn"
      :disabled="page === 1"
      aria-label="Página anterior"
      @click="page--"
    >
      <AppIcon name="chevright" :size="12" style="transform: rotate(180deg)" />
    </button>
    <template v-for="p in paginas" :key="String(p)">
      <button
        v-if="p !== '…'"
        type="button"
        class="page-btn"
        :class="{ 'is-active': p === page }"
        :aria-current="p === page ? 'page' : undefined"
        @click="page = p as number"
      >
        {{ p }}
      </button>
      <span v-else class="px-1 font-mono text-[12.5px] text-ink-soft">…</span>
    </template>
    <button
      type="button"
      class="page-btn"
      :disabled="page === totalPages"
      aria-label="Página siguiente"
      @click="page++"
    >
      <AppIcon name="chevright" :size="12" />
    </button>
  </nav>
</template>

<style scoped>
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm);
  color: var(--color-ink-soft);
  cursor: pointer;
  background: var(--color-card);
}
.page-btn:hover:not(:disabled) {
  background: var(--color-paper-2);
  color: var(--color-ink);
}
.page-btn.is-active {
  background: var(--color-calipso);
  color: var(--color-primary-ink);
  border-color: var(--color-calipso);
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
