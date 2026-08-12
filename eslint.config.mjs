// @ts-check
import prettier from 'eslint-config-prettier'
// El proyecto Nuxt real es el playground (que extiende la capa); su config generada
// incluye los overrides por directorio (p. ej. pages/ exento de multi-word-component-names).
import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt(
  // Prettier es la única autoridad de formato: desactiva reglas estilísticas en conflicto.
  prettier,
  // Las páginas del playground viven en .playground/app/pages: el override de páginas que
  // genera @nuxt/eslint usa un glob relativo al rootDir del playground, así que no aplica al
  // correr `eslint .` desde la raíz. Se exime aquí explícitamente (son rutas, no componentes).
  {
    files: ['.playground/app/pages/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  }
)
