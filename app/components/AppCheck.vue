<script setup lang="ts">
const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <span
    role="checkbox"
    :aria-checked="checked"
    tabindex="0"
    :class="[
      'relative inline-flex w-[18px] h-[18px] rounded-[3px] border-[1.6px] cursor-pointer shrink-0',
      'after:content-[\'\'] after:absolute after:left-1 after:top-px after:w-1.5 after:h-2.5 after:rotate-[40deg] after:border-0 after:border-r-2 after:border-b-2',
      checked
        ? 'bg-calipso border-calipso after:border-primary-ink'
        : 'bg-paper border-line-strong after:border-transparent',
    ]"
    @click="checked = !checked"
    @keydown.space.prevent="checked = !checked"
    @keydown.enter.prevent="checked = !checked"
  />
</template>
