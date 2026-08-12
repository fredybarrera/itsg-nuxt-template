<script setup lang="ts">
const model = defineModel<string[]>({ default: () => [] })
const draft = ref('')

function addChip() {
  const v = draft.value.trim()
  if (v && !model.value.includes(v)) model.value.push(v)
  draft.value = ''
}

function removeChip(i: number) {
  model.value.splice(i, 1)
}
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center border border-line-strong rounded-sm py-2.5 px-3 bg-paper">
    <span
      v-for="(chip, i) in model"
      :key="chip"
      class="inline-flex items-center gap-1.5 bg-paper-2 rounded-[2px] py-1.5 pr-1.5 pl-2.5 text-[12.5px] font-semibold text-ink"
    >
      {{ chip }}
      <button
        class="bg-transparent border-none text-ink-soft cursor-pointer text-sm leading-none p-0.5 flex hover:text-rojo-deep"
        aria-label="Quitar"
        @click="removeChip(i)"
      >
        ×
      </button>
    </span>
    <input
      v-model="draft"
      class="flex-1 min-w-[120px] border-none bg-transparent text-[13.5px] text-ink outline-none font-body"
      placeholder="Agregar etiqueta…"
      @keydown.enter.prevent="addChip"
    />
  </div>
</template>
