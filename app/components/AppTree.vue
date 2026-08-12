<script setup lang="ts">
import type { TreeNode } from '#itsg/types/tree'

const selected = defineModel<string | null>({ default: null })
const expanded = defineModel<string[]>('expanded', { default: () => [] })

const props = withDefaults(
  defineProps<{
    nodes: TreeNode[]
    /** Expande todo el árbol al montar (si no hay expansión previa). */
    defaultExpandAll?: boolean
  }>(),
  { defaultExpandAll: false }
)

const emit = defineEmits<{ select: [node: TreeNode] }>()

function allKeys(nodes: TreeNode[]): string[] {
  return nodes.flatMap((n) => [n.key, ...(n.children ? allKeys(n.children) : [])])
}

onMounted(() => {
  if (props.defaultExpandAll && expanded.value.length === 0) expanded.value = allKeys(props.nodes)
})

const expandedSet = computed(() => new Set(expanded.value))

provide(treeKey, {
  selected: computed(() => selected.value),
  isExpanded: (key) => expandedSet.value.has(key),
  toggle(key) {
    expanded.value = expandedSet.value.has(key)
      ? expanded.value.filter((k) => k !== key)
      : [...expanded.value, key]
  },
  select(node) {
    if (node.disabled) return
    selected.value = node.key
    emit('select', node)
  },
})
</script>

<template>
  <ul role="tree" class="m-0 flex list-none flex-col gap-0.5 p-0">
    <AppTreeItem v-for="n in nodes" :key="n.key" :node="n" :depth="0">
      <template v-if="$slots.label" #label="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </AppTreeItem>
  </ul>
</template>
