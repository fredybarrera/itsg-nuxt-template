<script setup lang="ts">
import type { ComboboxValue, SelectOption } from '#itsg/types/form'

/** v-model: valores asignados (columna derecha), en el orden de `options`. */
const model = defineModel<ComboboxValue[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    titleAvailable?: string
    titleAssigned?: string
    searchable?: boolean
    disabled?: boolean
  }>(),
  {
    titleAvailable: 'Disponibles',
    titleAssigned: 'Asignados',
    searchable: false,
    disabled: false,
  }
)

const searchLeft = ref('')
const searchRight = ref('')
const checkedLeft = ref<ComboboxValue[]>([])
const checkedRight = ref<ComboboxValue[]>([])

const assignedSet = computed(() => new Set(model.value))
const available = computed(() => props.options.filter((o) => !assignedSet.value.has(o.value)))
const assigned = computed(() => props.options.filter((o) => assignedSet.value.has(o.value)))

function filtrar(list: SelectOption[], q: string) {
  const s = q.trim().toLowerCase()
  return s ? list.filter((o) => o.label.toLowerCase().includes(s)) : list
}
const availableFiltered = computed(() => filtrar(available.value, searchLeft.value))
const assignedFiltered = computed(() => filtrar(assigned.value, searchRight.value))

// Solo lo visible (bajo filtro) y habilitado participa en "mover todos"
const movablesLeft = computed(() => availableFiltered.value.filter((o) => !o.disabled).map((o) => o.value))
const movablesRight = computed(() => assignedFiltered.value.filter((o) => !o.disabled).map((o) => o.value))

function toggleLeft(v: ComboboxValue) {
  checkedLeft.value = checkedLeft.value.includes(v)
    ? checkedLeft.value.filter((x) => x !== v)
    : [...checkedLeft.value, v]
}
function toggleRight(v: ComboboxValue) {
  checkedRight.value = checkedRight.value.includes(v)
    ? checkedRight.value.filter((x) => x !== v)
    : [...checkedRight.value, v]
}

function asignar(values: ComboboxValue[]) {
  if (props.disabled || values.length === 0) return
  model.value = [...model.value, ...values.filter((v) => !assignedSet.value.has(v))]
  checkedLeft.value = []
}

function quitar(values: ComboboxValue[]) {
  if (props.disabled || values.length === 0) return
  const set = new Set(values)
  model.value = model.value.filter((v) => !set.has(v))
  checkedRight.value = []
}
</script>

<template>
  <div class="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
    <!-- Disponibles -->
    <div class="overflow-hidden rounded-(--radius-md) border border-line bg-card">
      <div class="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <span class="text-[13px] font-semibold text-ink">{{ titleAvailable }}</span>
        <span class="font-mono text-[12px] text-ink-soft">{{ available.length }}</span>
      </div>
      <div v-if="searchable" class="flex items-center gap-2 border-b border-line px-3.5 py-2">
        <AppIcon name="search" :size="13" class="shrink-0 text-ink-soft" />
        <input
          v-model="searchLeft"
          type="search"
          class="w-full border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-soft"
          placeholder="Buscar…"
        />
      </div>
      <ul role="listbox" aria-multiselectable="true" class="m-0 max-h-56 list-none overflow-y-auto p-1.5">
        <li v-if="availableFiltered.length === 0" class="px-2.5 py-2 text-[13px] text-ink-soft">
          Sin elementos
        </li>
        <li
          v-for="opt in availableFiltered"
          :key="String(opt.value)"
          role="option"
          :aria-selected="checkedLeft.includes(opt.value)"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-(--radius-sm) border-none bg-transparent px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-paper-2"
            :class="opt.disabled || disabled ? 'cursor-not-allowed opacity-45 hover:bg-transparent' : ''"
            :disabled="opt.disabled || disabled"
            @click="toggleLeft(opt.value)"
            @dblclick="!opt.disabled && asignar([opt.value])"
          >
            <span
              class="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] border-[1.6px]"
              :class="
                checkedLeft.includes(opt.value)
                  ? 'border-calipso bg-calipso text-primary-ink'
                  : 'border-line-strong bg-paper'
              "
            >
              <AppIcon v-if="checkedLeft.includes(opt.value)" name="check" :size="10" />
            </span>
            <span class="truncate">{{ opt.label }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Controles -->
    <div class="flex items-center justify-center gap-2 md:flex-col">
      <AppButton
        variant="outline"
        size="sm"
        :disabled="disabled || checkedLeft.length === 0"
        aria-label="Asignar seleccionados"
        @click="asignar(checkedLeft)"
      >
        <AppIcon name="chevright" :size="14" class="rotate-90 md:rotate-0" />
      </AppButton>
      <AppButton
        variant="ghost"
        size="sm"
        :disabled="disabled || movablesLeft.length === 0"
        aria-label="Asignar todos los visibles"
        @click="asignar(movablesLeft)"
      >
        <span class="flex rotate-90 md:rotate-0">
          <AppIcon name="chevright" :size="14" />
          <AppIcon name="chevright" :size="14" class="-ml-2" />
        </span>
      </AppButton>
      <AppButton
        variant="ghost"
        size="sm"
        :disabled="disabled || movablesRight.length === 0"
        aria-label="Quitar todos los visibles"
        @click="quitar(movablesRight)"
      >
        <span class="flex -rotate-90 md:rotate-180">
          <AppIcon name="chevright" :size="14" />
          <AppIcon name="chevright" :size="14" class="-ml-2" />
        </span>
      </AppButton>
      <AppButton
        variant="outline"
        size="sm"
        :disabled="disabled || checkedRight.length === 0"
        aria-label="Quitar seleccionados"
        @click="quitar(checkedRight)"
      >
        <AppIcon name="chevright" :size="14" class="-rotate-90 md:rotate-180" />
      </AppButton>
    </div>

    <!-- Asignados -->
    <div class="overflow-hidden rounded-(--radius-md) border border-line bg-card">
      <div class="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <span class="text-[13px] font-semibold text-ink">{{ titleAssigned }}</span>
        <span class="font-mono text-[12px] text-ink-soft">{{ assigned.length }}</span>
      </div>
      <div v-if="searchable" class="flex items-center gap-2 border-b border-line px-3.5 py-2">
        <AppIcon name="search" :size="13" class="shrink-0 text-ink-soft" />
        <input
          v-model="searchRight"
          type="search"
          class="w-full border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-soft"
          placeholder="Buscar…"
        />
      </div>
      <ul role="listbox" aria-multiselectable="true" class="m-0 max-h-56 list-none overflow-y-auto p-1.5">
        <li v-if="assignedFiltered.length === 0" class="px-2.5 py-2 text-[13px] text-ink-soft">
          Sin elementos
        </li>
        <li
          v-for="opt in assignedFiltered"
          :key="String(opt.value)"
          role="option"
          :aria-selected="checkedRight.includes(opt.value)"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-(--radius-sm) border-none bg-transparent px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-paper-2"
            :class="opt.disabled || disabled ? 'cursor-not-allowed opacity-45 hover:bg-transparent' : ''"
            :disabled="opt.disabled || disabled"
            @click="toggleRight(opt.value)"
            @dblclick="!opt.disabled && quitar([opt.value])"
          >
            <span
              class="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] border-[1.6px]"
              :class="
                checkedRight.includes(opt.value)
                  ? 'border-calipso bg-calipso text-primary-ink'
                  : 'border-line-strong bg-paper'
              "
            >
              <AppIcon v-if="checkedRight.includes(opt.value)" name="check" :size="10" />
            </span>
            <span class="truncate">{{ opt.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
