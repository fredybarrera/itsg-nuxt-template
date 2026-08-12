<script setup lang="ts">
import type { SidebarLink } from '#itsg/types/sidenav'

withDefaults(
  defineProps<{
    collapsed: boolean
    /** Visibilidad en mobile (&lt;md): el sidebar es overlay ahí, no rail permanente. */
    mobileOpen?: boolean
    links?: SidebarLink[]
    linksSecundarios?: SidebarLink[]
    tituloSecundario?: string
  }>(),
  {
    mobileOpen: false,
    links: () => [{ label: 'Inicio', to: '/', icon: 'home' }],
    linksSecundarios: () => [],
    tituloSecundario: 'Administración',
  }
)

defineEmits<{ close: [] }>()
</script>

<template>
  <!-- Backdrop de overlay: solo existe visualmente bajo `md` (md:hidden), aun si el nodo se monta en desktop. -->
  <div
    v-if="mobileOpen"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    aria-hidden="true"
    @click="$emit('close')"
  />
  <aside
    class="fixed top-(--spacing-nav-h) bottom-0 left-0 z-40 overflow-y-auto border-r border-white/10 bg-shell p-3.5 transition-[width,transform] duration-200"
    :class="[
      collapsed ? 'w-(--spacing-side-w-collapsed)' : 'w-(--spacing-side-w)',
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    ]"
  >
    <nav class="flex flex-col gap-1">
      <AppSidebarItem
        v-for="(link, i) in links"
        :key="link.to ?? `${link.label}-${i}`"
        :link="link"
        :collapsed="collapsed"
      />

      <template v-if="linksSecundarios.length">
        <div class="my-3 border-t border-white/10" />
        <span
          v-if="!collapsed"
          class="block px-2.5 pb-1.5 text-[11px] tracking-[.08em] text-shell-ink/60 uppercase"
        >
          {{ tituloSecundario }}
        </span>
        <AppSidebarItem
          v-for="(link, i) in linksSecundarios"
          :key="link.to ?? `${link.label}-${i}`"
          :link="link"
          :collapsed="collapsed"
        />
      </template>
    </nav>
  </aside>
</template>
