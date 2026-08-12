<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  /** Sin `to`, el item se muestra como texto (típico para el último). */
  to?: string
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>

<template>
  <nav aria-label="Ruta de navegación">
    <ol class="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[13px]">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-1.5">
        <AppIcon v-if="i > 0" name="chevright" :size="12" class="text-ink-soft opacity-60" />
        <NuxtLink
          v-if="item.to && i < items.length - 1"
          :to="item.to"
          class="text-ink-soft no-underline hover:text-calipso-deep hover:underline"
          >{{ item.label }}</NuxtLink
        >
        <span
          v-else
          class="font-semibold text-ink"
          :aria-current="i === items.length - 1 ? 'page' : undefined"
          >{{ item.label }}</span
        >
      </li>
    </ol>
  </nav>
</template>
