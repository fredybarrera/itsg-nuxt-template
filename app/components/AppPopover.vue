<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 'auto' elige el lado según el espacio disponible en el viewport. */
    align?: 'left' | 'right' | 'auto'
    /** Clases extra del panel (ancho, padding), p. ej. "w-72 p-4". */
    panelClass?: string
  }>(),
  { align: 'auto', panelClass: '' }
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

// Posición resuelta al abrir: flip vertical y alineación según bordes del viewport
const pos = ref<{ side: 'bottom' | 'top'; align: 'left' | 'right' }>({
  side: 'bottom',
  align: 'left',
})

function reposicionar() {
  if (!root.value || !panel.value) return
  const r = root.value.getBoundingClientRect()
  const p = panel.value.getBoundingClientRect()
  const margen = 8
  const cabeAbajo = r.bottom + p.height + margen <= window.innerHeight
  const cabeArriba = r.top - p.height - margen >= 0
  const side = !cabeAbajo && cabeArriba ? 'top' : 'bottom'
  let align: 'left' | 'right'
  if (props.align === 'auto') {
    align = r.left + p.width + margen > window.innerWidth ? 'right' : 'left'
  } else {
    align = props.align
  }
  pos.value = { side, align }
}

async function abrir() {
  open.value = true
  await nextTick()
  reposicionar()
}
function cerrar() {
  open.value = false
}
function toggle() {
  if (open.value) cerrar()
  else abrir()
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) cerrar()
}
function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') cerrar()
}

// Listeners globales solo mientras está abierto
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onEscape)
    window.addEventListener('resize', reposicionar)
    window.addEventListener('scroll', reposicionar, true)
  } else {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onEscape)
    window.removeEventListener('resize', reposicionar)
    window.removeEventListener('scroll', reposicionar, true)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
  window.removeEventListener('resize', reposicionar)
  window.removeEventListener('scroll', reposicionar, true)
})

defineExpose({ open: abrir, close: cerrar, toggle })
</script>

<template>
  <div ref="root" class="relative inline-block">
    <div aria-haspopup="true" :aria-expanded="open" @click="toggle">
      <slot name="trigger" :open="open" />
    </div>
    <div
      v-if="open"
      ref="panel"
      :class="[
        'absolute z-40 min-w-[190px] rounded-(--radius-md) border border-line bg-card p-3 shadow-md',
        pos.side === 'bottom' ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]',
        pos.align === 'right' ? 'right-0' : 'left-0',
        panelClass,
      ]"
    >
      <slot :close="cerrar" />
    </div>
  </div>
</template>
