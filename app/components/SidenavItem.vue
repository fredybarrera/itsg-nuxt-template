<script setup lang="ts">
import type { SidenavNode } from '#itsg/types/sidenav'

const props = withDefaults(defineProps<{ node: SidenavNode; depth?: number }>(), { depth: 0 })

const activeTarget = inject<Ref<string>>('sidenavActiveTarget')!
const railMode = inject<Ref<boolean>>('sidenavRailMode')!
const navigate = inject<(target: string) => void>('sidenavNavigate')!

// Matches the original's fixed .sidenav-child (38px) / .sidenav-grandchild
// (56px) offsets, extended by +18px per level beyond that.
const paddingSteps = [10, 38, 56, 74]
const paddingLeft = `${paddingSteps[Math.min(props.depth, paddingSteps.length - 1)]}px`

function collectTargets(node: SidenavNode): string[] {
  return node.type === 'link' ? [node.target] : node.children.flatMap(collectTargets)
}
const subtreeTargets = props.node.type === 'parent' ? collectTargets(props.node) : []

const isActive = computed(() => props.node.type === 'link' && activeTarget.value === props.node.target)
const isAncestorActive = computed(() => subtreeTargets.includes(activeTarget.value))
// Collapsed-to-rail hides nested levels entirely and shows only icons at depth 0.
const hiddenInRail = computed(() => railMode.value && props.depth > 0)
const iconOnlyInRail = computed(() => railMode.value && props.depth === 0)

const isOpen = ref(true)
watchEffect(() => {
  if (isAncestorActive.value) isOpen.value = true
})
</script>

<template>
  <a
    v-if="node.type === 'link'"
    v-show="!hiddenInRail"
    :href="node.target"
    :title="node.label"
    :style="{ paddingLeft }"
    :class="[
      'flex items-center gap-2.5 py-2.5 rounded-sm no-underline text-[13.5px] border-l-2 cursor-pointer hover:bg-paper-2 hover:text-ink',
      isActive
        ? 'bg-paper-2 text-primary-ink font-semibold border-calipso'
        : 'text-ink-soft border-transparent',
      iconOnlyInRail ? 'justify-center px-0' : '',
    ]"
    @click.prevent="navigate(node.target)"
  >
    <AppIcon v-if="node.icon" :name="node.icon" :size="16" class="opacity-80" />
    <span v-show="!iconOnlyInRail">{{ node.label }}</span>
  </a>

  <div v-else v-show="!hiddenInRail" class="mb-px">
    <button
      :style="{ paddingLeft }"
      :class="[
        'w-full flex items-center gap-2.5 py-2.5 rounded-sm text-[13.5px] border-l-2 border-t-0 border-r-0 border-b-0 bg-transparent text-left cursor-pointer font-body hover:bg-paper-2 hover:text-ink',
        isAncestorActive ? 'bg-paper-2 text-primary-ink border-calipso' : 'text-ink-soft border-transparent',
        iconOnlyInRail ? 'justify-center px-0' : '',
      ]"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <AppIcon v-if="node.icon" :name="node.icon" :size="16" class="opacity-80" />
      <span v-show="!iconOnlyInRail" class="flex-1 text-left">{{ node.label }}</span>
      <AppIcon
        v-show="!iconOnlyInRail"
        name="chevdown"
        :size="13"
        :class="['opacity-55 transition-transform duration-150', !isOpen ? '-rotate-90' : '']"
      />
    </button>
    <div v-show="isOpen && !iconOnlyInRail" class="overflow-hidden">
      <SidenavItem v-for="(child, i) in node.children" :key="i" :node="child" :depth="depth + 1" />
    </div>
  </div>
</template>
