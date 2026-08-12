<script setup lang="ts">
import type { CalendarEvent, CalendarTone } from '#itsg/types/calendar'

/** v-model:month controla el mes visible; sin bind usa estado interno. */
const month = defineModel<Date>('month', { default: () => new Date() })

const props = withDefaults(
  defineProps<{
    events?: CalendarEvent[]
    /** Eventos visibles por día antes de colapsar en "+n más". */
    maxPerDay?: number
  }>(),
  { events: () => [], maxPerDay: 3 }
)

const emit = defineEmits<{
  'select-day': [date: Date, events: CalendarEvent[]]
  'select-event': [event: CalendarEvent]
}>()

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const today = new Date()

const dotClasses: Record<CalendarTone, string> = {
  primary: 'bg-calipso',
  success: 'bg-verde',
  warning: 'bg-amarillo',
  danger: 'bg-rojo-deep',
}

function clave(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const eventsByDay = computed(() => {
  const map = new Map<string, CalendarEvent[]>()
  for (const ev of props.events) {
    const d = ev.date instanceof Date ? ev.date : new Date(ev.date)
    if (Number.isNaN(d.getTime())) continue
    const k = clave(d)
    const lista = map.get(k)
    if (lista) lista.push(ev)
    else map.set(k, [ev])
  }
  return map
})

interface Cell {
  day: number
  muted: boolean
  date: Date
}

function daysInMonth(year: number, m: number) {
  return new Date(year, m + 1, 0).getDate()
}

const cells = computed<Cell[]>(() => {
  const year = month.value.getFullYear()
  const m = month.value.getMonth()
  // getDay(): 0=Dom..6=Sáb — la grilla parte en lunes
  const leadingBlank = (new Date(year, m, 1).getDay() + 6) % 7
  const totalDays = daysInMonth(year, m)
  const prevMonthDays = daysInMonth(year, m - 1 < 0 ? 11 : m - 1)

  const list: Cell[] = []
  for (let i = leadingBlank - 1; i >= 0; i--) {
    list.push({ day: prevMonthDays - i, muted: true, date: new Date(year, m - 1, prevMonthDays - i) })
  }
  for (let d = 1; d <= totalDays; d++) {
    list.push({ day: d, muted: false, date: new Date(year, m, d) })
  }
  let next = 1
  while (list.length % 7 !== 0) {
    list.push({ day: next, muted: true, date: new Date(year, m + 1, next) })
    next++
  }
  return list
})

function eventosDe(d: Date): CalendarEvent[] {
  return eventsByDay.value.get(clave(d)) ?? []
}

function esHoy(d: Date) {
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  )
}

function prevMonth() {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() - 1, 1)
}
function nextMonth() {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + 1, 1)
}
function irHoy() {
  month.value = new Date()
}
</script>

<template>
  <div class="overflow-hidden rounded-(--radius-md) border border-line bg-card">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
      <span class="font-display text-[14.5px] font-bold text-ink">
        {{ monthNames[month.getMonth()] }} {{ month.getFullYear() }}
      </span>
      <div class="flex-1" />
      <AppButton variant="ghost" size="sm" @click="irHoy">Hoy</AppButton>
      <button
        type="button"
        class="flex h-[26px] w-[26px] items-center justify-center rounded-full border-none bg-paper-2 text-ink-soft"
        aria-label="Mes anterior"
        @click="prevMonth"
      >
        <AppIcon name="chevright" :size="13" class="rotate-180" />
      </button>
      <button
        type="button"
        class="flex h-[26px] w-[26px] items-center justify-center rounded-full border-none bg-paper-2 text-ink-soft"
        aria-label="Mes siguiente"
        @click="nextMonth"
      >
        <AppIcon name="chevright" :size="13" />
      </button>
    </div>

    <div class="overflow-x-auto">
      <div class="min-w-[560px]">
        <!-- Weekdays -->
        <div class="grid grid-cols-7 border-b border-line">
          <span
            v-for="w in weekdays"
            :key="w"
            class="px-2 py-1.5 text-center font-mono text-[11px] tracking-wide text-ink-soft uppercase"
            >{{ w }}</span
          >
        </div>

        <!-- Grid de días -->
        <div class="grid grid-cols-7 gap-px bg-(--color-line)">
          <div
            v-for="(cell, i) in cells"
            :key="i"
            class="flex min-h-[84px] cursor-pointer flex-col gap-1 bg-card p-1.5 hover:bg-paper-2"
            :class="cell.muted ? 'opacity-45' : ''"
            @click="emit('select-day', cell.date, eventosDe(cell.date))"
          >
            <span
              class="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11.5px]"
              :class="esHoy(cell.date) ? 'bg-calipso font-bold text-primary-ink' : 'text-ink-soft'"
              >{{ cell.day }}</span
            >

            <button
              v-for="(ev, j) in eventosDe(cell.date).slice(0, maxPerDay)"
              :key="j"
              type="button"
              class="flex w-full items-center gap-1.5 rounded-(--radius-sm) border-none bg-transparent px-1 py-0.5 text-left text-[11.5px] text-ink hover:bg-black/5 dark:hover:bg-white/10"
              :title="ev.label"
              @click.stop="emit('select-event', ev)"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dotClasses[ev.tone ?? 'primary']" />
              <span class="truncate">{{ ev.label }}</span>
            </button>

            <span v-if="eventosDe(cell.date).length > maxPerDay" class="px-1 text-[11px] text-ink-soft"
              >+{{ eventosDe(cell.date).length - maxPerDay }} más</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
