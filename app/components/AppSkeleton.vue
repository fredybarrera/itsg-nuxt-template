<script setup lang="ts">
/**
 * Placeholder de carga (skeleton) con animación de shimmer (clase `.skeleton`,
 * respeta `prefers-reduced-motion`).
 *
 * - `line` / `avatar` → bones simples (compat v1.0.4; `width` solo aplica a `line`).
 * - `text` / `card` / `table` / `tree` → variantes compuestas con forma de contenido,
 *   pensadas para mostrar mientras `pending` de un `useFetch`/`useAsyncData`.
 *
 * Las compuestas se anuncian con `role="status"` + `aria-label`; los bones internos
 * son `aria-hidden` (decorativos).
 */
withDefaults(
  defineProps<{
    variant?: 'line' | 'avatar' | 'text' | 'card' | 'table' | 'tree'
    /** Ancho del bone. Solo `line` (ej. '55%', '8rem'). */
    width?: string
    /** Nº de filas/líneas en `text`, `table` y `tree`. */
    rows?: number
    /** Nº de columnas en `table`. */
    columns?: number
    /** Etiqueta accesible anunciada mientras carga (variantes compuestas). */
    label?: string
  }>(),
  {
    variant: 'line',
    width: undefined,
    rows: 5,
    columns: 4,
    label: 'Cargando…',
  }
)
</script>

<template>
  <!-- Bones simples: idénticos a v1.0.4 (line / avatar) -->
  <div
    v-if="variant === 'line' || variant === 'avatar'"
    class="skeleton rounded-sm"
    :class="variant === 'avatar' ? 'w-12 h-12 rounded-full shrink-0' : 'h-3 mb-2.5 last:mb-0'"
    :style="width ? { width } : undefined"
  />

  <!-- Variantes compuestas -->
  <div v-else role="status" :aria-label="label" class="w-full">
    <!-- text: n líneas; la última más corta -->
    <template v-if="variant === 'text'">
      <div
        v-for="i in rows"
        :key="i"
        aria-hidden="true"
        class="skeleton rounded-sm h-3 mb-2.5 last:mb-0"
        :style="{ width: i === rows ? '60%' : '100%' }"
      />
    </template>

    <!-- card: media + título + líneas -->
    <div v-else-if="variant === 'card'" aria-hidden="true" class="rounded-lg border border-line bg-card p-4">
      <div class="skeleton rounded-md h-32 mb-4" />
      <div class="skeleton rounded-sm h-4 mb-2.5" style="width: 70%" />
      <div class="skeleton rounded-sm h-3 mb-2" />
      <div class="skeleton rounded-sm h-3" style="width: 45%" />
    </div>

    <!-- table: cabecera + filas × columnas -->
    <div
      v-else-if="variant === 'table'"
      aria-hidden="true"
      class="w-full overflow-hidden rounded-lg border border-line"
    >
      <div class="flex gap-4 border-b border-line bg-paper-2 px-4 py-3">
        <div v-for="c in columns" :key="`h-${c}`" class="skeleton rounded-sm h-3 flex-1" />
      </div>
      <div
        v-for="r in rows"
        :key="`r-${r}`"
        class="flex gap-4 border-b border-line px-4 py-3.5 last:border-b-0"
      >
        <div v-for="c in columns" :key="`c-${r}-${c}`" class="skeleton rounded-sm h-3 flex-1" />
      </div>
    </div>

    <!-- tree: filas con indentación escalonada -->
    <div v-else-if="variant === 'tree'" aria-hidden="true" class="w-full">
      <div
        v-for="i in rows"
        :key="i"
        class="flex items-center gap-2.5 py-2"
        :style="{ paddingLeft: `${(i % 3) * 1.25}rem` }"
      >
        <div class="skeleton rounded-sm h-3.5 w-3.5 shrink-0" />
        <div class="skeleton rounded-sm h-3" :style="{ width: `${45 + ((i * 13) % 40)}%` }" />
      </div>
    </div>

    <span class="sr-only">{{ label }}</span>
  </div>
</template>
