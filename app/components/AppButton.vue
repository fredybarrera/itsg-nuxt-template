<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

// Los atributos del consumidor se colocan a mano (ver `atributos`): apagado,
// un enlace tiene que perder su destino.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    iconOnly?: boolean
    /** Apaga el control. En un enlace (`as="a"` / `as="NuxtLink"`) también impide navegar. */
    disabled?: boolean
    /** Muestra spinner y deshabilita el botón. */
    loading?: boolean
    /**
     * Etiqueta a renderizar: una nativa (`'a'`, `'label'`) o el nombre de un
     * componente **registrado globalmente**. `'NuxtLink'` lo está gracias a
     * `plugins/enlaces.ts` — sin ese registro Vue trataría la cadena como una
     * etiqueta nativa y dejaría un `<nuxtlink>` mudo, sin avisar.
     */
    as?: string
    /** Solo aplica cuando `as` es 'button'. Default 'button' para no hacer submit accidental en formularios. */
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    iconOnly: false,
    disabled: false,
    loading: false,
    as: 'button',
    type: 'button',
  }
)

const attrs = useAttrs()

const esBoton = computed(() => props.as === 'button')
const inactivo = computed(() => props.disabled || props.loading)

/**
 * Apagar un enlace no es lo mismo que apagar un botón. `disabled` no existe
 * para `<a>`: el navegador lo ignora, la variante `disabled:` de Tailwind no
 * engancha y el enlace sigue navegando, gris o no.
 *
 * Tampoco basta con `pointer-events-none` y `tabindex="-1"`: paran el ratón y
 * el teclado, pero un `.click()` por código pasa igual, porque vue-router
 * ejecuta su propio manejador antes que cualquiera que añadamos aquí.
 *
 * Así que apagado deja de ser un enlace: se renderiza un `<span>` sin destino.
 * No hay a dónde ir, no hay foco que capturar y no hay manejador que burlar.
 */
const inerte = computed(() => inactivo.value && !esBoton.value)

const etiqueta = computed(() => (inerte.value ? 'span' : props.as))

/** Lo que activaría el control. Sin esto quedarían un `<span href>` que no lleva a ninguna parte y un `@click` que sí dispara. */
const ATRIBUTOS_DE_ACTIVACION = ['to', 'href', 'target', 'rel', 'onClick']

/**
 * `class` sale de aquí y se fusiona explícitamente en `classes`: con los
 * atributos puestos a mano, dejar que convivan dos fuentes de clases sobre el
 * mismo elemento depende de cómo Vue las mezcle. Así el orden es nuestro y la
 * del consumidor va siempre al final.
 */
const atributos = computed(() => {
  const fuera = new Set(inerte.value ? ['class', ...ATRIBUTOS_DE_ACTIVACION] : ['class'])
  return Object.fromEntries(Object.entries(attrs).filter(([clave]) => !fuera.has(clave)))
})

const variantClasses: Record<Variant, string> = {
  primary: 'bg-calipso text-white hover:bg-calipso-deep',
  secondary: 'bg-corteza text-white hover:bg-corteza-dark',
  outline: 'bg-transparent border-line-strong text-ink hover:bg-paper-2',
  ghost: 'bg-transparent border-line-strong text-ink-soft hover:bg-paper-2 hover:text-ink',
  danger: 'bg-rojo-deep text-white hover:opacity-90',
  success: 'bg-verde text-white hover:bg-verde-deep',
}

const sizeClasses: Record<Size, string> = {
  sm: 'py-1.5 px-3 text-[12.5px]',
  md: 'py-2.5 px-[18px] text-[13.5px]',
  lg: 'py-[13px] px-[22px] text-[14.5px]',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 font-body font-semibold cursor-pointer rounded-full border border-transparent transition-transform active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  props.iconOnly ? 'p-[9px] w-[38px]' : sizeClasses[props.size],
  // El `<span>` no reacciona a la variante `disabled:`, así que se apaga aquí.
  inerte.value ? 'opacity-40 cursor-not-allowed' : '',
  attrs.class,
])
</script>

<template>
  <component
    :is="etiqueta"
    v-bind="atributos"
    :class="classes"
    :disabled="esBoton ? disabled || loading : undefined"
    :type="esBoton ? type : undefined"
    :aria-disabled="inerte || undefined"
    :aria-busy="loading || undefined"
  >
    <AppSpinner v-if="loading" :size="14" />
    <slot />
  </component>
</template>
