<script setup lang="ts">
interface Swatch {
  name: string
  hex: string
}

const swatches: Swatch[] = [
  { name: 'Corteza', hex: '#696158' },
  { name: 'Verde', hex: '#bfb800' },
  { name: 'Naranja', hex: '#ea7600' },
  { name: 'Madera', hex: '#dfd1a7' },
  { name: 'Calipso', hex: '#5dbaa9' },
  { name: 'Amarillo', hex: '#f3d01c' },
  { name: 'Rojo', hex: '#b46a5f' },
]

const model = defineModel<string>({ default: '#5dbaa9' })
</script>

<template>
  <AppDropdown>
    <template #trigger>
      <button
        class="w-10 h-10 rounded-full border-2 border-card shadow-[0_0_0_1px_var(--color-line-strong)] cursor-pointer p-0"
        :style="{ background: model }"
        aria-label="Elegir color"
      />
    </template>
    <template #menu>
      <div class="p-3.5 min-w-[224px]">
        <div class="grid grid-cols-4 gap-2.5 mb-3">
          <button
            v-for="sw in swatches"
            :key="sw.hex"
            type="button"
            class="relative w-[38px] h-[38px] rounded-full border-2 cursor-pointer p-0"
            :class="model === sw.hex ? 'border-ink' : 'border-transparent'"
            :style="{ background: sw.hex }"
            :aria-label="sw.name"
            @click="model = sw.hex"
          >
            <span v-if="model === sw.hex" class="absolute inset-0 rounded-full border-2 border-card" />
          </button>
        </div>
        <div class="flex items-center gap-2 border-t border-line pt-3 font-mono text-xs text-ink-soft">
          <span>HEX</span>
          <input
            v-model="model"
            class="border-none bg-transparent text-ink font-mono text-[12.5px] w-full p-0 outline-none"
          />
        </div>
      </div>
    </template>
  </AppDropdown>
</template>
