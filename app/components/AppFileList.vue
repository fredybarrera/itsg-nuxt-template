<script setup lang="ts">
import type { FileItem } from '#itsg/types/files'

withDefaults(
  defineProps<{
    files: FileItem[]
    removable?: boolean
  }>(),
  { removable: true }
)

defineEmits<{ remove: [file: FileItem, index: number] }>()
</script>

<template>
  <ul class="m-0 flex list-none flex-col gap-2 p-0">
    <li
      v-for="(f, i) in files"
      :key="`${f.name}-${i}`"
      class="flex items-start gap-3 rounded-(--radius-md) border bg-card p-3"
      :class="f.error ? 'border-danger/50' : 'border-line'"
    >
      <AppIcon
        name="file"
        :size="18"
        class="mt-0.5 shrink-0"
        :class="f.error ? 'text-danger' : 'text-ink-soft'"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <a
            v-if="f.url && !f.error"
            :href="f.url"
            target="_blank"
            rel="noopener noreferrer"
            class="truncate text-[13.5px] font-semibold text-calipso-deep no-underline hover:underline"
            >{{ f.name }}</a
          >
          <span v-else class="truncate text-[13.5px] font-semibold text-ink">{{ f.name }}</span>
          <span v-if="f.size != null" class="shrink-0 font-mono text-[11.5px] text-ink-soft">
            {{ formatBytes(f.size) }}
          </span>
        </div>
        <AppProgress
          v-if="f.progress != null && f.progress < 100 && !f.error"
          :value="f.progress"
          class="mt-2"
        />
        <p v-if="f.error" class="m-0 mt-1 text-[12.5px] text-danger">{{ f.error }}</p>
      </div>
      <button
        v-if="removable"
        type="button"
        class="flex shrink-0 rounded-(--radius-sm) border-none bg-transparent p-1 text-ink-soft hover:bg-paper-2 hover:text-danger"
        :aria-label="`Quitar ${f.name}`"
        @click="$emit('remove', f, i)"
      >
        <AppIcon name="trash" :size="15" />
      </button>
    </li>
  </ul>
</template>
