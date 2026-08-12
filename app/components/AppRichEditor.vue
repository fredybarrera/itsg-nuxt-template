<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const editorRef = ref<HTMLDivElement>()

function sync() {
  if (!editorRef.value) return
  model.value = sanitizeHtml(editorRef.value.innerHTML)
}

function ejecutar(cmd: string, valor?: string) {
  editorRef.value?.focus()
  document.execCommand(cmd, false, valor)
  sync()
}

function insertarEnlace() {
  const url = window.prompt('URL del enlace (https://…):')
  if (url) ejecutar('createLink', url)
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const html = e.clipboardData?.getData('text/html')
  const texto = e.clipboardData?.getData('text/plain') ?? ''
  const contenido = html ? sanitizeHtml(html) : escapeHtml(texto)
  document.execCommand('insertHTML', false, contenido)
  sync()
}

function aplicarDesdeFuera(html: string) {
  if (editorRef.value && editorRef.value.innerHTML !== html) {
    editorRef.value.innerHTML = html
  }
}

onMounted(() => aplicarDesdeFuera(model.value ?? ''))
watch(model, (v) => aplicarDesdeFuera(v ?? ''))
</script>

<template>
  <div class="overflow-hidden rounded-(--radius-sm) border border-line-strong bg-paper">
    <div class="flex flex-wrap items-center gap-0.5 border-b border-line px-1.5 py-1">
      <button type="button" class="rich-btn font-bold" title="Negrita" @click="ejecutar('bold')">B</button>
      <button type="button" class="rich-btn italic" title="Cursiva" @click="ejecutar('italic')">I</button>
      <button type="button" class="rich-btn underline" title="Subrayado" @click="ejecutar('underline')">
        U
      </button>
      <span class="mx-1 h-4 w-px bg-line-strong" />
      <button
        type="button"
        class="rich-btn"
        title="Lista con viñetas"
        @click="ejecutar('insertUnorderedList')"
      >
        ☰
      </button>
      <button type="button" class="rich-btn" title="Lista numerada" @click="ejecutar('insertOrderedList')">
        ☱
      </button>
      <span class="mx-1 h-4 w-px bg-line-strong" />
      <button type="button" class="rich-btn" title="Insertar enlace" @click="insertarEnlace">
        <AppIcon name="external" :size="13" />
      </button>
      <button type="button" class="rich-btn" title="Quitar formato" @click="ejecutar('removeFormat')">
        <AppIcon name="close" :size="13" />
      </button>
    </div>
    <div
      ref="editorRef"
      class="min-h-[96px] px-3 py-2 text-sm text-ink outline-none [&_a]:text-calipso [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      contenteditable="true"
      @input="sync"
      @paste="onPaste"
      @blur="sync"
    />
  </div>
</template>

<style scoped>
.rich-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-ink-soft);
}
.rich-btn:hover {
  background: var(--color-paper-2);
  color: var(--color-ink);
}
</style>
