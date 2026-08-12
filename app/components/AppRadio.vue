<script setup lang="ts">
const props = defineProps<{ modelValue: string; value: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const checked = computed(() => props.modelValue === props.value)
</script>

<template>
  <span
    role="radio"
    :aria-checked="checked"
    tabindex="0"
    :class="[
      'relative inline-flex w-[18px] h-[18px] rounded-full border-[1.6px] cursor-pointer shrink-0 bg-paper',
      'after:content-[\'\'] after:absolute after:inset-[3px] after:rounded-full',
      checked ? 'border-calipso after:bg-calipso' : 'border-line-strong after:bg-transparent',
    ]"
    @click="emit('update:modelValue', value)"
    @keydown.space.prevent="emit('update:modelValue', value)"
    @keydown.enter.prevent="emit('update:modelValue', value)"
  />
</template>
