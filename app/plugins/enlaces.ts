import { NuxtLink } from '#components'

/**
 * Registra `NuxtLink` como componente global de Vue.
 *
 * Nuxt no lo hace: sus componentes se resuelven al compilar, no en tiempo de
 * ejecución. Basta mientras se escriban como etiqueta —`<NuxtLink to="…">`—,
 * pero no cuando el nombre llega como cadena a `<component :is="…">`.
 *
 * Es justo lo que hace `AppButton` con `as="NuxtLink"`. Sin este registro, Vue
 * no encuentra el componente y —sin avisar por consola, porque trata la cadena
 * como una etiqueta nativa— deja en el DOM un `<nuxtlink>` sin `href` y sin
 * navegación: el botón se ve idéntico a uno que funciona y no hace nada. No
 * falla en el build, ni en el typecheck, ni en el lint.
 *
 * Se registra aquí y no dentro de `AppButton` para no importar `#components`
 * desde un componente: sería un ciclo con el barril que lo exporta, y
 * arrastraría toda la librería al chunk del botón.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtLink', NuxtLink)
})
