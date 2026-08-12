<script setup lang="ts">
import type { DataTableColumn } from '#itsg/types/table'

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows?: Record<string, unknown>[]
    pageSize?: number
    exportFilename?: string
    title?: string
    searchPlaceholder?: string
    searchKeys?: string[]
    chips?: { label: string; value: string }[]
    chipKey?: string
    /** Total antes de filtros externos (p. ej. FilteredTable) para el conteo "N de M". */
    totalRows?: number
    /**
     * Orden resuelto por el consumidor (server-side): la tabla no ordena sus filas, solo refleja
     * `sortKey`/`sortDir` y emite sus cambios. Úsalo con `v-model:sort-key` / `v-model:sort-dir`.
     */
    manualSort?: boolean
    /**
     * Paginación resuelta por el consumidor (server-side): la tabla no corta las filas; usa
     * `totalRows` + `pageSize` para el total de páginas y `v-model:page` para la página actual.
     */
    manualPagination?: boolean
  }>(),
  {
    rows: undefined,
    pageSize: 0,
    exportFilename: undefined,
    title: undefined,
    searchPlaceholder: undefined,
    searchKeys: undefined,
    chips: undefined,
    chipKey: undefined,
    totalRows: undefined,
    manualSort: false,
    manualPagination: false,
  }
)

// Modelos controlables: si el consumidor no los enlaza, funcionan como estado interno (modo cliente).
const pagina = defineModel<number>('page', { default: 1 })
const sortKey = defineModel<string | null>('sortKey', { default: null })
const sortDir = defineModel<1 | -1>('sortDir', { default: 1 })
const searchModel = defineModel<string>('search', { default: '' })
const chipModel = defineModel<string>('chip', { default: '' })

// En paginación server-side el consumidor controla la página (y la resetea al filtrar/ordenar),
// así que la tabla no debe reiniciarla al llegar filas nuevas de cada fetch.
watch(
  () => props.rows,
  () => {
    if (!props.manualPagination) pagina.value = 1
  }
)
watch([searchModel, chipModel], () => {
  if (!props.manualPagination) pagina.value = 1
})

// ── Sorting ───────────────────────────────────────────────────────────────────
function toggleSort(col: DataTableColumn) {
  if (col.sortable === false) return
  if (sortKey.value === col.key) {
    sortDir.value = sortDir.value === 1 ? -1 : 1
  } else {
    sortKey.value = col.key
    sortDir.value = 1
  }
  // En modo manual el consumidor resetea la página al observar el cambio de orden.
  if (!props.manualPagination) pagina.value = 1
}

// ── Filter pipeline (rows mode, cliente) ─────────────────────────────────────
const filteredRows = computed(() => {
  if (!props.rows) return []
  let result = props.rows

  if (searchModel.value && props.searchPlaceholder !== undefined) {
    const q = searchModel.value.toLowerCase()
    const keys = props.searchKeys ?? props.columns.map((c) => c.key)
    result = result.filter((r) =>
      keys.some((k) =>
        String(r[k] ?? '')
          .toLowerCase()
          .includes(q)
      )
    )
  }

  if (chipModel.value && props.chipKey) {
    result = result.filter((r) => String(r[props.chipKey!]) === chipModel.value)
  }

  return result
})

const sortedRows = computed(() => {
  const rows = filteredRows.value
  // En modo manual las filas ya vienen ordenadas por el servidor.
  if (props.manualSort || !sortKey.value) return rows
  const k = sortKey.value
  const dir = sortDir.value
  return [...rows].sort((a, b) => {
    const x = a[k]
    const y = b[k]
    if (x == null && y == null) return 0
    if (x == null) return 1
    if (y == null) return -1
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir
    return String(x).localeCompare(String(y), 'es', { numeric: true }) * dir
  })
})

const totalPaginas = computed(() => {
  if (!props.pageSize) return 1
  const base = props.manualPagination ? (props.totalRows ?? 0) : filteredRows.value.length
  return Math.max(1, Math.ceil(base / props.pageSize))
})

const filasPagina = computed(() => {
  // En modo manual el servidor ya entregó exactamente la página pedida.
  if (props.manualPagination) return sortedRows.value
  if (!props.pageSize) return sortedRows.value
  const i = (pagina.value - 1) * props.pageSize
  return sortedRows.value.slice(i, i + props.pageSize)
})

