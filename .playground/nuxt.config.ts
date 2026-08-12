// App de desarrollo/demo del ITSG DS. Extiende la capa (la raíz del repo) igual
// que lo haría un proyecto consumidor, así hacemos dogfooding de la capa.
// Las páginas demo viven aquí (no en la capa) para que NO se hereden en los consumidores.
export default defineNuxtConfig({
  extends: ['..'],

  // Solo para el entorno de desarrollo; no forma parte de la capa.
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  devServer: { port: 5173 },
})
