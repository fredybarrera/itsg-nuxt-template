<script setup lang="ts">
const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <span
    role="switch"
    :aria-checked="checked"
    tabindex="0"
    :class="[
      'relative inline-flex w-[38px] h-[22px] rounded-full cursor-pointer shrink-0 transition-colors duration-150',
      checked ? 'bg-calipso' : 'bg-line-strong',
    ]"
    @click="checked = !checked"
    @keydown.space.prevent="checked = !checked"
    @keydown.enter.prevent="checked = !checked"
  >
    <span
      :class="[
        'absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-[left] duration-150',
        checked ? 'left-[18px]' : 'left-0.5',
      ]"
    />
  </span>
</template>
