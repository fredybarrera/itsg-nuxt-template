import type { MaybeRefOrGetter } from 'vue'

/**
 * Same algorithm as the original HTML's `spy()`: the active target is the
 * last section (in document order) whose top edge has scrolled past 120px
 * from the viewport top — not IntersectionObserver, to keep behavior
 * identical to the file this was ported from.
 */
export function useScrollSpy(targets: MaybeRefOrGetter<string[]>) {
  const active = ref('')

  const update = () => {
    const ids = toValue(targets)
    if (!ids.length) return
    let current = ids[0]
    for (const id of ids) {
      const el = document.querySelector(id)
      if (el && el.getBoundingClientRect().top < 120) current = id
    }
    active.value = current
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { active, update }
}
