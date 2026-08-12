<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; danger?: boolean }>(), { icon: undefined, danger: false })
</script>

<template>
  <button
    :class="[
      'flex items-center gap-2.5 py-2.5 px-2.5 rounded-sm text-[13.5px] w-full text-left cursor-pointer bg-transparent border-none font-body hover:bg-paper-2',
      danger ? 'text-rojo-deep' : 'text-ink',
    ]"
  >
    <AppIcon v-if="icon" :name="icon" />
    <slot />
  </button>
</template>
