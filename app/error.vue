<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

function volver() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-6 text-ink">
    <IconSprite />
    <div class="frame w-full max-w-md text-center">
      <p class="m-0 font-mono text-[13px] font-semibold tracking-widest text-ink-soft">
        ERROR {{ error.statusCode }}
      </p>
      <h1 class="mt-2 font-display text-2xl font-bold">
        {{ is404 ? 'Página no encontrada' : 'Algo salió mal' }}
      </h1>
      <p class="mt-2 text-sm text-ink-soft">
        {{
          is404
            ? 'La ruta que buscas no existe o fue movida.'
            : error.statusMessage || 'Ocurrió un error inesperado. Intenta nuevamente.'
        }}
      </p>
      <div class="mt-6 flex justify-center">
        <AppButton variant="primary" @click="volver">Volver al inicio</AppButton>
      </div>
    </div>
  </div>
</template>
