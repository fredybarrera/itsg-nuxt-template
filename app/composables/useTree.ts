import type { ComputedRef, InjectionKey } from 'vue'
import type { TreeNode } from '#itsg/types/tree'

export interface TreeContext {
  selected: ComputedRef<string | null>
  isExpanded: (key: string) => boolean
  toggle: (key: string) => void
  select: (node: TreeNode) => void
}

export const treeKey: InjectionKey<TreeContext> = Symbol('tree')

/** Contexto provisto por AppTree; lo consumen los AppTreeItem recursivos. */
export function useTree(): TreeContext {
  const ctx = inject(treeKey, null)
  if (!ctx) throw new Error('AppTreeItem debe usarse dentro de AppTree')
  return ctx
}
