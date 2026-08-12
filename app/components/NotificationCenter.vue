<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'bell' | 'button'; align?: 'left' | 'right' }>(), {
  variant: 'bell',
  align: 'left',
})

interface NotifItem {
  id: number
  tone: 'success' | 'warning' | 'info'
  title: string
  time: string
  unread: boolean
}

// Local a cada instancia a propósito: el estado de leído/no leído no se comparte
// entre dos NotificationCenter montados a la vez.
const items = ref<NotifItem[]>([
  { id: 1, tone: 'success', title: 'Ticket #4471 resuelto', time: 'Hace 12 min', unread: true },
  { id: 2, tone: 'warning', title: 'Revisión pendiente en Sprint 12', time: 'Hace 1 hora', unread: true },
  { id: 3, tone: 'info', title: 'Mantenimiento programado el sábado', time: 'Ayer', unread: false },
])

const hasUnread = computed(() => items.value.some((i) => i.unread))

const toneIcon = { success: 'check', warning: 'alert', info: 'info' } as const
const toneClasses = {
  success: 'bg-verde/16 text-success-ink',
  warning: 'bg-amarillo/22 text-warning-ink',
  info: 'bg-calipso/16 text-primary-ink',
} as const

function markAllRead() {
  items.value.forEach((i) => (i.unread = false))
}
</script>

<template>
  <AppDropdown :align="align">
    <template #trigger>
      <button
        v-if="variant === 'bell'"
        class="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/14 bg-white/6 text-paper hover:bg-white/14"
        aria-label="Notificaciones"
      >
        <AppIcon name="bell" />
        <span
          v-if="hasUnread"
          class="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-corteza-dark bg-naranja"
        />
      </button>
      <AppButton v-else variant="outline"><AppIcon name="bell" />Ver notificaciones</AppButton>
    </template>

    <template #menu>
      <div class="-m-1.5 w-80">
        <div class="flex items-center justify-between border-b border-line px-4 py-3.5">
          <span class="text-[13.5px] font-bold">Notificaciones</span>
          <button
            class="cursor-pointer border-none bg-transparent p-0 font-body text-[11px] text-calipso"
            @click="markAllRead"
          >
            Marcar todas como leídas
          </button>
        </div>
        <div class="max-h-[280px] overflow-y-auto">
          <div
            v-for="item in items"
            :key="item.id"
            :class="[
              'flex cursor-pointer gap-2.5 border-b border-line px-4 py-3 last:border-b-0 hover:bg-paper-2',
              item.unread ? 'bg-calipso/7' : '',
            ]"
            @click="item.unread = false"
          >
            <span
              :class="[
                'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full',
                toneClasses[item.tone],
              ]"
            >
              <AppIcon :name="toneIcon[item.tone]" :size="15" />
            </span>
            <div>
              <div class="mb-0.5 text-[12.5px] font-semibold text-ink">{{ item.title }}</div>
              <div class="text-[11px] text-ink-soft">{{ item.time }}</div>
            </div>
          </div>
        </div>
        <a
          href="#"
          class="block border-t border-line py-3 text-center text-xs font-semibold text-calipso no-underline"
        >
          Ver todas las notificaciones
        </a>
      </div>
    </template>
  </AppDropdown>
</template>
