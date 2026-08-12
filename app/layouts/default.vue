<script setup lang="ts">
import type { SidebarLink } from '#itsg/types/sidenav'

const sidenavCollapsed = useState('sidenavCollapsed', () => false)
const { theme, toggleTheme } = useTheme()

function toggleSidenav() {
  sidenavCollapsed.value = !sidenavCollapsed.value
}

// Personalizar aquí la navegación del proyecto.
// Los nodos con `children` se despliegan (hasta 3+ niveles); las hojas navegan con `to`.
const links: SidebarLink[] = [
  { label: 'Inicio', to: '/', icon: 'home' },
  {
    label: 'Componentes',
    icon: 'box',
    children: [
      { label: 'Librería completa', to: '/componentes' },
      {
        label: 'Submenú 2',
        children: [{ label: 'Submenú 3 · Perfil', to: '/perfil' }],
      },
    ],
  },
]
</script>

<template>
  <div class="min-h-screen text-ink">
    <IconSprite />
    <AppNavbar
      title="ITSG"
      subtitle="· Mi Proyecto"
      tagline="Plantilla base ITSG DS"
      user-name="Nombre Apellido"
      @toggle-sidenav="toggleSidenav"
    >
      <template #actions>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-(--radius-md) border border-white/15 bg-white/6 text-shell-ink hover:bg-white/15"
          :aria-label="theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          @click="toggleTheme()"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="16" />
        </button>
      </template>
      <template #user-menu>
        <div class="p-2">
          <a
            href="/perfil"
            target="_blank"
            rel="noopener"
            class="flex w-full items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-[13px] text-ink-soft no-underline hover:bg-paper-2 hover:text-ink"
          >
            <AppIcon name="user" />
            <span class="flex-1">Mis datos</span>
            <AppIcon name="external" :size="12" class="opacity-60" />
          </a>
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-[13px] text-ink-soft hover:bg-paper-2 hover:text-danger"
          >
            <AppIcon name="logout" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </template>
    </AppNavbar>
    <AppSidebar :collapsed="sidenavCollapsed" :links="links" />
    <main
      class="pt-(--spacing-nav-h) transition-[margin-left] duration-200"
      :class="sidenavCollapsed ? 'ml-(--spacing-side-w-collapsed)' : 'ml-(--spacing-side-w)'"
    >
      <div class="px-6 py-5">
        <slot />
      </div>
    </main>
    <ToastStack />
    <ConfirmDialog />
  </div>
</template>
