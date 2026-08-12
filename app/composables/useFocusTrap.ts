import type { ComputedRef, Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Contador global para soportar overlays apilados (modal sobre drawer, etc.)
let scrollLocks = 0

function lockScroll() {
  if (scrollLocks === 0) document.body.style.overflow = 'hidden'
  scrollLocks++
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1)
  if (scrollLocks === 0) document.body.style.overflow = ''
}

export interface FocusTrapOptions {
  onEscape?: () => void
  /** Elemento a enfocar al abrir; si no, el primer focusable del contenedor. */
  initialFocus?: () => HTMLElement | null
}

/**
 * Accesibilidad estándar de overlays (drawer, modal, confirm):
 * - bloquea el scroll del body mientras está abierto
 * - atrapa Tab dentro del contenedor
 * - cierra con Escape (vía onEscape)
 * - al cerrar devuelve el foco al elemento que lo tenía
 * Los listeners solo existen mientras `active` es true.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean> | ComputedRef<boolean>,
  options: FocusTrapOptions = {}
) {
  let previousFocus: HTMLElement | null = null

  function focusables(): HTMLElement[] {
    if (!container.value) return []
    return Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    )
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      options.onEscape?.()
      return
    }
    if (e.key !== 'Tab') return
    const items = focusables()
    if (items.length === 0) return
    const first = items[0]!
    const last = items[items.length - 1]!
    const current = document.activeElement as HTMLElement | null
    if (e.shiftKey && (current === first || !container.value?.contains(current))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (current === last || !container.value?.contains(current))) {
      e.preventDefault()
      first.focus()
    }
  }

  function activate() {
    previousFocus = document.activeElement as HTMLElement | null
    lockScroll()
    document.addEventListener('keydown', onKeydown, true)
    nextTick(() => {
      const target = options.initialFocus?.() ?? focusables()[0] ?? container.value
      target?.focus()
    })
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown, true)
    unlockScroll()
    previousFocus?.focus()
    previousFocus = null
  }

  watch(
    active,
    (isActive, wasActive) => {
      if (isActive && !wasActive) activate()
      else if (!isActive && wasActive) deactivate()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (active.value) deactivate()
  })
}
