<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    disabled?: boolean
    readonly?: boolean
    maxlength?: number
    /** Muestra "n/max" abajo a la derecha; requiere `maxlength`. */
    showCount?: boolean
    invalid?: boolean
  }>(),
  {
    placeholder: undefined,
    rows: 4,
    disabled: false,
    readonly: false,
    maxlength: undefined,
    showCount: false,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))
</script>

<template>
  <div class="relative">
    <textarea
      :id="field?.id"
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :aria-invalid="isInvalid || undefined"
      class="input resize-y leading-normal"
      :class="showCount && maxlength ? 'pb-6' : ''"
    />
    <span
      v-if="showCount && maxlength"
      class="pointer-events-none absolute bottom-2 right-2.5 font-mono text-[11px] text-ink-soft"
      >{{ model.length }}/{{ maxlength }}</span
    >
  </div>
</template>
