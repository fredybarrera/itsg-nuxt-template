<script setup lang="ts">
import type { DataTableColumn, FilterDef } from '#itsg/types/table'

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows: Record<string, unknown>[]
    filters?: FilterDef[]
    searchKeys: string[]
    searchPlaceholder?: string
    filename?: string
  }>(),
  // Los dropdowns de filtro son opcionales (muchas tablas solo buscan por texto). Sin este
  // default, omitir la prop dejaba `props.filters` en undefined y el computed `activeFilterList`
  // hacía `.filter` sobre undefined, reventando el componente al montar.
  { filters: () => [] }
)

const search = ref('')
const activeFilters = reactive<Record<string, string>>({})

const filteredRows = computed(() => {
  return props.rows.filter((row) => {
    if (search.value) {
      const q = search.value.toLowerCase()
      const matches = props.searchKeys.some((k) =>
        String(row[k] ?? '')
          .toLowerCase()
          .includes(q)
      )
      if (!matches) return false
    }
    for (const f of props.filters) {
      const val = activeFilters[f.key]
      if (val && String(row[f.key]) !== val) return false
    }
    return true
  })
})

const activeFilterList = computed(() => props.filters.filter((f) => activeFilters[f.key]))
const hasActiveFilters = computed(() => Boolean(search.value) || activeFilterList.value.length > 0)

function optionLabel(filter: FilterDef) {
  return filter.options.find((o) => o.value === activeFilters[filter.key])?.label
}

function removeFilter(key: string) {
  activeFilters[key] = ''
}

function clearFilters() {
  search.value = ''
  for (const f of props.filters) activeFilters[f.key] = ''
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 flex-wrap mb-4">
      <div class="relative flex-1 min-w-[180px] max-w-xs">
        <AppIcon name="search" :size="16" class="absolute left-3 top-[11px] text-ink-soft" />
        <input v-model="search" class="input pl-9" :placeholder="searchPlaceholder || 'Buscar…'" />
      </div>

      <select
        v-for="f in filters"
        :key="f.key"
        v-model="activeFilters[f.key]"
        class="input w-auto min-w-[140px] flex-none"
      >
        <option value="">{{ f.placeholder }}</option>
        <option v-for="opt in f.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <span v-if="hasActiveFilters" class="w-px h-6 bg-line-strong" />

      <div v-if="activeFilterList.length" class="flex gap-2 flex-wrap">
        <span
          v-for="f in activeFilterList"
          :key="f.key"
          class="inline-flex items-center gap-1.5 bg-paper-2 rounded-full py-1 px-3 text-xs text-ink"
        >
          {{ f.label }}: {{ optionLabel(f) }}
          <button
            class="bg-transparent border-none text-ink-soft cursor-pointer hover:text-rojo-deep leading-none"
            aria-label="Quitar"
            @click="removeFilter(f.key)"
          >
            ×
          </button>
        </span>
      </div>

      <AppButton v-if="hasActiveFilters" variant="ghost" size="sm" class="ml-auto" @click="clearFilters">
        Limpiar filtros
      </AppButton>
    </div>

    <DataTable :columns="columns" :rows="filteredRows" :export-filename="filename" :total-rows="rows.length">
      <template v-for="col in columns" :key="col.key" #[`cell-${col.key}`]="slotProps">
        <slot :name="`cell-${col.key}`" v-bind="slotProps" />
      </template>
    </DataTable>
  </div>
</template>
