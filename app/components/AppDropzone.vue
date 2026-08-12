<script setup lang="ts">
export interface UploadedFile {
  id: number
  name: string
  size: number
}

const model = defineModel<UploadedFile[]>({ default: () => [] })
const isDragover = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function addFiles(files: FileList) {
  for (const file of files) {
    model.value.push({ id: Date.now() + Math.random(), name: file.name, size: file.size })
  }
}

function onDrop(e: DragEvent) {
  isDragover.value = false
  if (e.dataTransfer?.files.length) addFiles(e.dataTransfer.files)
}

function onInputChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) addFiles(input.files)
  input.value = ''
}

function removeFile(id: number) {
  const idx = model.value.findIndex((f) => f.id === id)
  if (idx !== -1) model.value.splice(idx, 1)
}
</script>

<template>
  <div>
    <div
      class="border-2 border-dashed border-line-strong rounded-md py-9 px-5 text-center cursor-pointer transition-colors"
      :class="isDragover ? 'border-calipso bg-calipso/6' : 'hover:border-calipso hover:bg-calipso/6'"
      @click="inputRef?.click()"
      @dragover.prevent="isDragover = true"
      @dragleave="isDragover = false"
      @drop.prevent="onDrop"
    >
      <input ref="inputRef" type="file" multiple class="hidden" @change="onInputChange" />
      <AppIcon name="upload" :size="30" class="text-ink-soft" />
      <p class="text-[13.5px] text-ink mt-3 mb-1">
        Arrastra archivos aquí o <span class="text-calipso font-bold underline">selecciona</span>
      </p>
      <p class="text-xs text-ink-soft">PDF, JPG, PNG — máx. 10MB por archivo</p>
    </div>
    <div v-if="model.length" class="mt-3.5 flex flex-col gap-2">
      <div
        v-for="file in model"
        :key="file.id"
        class="flex items-center gap-2.5 py-2.5 px-3 bg-paper-2 rounded-sm text-[13px]"
      >
        <AppIcon name="file" :size="16" class="text-ink-soft shrink-0" />
        <span class="flex-1 font-semibold text-ink overflow-hidden text-ellipsis whitespace-nowrap">{{
          file.name
        }}</span>
        <span class="text-ink-soft text-[11.5px] shrink-0">{{ formatSize(file.size) }}</span>
        <button
          class="bg-transparent border-none cursor-pointer text-ink-soft shrink-0 flex p-0.5 hover:text-rojo-deep"
          aria-label="Quitar archivo"
          @click="removeFile(file.id)"
        >
          <AppIcon name="close" :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