function exportarCSV() {
  if (!props.rows || !props.exportFilename) return
  const enc = props.columns.map((c) => `"${c.label}"`).join(',')
  const filas = sortedRows.value.map((r) =>
    props.columns.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  const csv = '﻿' + [enc, ...filas].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.exportFilename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="overflow-hidden rounded-(--radius-md) border border-line bg-card shadow-(--shadow-sm)">
    <!-- Card header -->
    <div
      v-if="title || $slots['title-end']"
      class="flex items-center gap-3 border-b border-line px-[18px] py-[15px]"
    >
      <span class="text-[15px] font-bold text-ink">{{ title }}</span>
      <slot name="title-end" />
    </div>

    <!-- Toolbar: search pill + chips + end slot -->
    <div
      v-if="searchPlaceholder || chips?.length || $slots['toolbar-end']"
      class="flex flex-wrap items-center gap-[10px] border-b border-line px-[18px] py-[14px]"
    >
      <div
        v-if="searchPlaceholder"
        class="flex min-w-60 items-center gap-2 rounded-full border border-line-strong bg-paper px-[14px] py-2"
      >
        <AppIcon name="search" :size="14" class="shrink-0 text-ink-soft" />
        <input
          v-model="searchModel"
          type="search"
          class="w-full border-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-soft"
          :placeholder="searchPlaceholder"
        />
      </div>
      <div v-if="chips?.length" class="flex flex-wrap gap-[6px]">
        <button
          v-for="c in chips"
          :key="c.value"
          type="button"
          class="rounded-full border px-[13px] py-[6px] text-[12.5px] font-semibold transition-colors"
          :class="
            chipModel === c.value
              ? 'border-calipso bg-calipso text-primary-ink'
              : 'border-line-strong bg-card text-ink-soft hover:bg-paper-2'
          "
          @click="chipModel = c.value"
        >
          {{ c.label }}
        </button>
      </div>
      <div class="flex-1" />
      <slot name="toolbar-end" />
    </div>

    <!-- Export CSV toolbar -->
    <div v-if="exportFilename" class="flex items-center justify-end border-b border-line px-[18px] py-2">
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-(--radius-sm) border border-line px-3 py-1.5 font-mono text-[12px] text-ink-soft hover:bg-paper-2"
        @click="exportarCSV"
      >
        <AppIcon name="download" :size="13" />
        Exportar CSV
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="border-b-[1.5px] border-line-strong bg-card px-[18px] py-[13px] text-left text-[12.5px] font-semibold text-ink-soft whitespace-nowrap"
              :class="col.sortable !== false ? 'cursor-pointer select-none hover:text-calipso-deep' : ''"
              :style="col.width ? { width: col.width } : undefined"
              @click="toggleSort(col)"
            >
              <span class="inline-flex items-center gap-1">
                {{ col.label }}
                <template v-if="col.sortable !== false">
                  <AppIcon
                    v-if="sortKey === col.key"
                    name="chevdown"
                    :size="13"
                    class="text-calipso-deep transition-transform"
                    :style="sortDir === 1 ? 'transform:rotate(180deg)' : undefined"
                  />
                  <AppIcon v-else name="sort" :size="13" class="opacity-30" />
                </template>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rows !== undefined">
            <tr v-if="filasPagina.length === 0">
              <td :colspan="columns.length" class="px-[18px] py-8 text-center text-sm text-ink-soft">
                Sin resultados
              </td>
            </tr>
            <tr v-for="(row, i) in filasPagina" v-else :key="i" class="border-b border-line last:border-b-0">
              <td v-for="col in columns" :key="col.key" class="px-[18px] py-3 text-[13.5px]">
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                  {{ row[col.key] ?? '—' }}
                </slot>
              </td>
            </tr>
          </template>
          <slot v-else />
        </tbody>
      </table>
    </div>

    <!-- Footer: count + custom slot + pagination -->
    <div
      v-if="rows !== undefined || $slots.footer"
      class="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-card px-[18px] py-[14px]"
    >
      <span v-if="rows !== undefined" class="font-mono text-[12.5px] text-ink-soft">
        <template v-if="manualPagination">
          {{ filasPagina.length }} de {{ totalRows ?? 0 }} registro{{ (totalRows ?? 0) !== 1 ? 's' : '' }}
        </template>
        <template v-else>
          {{ filteredRows.length }} registro{{ filteredRows.length !== 1 ? 's' : '' }}
          <template v-if="filteredRows.length < (totalRows ?? rows?.length ?? 0)">
            de {{ totalRows ?? rows?.length }}</template
          >
        </template>
        <template v-if="pageSize && totalPaginas > 1"> · pág. {{ pagina }}/{{ totalPaginas }}</template>
      </span>
      <slot name="footer" />

      <AppPagination v-if="pageSize && totalPaginas > 1" v-model="pagina" :total-pages="totalPaginas" />
    </div>
  </div>
</template>

<style scoped>
:deep(tbody tr:hover) {
  background: var(--color-paper-2);
}
</style>
