<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    icon?: string
    clearable?: boolean
    /** Fuerza el estado de error; dentro de AppFormField basta con pasar `error` al wrapper. */
    invalid?: boolean
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    icon: undefined,
    clearable: false,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))
</script>

<template>
  <div class="relative">
    <AppIcon
      v-if="icon"
      :name="icon"
      :size="16"
      class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
    />
    <input
      :id="field?.id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="isInvalid || undefined"
      class="input"
      :class="[icon && 'pl-9', clearable && model && 'pr-9']"
    />
    <button
      v-if="clearable && model && !disabled && !readonly"
      type="button"
      class="absolute right-2.5 top-1/2 flex -translate-y-1/2 border-none bg-transparent p-0.5 text-ink-soft hover:text-ink"
      aria-label="Limpiar"
      @click="model = ''"
    >
      <AppIcon name="close" :size="14" />
    </button>
  </div>
</template>
