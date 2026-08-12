<script setup lang="ts">
import type { ComboboxModel, ComboboxValue, SelectOption } from '#itsg/types/form'

const model = defineModel<ComboboxModel>({ default: null })

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    /** En true el modelo es un arreglo y las opciones se acumulan como chips. */
    multiple?: boolean
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    clearable?: boolean
    invalid?: boolean
  }>(),
  {
    multiple: false,
    placeholder: 'Selecciona…',
    searchPlaceholder: 'Buscar…',
    disabled: false,
    clearable: false,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))
const listId = useId()

const open = ref(false)
const search = ref('')
const highlighted = ref(0)
const root = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const selectedValues = computed<ComboboxValue[]>(() => {
  if (model.value == null || model.value === '') return []
  return Array.isArray(model.value) ? model.value : [model.value]
})

const selectedOptions = computed(() =>
  selectedValues.value.map((v) => props.options.find((o) => o.value === v) ?? { label: String(v), value: v })
)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

watch(filtered, () => {
  highlighted.value = 0
})

function isSelected(v: ComboboxValue) {
  return selectedValues.value.includes(v)
}

function pick(opt: SelectOption) {
  if (opt.disabled) return
  if (props.multiple) {
    model.value = isSelected(opt.value)
      ? selectedValues.value.filter((v) => v !== opt.value)
      : [...selectedValues.value, opt.value]
    searchInput.value?.focus()
  } else {
    model.value = opt.value
    cerrar()
  }
}

function quitar(v: ComboboxValue) {
  if (props.disabled) return
  model.value = props.multiple ? selectedValues.value.filter((x) => x !== v) : null
}

function limpiar() {
  model.value = props.multiple ? [] : null
}

function abrir() {
  if (props.disabled) return
  open.value = true
  search.value = ''
  highlighted.value = 0
  nextTick(() => searchInput.value?.focus())
}

function cerrar() {
  open.value = false
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
    e.preventDefault()
    if (!open.value) abrir()
  }
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlighted.value = Math.min(highlighted.value + 1, filtered.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlighted.value = Math.max(highlighted.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const opt = filtered.value[highlighted.value]
    if (opt) pick(opt)
  }
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) cerrar()
}
function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') cerrar()
}

// Listeners globales solo mientras el popover está abierto
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onEscape)
  } else {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onEscape)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div ref="root" class="relative">
    <!-- Trigger: div (no button) porque los chips llevan su propio botón de quitar -->
    <div
      :id="field?.id"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="listId"
      aria-haspopup="listbox"
      :aria-invalid="isInvalid || undefined"
      :tabindex="disabled ? -1 : 0"
      class="input flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1.5 pr-9"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
      @click="open ? cerrar() : abrir()"
      @keydown="onTriggerKeydown"
    >
      <template v-if="multiple && selectedOptions.length">
        <span
          v-for="opt in selectedOptions"
          :key="String(opt.value)"
          class="inline-flex items-center gap-1 rounded-full bg-paper-2 py-0.5 pl-2.5 pr-1 text-[12.5px] text-ink"
        >
          {{ opt.label }}
          <button
            type="button"
            class="flex rounded-full border-none bg-transparent p-0.5 text-ink-soft hover:text-danger"
            :aria-label="`Quitar ${opt.label}`"
            @click.stop="quitar(opt.value)"
          >
            <AppIcon name="close" :size="11" />
          </button>
        </span>
      </template>
      <span v-else-if="selectedOptions.length" class="truncate">{{ selectedOptions[0]!.label }}</span>
      <span v-else class="text-ink-soft">{{ placeholder }}</span>

      <span class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <button
          v-if="clearable && selectedOptions.length && !disabled"
          type="button"
          class="flex border-none bg-transparent p-0.5 text-ink-soft hover:text-ink"
          aria-label="Limpiar selección"
          @click.stop="limpiar"
        >
          <AppIcon name="close" :size="13" />
        </button>
        <AppIcon
          name="chevdown"
          :size="14"
          class="pointer-events-none text-ink-soft transition-transform duration-150"
          :class="open ? 'rotate-180' : ''"
        />
      </span>
    </div>

    <!-- Popover -->
    <div
      v-if="open"
      class="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-(--radius-md) border border-line bg-card shadow-md"
    >
      <div class="flex items-center gap-2 border-b border-line px-3 py-2">
        <AppIcon name="search" :size="14" class="shrink-0 text-ink-soft" />
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          class="w-full border-0 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-soft"
          :placeholder="searchPlaceholder"
          role="searchbox"
          :aria-activedescendant="filtered.length ? `${listId}-opt-${highlighted}` : undefined"
          @keydown="onSearchKeydown"
        />
      </div>
      <ul
        :id="listId"
        role="listbox"
        :aria-multiselectable="multiple"
        class="m-0 max-h-56 list-none overflow-y-auto p-1.5"
      >
        <li v-if="filtered.length === 0" class="px-2.5 py-2 text-[13px] text-ink-soft">Sin resultados</li>
        <li
          v-for="(opt, i) in filtered"
          :id="`${listId}-opt-${i}`"
          :key="String(opt.value)"
          role="option"
          :aria-selected="isSelected(opt.value)"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-(--radius-sm) border-none bg-transparent px-2.5 py-2 text-left text-[13.5px]"
            :class="[
              isSelected(opt.value) ? 'font-semibold text-calipso-deep' : 'text-ink',
              i === highlighted ? 'bg-paper-2' : '',
              opt.disabled ? 'cursor-not-allowed opacity-45' : '',
            ]"
            :disabled="opt.disabled"
            @click="pick(opt)"
            @mouseenter="highlighted = i"
          >
            <span class="flex w-4 shrink-0 justify-center">
              <AppIcon v-if="isSelected(opt.value)" name="check" :size="13" />
            </span>
            <span class="truncate">{{ opt.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
