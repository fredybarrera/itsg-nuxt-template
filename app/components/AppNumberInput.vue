<script setup lang="ts">
const model = defineModel<number | null>({ default: null })

const props = withDefaults(
  defineProps<{
    decimals?: number
    min?: number
    max?: number
    placeholder?: string
    /** Unidad mostrada dentro del campo, p. ej. "m³", "%", "UF". */
    suffix?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
  }>(),
  {
    decimals: 0,
    min: undefined,
    max: undefined,
    placeholder: undefined,
    suffix: undefined,
    disabled: false,
    readonly: false,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))

const texto = ref('')
const enfocado = ref(false)

/** Acepta formato es-CL ("1.234,5") y también punto decimal ("1234.5"). */
function parsear(s: string): number | null {
  let limpio = s.trim().replace(/\s/g, '')
  if (limpio === '' || limpio === '-') return null
  if (limpio.includes(',')) {
    // Coma decimal: los puntos son separadores de miles
    limpio = limpio.replace(/\./g, '').replace(',', '.')
  } else if ((limpio.match(/\./g)?.length ?? 0) > 1) {
    // Varios puntos sin coma: todos son de miles ("1.234.567")
    limpio = limpio.replace(/\./g, '')
  }
  const n = Number(limpio)
  return Number.isNaN(n) ? null : n
}

function onInput() {
  // Modelo en vivo, sin clamping ni formato (eso ocurre al salir del campo)
  model.value = parsear(texto.value)
}

function onFocus() {
  enfocado.value = true
  // Versión editable: sin miles, coma decimal
  texto.value = model.value == null ? '' : String(model.value).replace('.', ',')
}

function onBlur() {
  enfocado.value = false
  let n = parsear(texto.value)
  if (n != null) {
    if (props.min !== undefined && n < props.min) n = props.min
    if (props.max !== undefined && n > props.max) n = props.max
    n = Number(n.toFixed(props.decimals))
  }
  model.value = n
  texto.value = n == null ? '' : formatNumber(n, props.decimals)
}

// Cambios externos del modelo (reset de formulario, carga de datos)
watch(model, (v) => {
  if (!enfocado.value) texto.value = v == null ? '' : formatNumber(v, props.decimals)
})

onMounted(() => {
  texto.value = model.value == null ? '' : formatNumber(model.value, props.decimals)
})
</script>

<template>
  <div class="relative">
    <input
      :id="field?.id"
      v-model="texto"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="isInvalid || undefined"
      class="input text-right tabular-nums"
      :class="suffix ? 'pr-12' : ''"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="($event.target as HTMLInputElement).blur()"
    />
    <span
      v-if="suffix"
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12.5px] text-ink-soft"
      >{{ suffix }}</span
    >
  </div>
</template>
