<script setup lang="ts">
import type { TreeNode } from '#itsg/types/tree'

const props = defineProps<{
  node: TreeNode
  depth: number
}>()

const tree = useTree()

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)
const isExpanded = computed(() => tree.isExpanded(props.node.key))
const isSelected = computed(() => tree.selected.value === props.node.key)

function onKeydown(e: KeyboardEvent) {
  if (!hasChildren.value) return
  if (e.key === 'ArrowRight' && !isExpanded.value) {
    e.preventDefault()
    tree.toggle(props.node.key)
  } else if (e.key === 'ArrowLeft' && isExpanded.value) {
    e.preventDefault()
    tree.toggle(props.node.key)
  }
}
</script>

<template>
  <li role="treeitem" :aria-expanded="hasChildren ? isExpanded : undefined" :aria-selected="isSelected">
    <div class="flex items-center" :style="{ paddingLeft: `${depth * 18}px` }">
      <button
        v-if="hasChildren"
        type="button"
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-(--radius-sm) border-none bg-transparent text-ink-soft hover:bg-paper-2 hover:text-ink"
        :aria-label="isExpanded ? 'Contraer' : 'Expandir'"
        @click="tree.toggle(node.key)"
      >
        <AppIcon
          name="chevright"
          :size="12"
          class="transition-transform duration-150"
          :class="isExpanded ? 'rotate-90' : ''"
        />
      </button>
      <span v-else class="w-6 shrink-0" />

      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 rounded-(--radius-sm) border-none bg-transparent px-2 py-1.5 text-left text-[13.5px]"
        :class="[
          isSelected ? 'bg-calipso/15 font-semibold text-calipso-deep' : 'text-ink hover:bg-paper-2',
          node.disabled ? 'cursor-not-allowed opacity-45 hover:bg-transparent' : '',
        ]"
        :disabled="node.disabled"
        @click="tree.select(node)"
        @dblclick="hasChildren && tree.toggle(node.key)"
        @keydown="onKeydown"
      >
        <AppIcon
          v-if="node.icon"
          :name="node.icon"
          :size="15"
          class="shrink-0"
          :class="isSelected ? '' : 'text-ink-soft'"
        />
        <span class="truncate">
          <slot name="label" :node="node" :depth="depth">{{ node.label }}</slot>
        </span>
      </button>
    </div>

    <ul v-if="hasChildren && isExpanded" role="group" class="m-0 flex list-none flex-col gap-0.5 p-0">
      <AppTreeItem v-for="child in node.children" :key="child.key" :node="child" :depth="depth + 1">
        <template v-if="$slots.label" #label="slotProps">
          <slot name="label" v-bind="slotProps" />
        </template>
      </AppTreeItem>
    </ul>
  </li>
</template>
