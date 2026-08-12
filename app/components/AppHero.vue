<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** Overline pequeña sobre el título, p. ej. "ITSG · Reportes". */
    eyebrow?: string
    size?: Size
    /** Etiqueta del título; usa 'h2'/'h3' cuando el hero no encabeza la página. */
    as?: string
  }>(),
  {
    subtitle: undefined,
    eyebrow: undefined,
    size: 'md',
    as: 'h1',
  }
)

const sizeClasses: Record<Size, { root: string; title: string; subtitle: string }> = {
  sm: { root: 'p-5', title: 'text-lg', subtitle: 'text-[13px] mt-1' },
  md: { root: 'p-8', title: 'text-2xl', subtitle: 'text-sm mt-2' },
  lg: { root: 'p-10 md:p-14', title: 'text-3xl md:text-4xl', subtitle: 'text-[15px] mt-3' },
}

const s = computed(() => sizeClasses[props.size])
</script>

<template>
  <section class="cartela border border-line bg-card shadow-(--shadow-sm)" :class="s.root">
    <!-- Brillo de marca; usa tokens, funciona igual en modo oscuro. Hereda la esquina
         cortada de la cartela para no sobresalir (el root ya no recorta con overflow). -->
    <div
      class="pointer-events-none absolute inset-0 rounded-[0_var(--radius-lg)_0_var(--radius-lg)] bg-gradient-to-br from-calipso/10 via-transparent to-transparent"
    />
    <div class="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
      <div class="min-w-0 flex-1">
        <p
          v-if="eyebrow"
          class="m-0 mb-2 font-mono text-[11px] font-semibold tracking-[.14em] text-calipso-deep uppercase"
        >
          {{ eyebrow }}
        </p>
        <component
          :is="as"
          class="m-0 font-display font-bold tracking-wide text-ink uppercase"
          :class="s.title"
        >
          {{ title }}
        </component>
        <p v-if="subtitle" class="m-0 max-w-2xl text-ink-soft" :class="s.subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.default" class="relative mt-5">
      <slot />
    </div>
  </section>
</template>
