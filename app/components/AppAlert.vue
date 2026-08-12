<script setup lang="ts">
type Tone = 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(defineProps<{ tone?: Tone; title?: string; dismissible?: boolean }>(), {
  tone: 'info',
  title: undefined,
  dismissible: false,
})

const emit = defineEmits<{ dismiss: [] }>()

const toneIcon: Record<Tone, string> = {
  success: 'check',
  warning: 'alert',
  danger: 'alert',
  info: 'info',
}

const toneClasses: Record<Tone, string> = {
  success: 'bg-verde/9 border-verde/35 text-success-ink',
  warning: 'bg-amarillo/12 border-amarillo/45 text-warning-ink',
  danger: 'bg-rojo/9 border-rojo/35 text-rojo-deep',
  info: 'bg-calipso/9 border-calipso/35 text-primary-ink',
}

const classes = computed(() => ['flex gap-3 items-start p-4 rounded-md border', toneClasses[props.tone]])
</script>

<template>
  <div :class="classes">
    <AppIcon :name="toneIcon[tone]" class="mt-px" />
    <div class="flex-1">
      <div v-if="title" class="font-bold text-[13.5px] mb-0.5">{{ title }}</div>
      <div class="text-[13px] text-ink-soft"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      class="ml-auto cursor-pointer opacity-60 hover:opacity-100 bg-transparent border-none text-inherit"
      aria-label="Cerrar"
      @click="emit('dismiss')"
    >
      <AppIcon name="close" :size="14" />
    </button>
  </div>
</template>
