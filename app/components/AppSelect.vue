<script setup lang="ts">
import type { SelectOption } from '#itsg/types/form'

const model = defineModel<string | number>({ default: '' })

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
  }>(),
  {
    placeholder: undefined,
    disabled: false,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))
</script>

<template>
  <div class="relative">
    <select
      :id="field?.id"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="isInvalid || undefined"
      class="input appearance-none pr-9"
      :class="model === '' ? 'text-ink-soft' : ''"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>
    <AppIcon
      name="chevdown"
      :size="14"
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
    />
  </div>
</template>
