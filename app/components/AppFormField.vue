<script setup lang="ts">
const props = defineProps<{
  label?: string
  hint?: string
  error?: string
  required?: boolean
}>()

const id = useId()

provide(formFieldKey, {
  id,
  error: computed(() => props.error),
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-[13px] font-semibold text-ink">
      {{ label }}<span v-if="required" class="ml-0.5 text-danger" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="error" class="m-0 text-[12.5px] text-danger" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="m-0 text-[12.5px] text-ink-soft">{{ hint }}</p>
  </div>
</template>
