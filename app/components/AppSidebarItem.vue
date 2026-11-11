<script setup lang="ts">
import type { SidebarLink } from '#itsg/types/sidenav'

const props = withDefaults(defineProps<{ link: SidebarLink; depth?: number; collapsed?: boolean }>(), {
  depth: 0,
  collapsed: false,
})

const route = useRoute()

const hasChildren = computed(() => (props.link.children?.length ?? 0) > 0)

function containsActive(l: SidebarLink): boolean {
  if (l.to && route.path === l.to) return true
  return l.children?.some(containsActive) ?? false
}
const isDescendantActive = computed(() => (props.link.children ?? []).some((c) => containsActive(c)))

// Se abre solo cuando la ruta activa vive dentro de este subárbol
const open = ref(false)
watchEffect(() => {
  if (isDescendantActive.value) open.value = true
})

const indent = computed(() => (props.collapsed ? undefined : { paddingLeft: `${10 + props.depth * 16}px` }))
</script>

<template>
  <!-- Nodo con hijos: botón desplegable -->
  <div v-if="hasChildren" v-show="!(collapsed && depth > 0)">
    <button
      type="button"
      class="flex w-full items-center gap-2.5 rounded-(--radius-md) border-y-0 border-r-0 border-l-2 bg-transparent py-2 pr-2.5 text-left font-body text-[13.5px] text-shell-ink-strong hover:bg-white/10"
      :class="[
        isDescendantActive ? 'border-l-calipso font-semibold [&_.icon]:stroke-calipso' : 'border-transparent',
        collapsed ? 'justify-center px-0' : '',
      ]"
      :style="indent"
      :aria-expanded="open"
      :title="link.label"
      @click="open = !open"
    >
      <AppIcon v-if="link.icon" :name="link.icon" />
      <template v-if="!collapsed">
        <span class="flex-1">{{ link.label }}</span>
        <AppIcon
          name="chevdown"
          :size="13"
          class="opacity-60 transition-transform duration-150"
          :class="open ? '' : '-rotate-90'"
        />
      </template>
    </button>
    <div v-show="open && !collapsed" class="mt-0.5 flex flex-col gap-0.5">
      <AppSidebarItem
        v-for="(child, i) in link.children"
        :key="child.to ?? `${child.label}-${i}`"
        :link="child"
        :depth="depth + 1"
        :collapsed="collapsed"
      />
    </div>
  </div>

  <!-- Hoja: enlace de navegación -->
  <NuxtLink
    v-else-if="link.to"
    v-show="!(collapsed && depth > 0)"
    :to="link.to"
    class="flex items-center gap-2.5 rounded-(--radius-md) border-l-2 border-transparent py-2 pr-2.5 text-[13.5px] text-shell-ink-strong no-underline hover:bg-white/10 hover:text-white"
    active-class="bg-gradient-to-r from-calipso/20 to-transparent border-l-calipso! text-white font-semibold [&_.icon]:stroke-calipso"
    :class="collapsed ? 'justify-center px-0' : ''"
    :style="indent"
    :title="link.label"
  >
    <AppIcon v-if="link.icon" :name="link.icon" />
    <span v-if="!collapsed">{{ link.label }}</span>
  </NuxtLink>
</template>
