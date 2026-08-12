import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// Config de la CAPA (Nuxt Layer). La consumen otros proyectos vía
//   extends: ['github:ITSolutionsGroup/itsg-nuxt-template']
// El playground en .playground/ la extiende para desarrollo/demo.
//
// Ojo (gotcha de layers): en nuxt.config, tanto los alias (~/) como las rutas
// relativas se resuelven contra el proyecto CONSUMIDOR, no contra la capa.
// Por eso se usan rutas absolutas derivadas de import.meta.url.
// https://nuxt.com/docs/guide/going-further/layers
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,

  // CSS del DS: ruta absoluta para que resuelva desde cualquier consumidor.
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],

  // Alias de capa: los archivos de la capa (y los consumidores) referencian sus
  // tipos/composables con `#itsg/...` en vez de `~/...` (que apuntaría al consumidor).
  alias: {
    '#itsg': fileURLToPath(new URL('./app', import.meta.url)),
  },

  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
