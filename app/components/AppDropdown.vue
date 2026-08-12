<script setup lang="ts">
withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'left' })

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

// Listeners globales solo mientras el menú está abierto
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

defineExpose({ close: () => (open.value = false) })
</script>

<template>
  <div ref="root" class="relative inline-block">
    <div aria-haspopup="true" :aria-expanded="open" @click="open = !open">
      <slot name="trigger" :open="open" />
    </div>
    <div
      v-show="open"
      :class="[
        'absolute top-[calc(100%+6px)] min-w-[190px] bg-card border border-line rounded-md shadow-md p-1.5 z-30',
        align === 'right' ? 'right-0' : 'left-0',
      ]"
    >
      <slot name="menu" :close="() => (open = false)" />
    </div>
  </div>
</template>
