<script setup lang="ts">
const model = defineModel<Date | null>({ default: null })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    /** Muestra el calendario siempre visible, sin popover. */
    inline?: boolean
    min?: Date | null
    max?: Date | null
    invalid?: boolean
  }>(),
  {
    placeholder: 'dd/mm/aaaa',
    disabled: false,
    inline: false,
    min: null,
    max: null,
    invalid: false,
  }
)

const field = useFormField()
const isInvalid = computed(() => props.invalid || Boolean(field?.error.value))

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const viewDate = ref(model.value ? new Date(model.value) : new Date())

const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
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

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

interface Cell {
  day: number
  muted: boolean
  date: Date
}

const cells = computed<Cell[]>(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  // getDay(): 0=Sun..6=Sat — the grid's week starts on Monday.
  const leadingBlank = (firstDay.getDay() + 6) % 7
  const totalDays = daysInMonth(year, month)
  const prevMonthDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1)

  const list: Cell[] = []
  for (let i = leadingBlank - 1; i >= 0; i--) {
    list.push({ day: prevMonthDays - i, muted: true, date: new Date(year, month - 1, prevMonthDays - i) })
  }
  for (let d = 1; d <= totalDays; d++) {
    list.push({ day: d, muted: false, date: new Date(year, month, d) })
  }
  let nextMonthDay = 1
  while (list.length % 7 !== 0 || list.length < 35) {
    list.push({ day: nextMonthDay, muted: true, date: new Date(year, month + 1, nextMonthDay) })
    nextMonthDay++
  }
  return list
})

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function isToday(d: Date) {
  return isSameDay(d, today)
}
function isSelected(d: Date) {
  return model.value ? isSameDay(d, model.value) : false
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}
function isOutOfRange(d: Date) {
  const t = startOfDay(d)
  if (props.min && t < startOfDay(props.min)) return true
  if (props.max && t > startOfDay(props.max)) return true
  return false
}

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}
function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

function select(cell: Cell) {
  if (cell.muted || isOutOfRange(cell.date)) return
  model.value = cell.date
  if (!props.inline) open.value = false
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) viewDate.value = model.value ? new Date(model.value) : new Date()
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

// Listeners globales solo mientras el popover está abierto
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

const formatted = computed(() => formatDate(model.value))
</script>

<template>
  <div ref="root" :class="inline ? 'w-[280px]' : 'relative w-full max-w-[280px]'">
    <div v-if="!inline" class="relative">
      <AppIcon
        name="calendar"
        :size="16"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
      />
      <input
        :id="field?.id"
        class="input cursor-pointer pl-9"
        :placeholder="placeholder"
        :value="formatted"
        :disabled="disabled"
        :aria-invalid="isInvalid || undefined"
        aria-haspopup="dialog"
        :aria-expanded="open"
        readonly
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      />
    </div>

    <div
      v-if="inline || open"
      :class="
        inline
          ? ''
          : 'absolute left-0 top-[calc(100%+6px)] z-40 w-[280px] rounded-(--radius-md) border border-line bg-card p-3.5 shadow-md'
      "
    >
      <div class="flex items-center justify-between mb-3.5">
        <button
          type="button"
          class="w-[26px] h-[26px] rounded-full border-none bg-paper-2 text-ink-soft flex items-center justify-center cursor-pointer"
          aria-label="Mes anterior"
          @click="prevMonth"
        >
          <AppIcon name="chevright" :size="13" class="rotate-180" />
        </button>
        <span class="font-display font-bold text-[13.5px]"
          >{{ monthNames[viewDate.getMonth()] }} {{ viewDate.getFullYear() }}</span
        >
        <button
          type="button"
          class="w-[26px] h-[26px] rounded-full border-none bg-paper-2 text-ink-soft flex items-center justify-center cursor-pointer"
          aria-label="Mes siguiente"
          @click="nextMonth"
        >
          <AppIcon name="chevright" :size="13" />
        </button>
      </div>
      <div class="grid grid-cols-7 text-center text-[10.5px] text-ink-soft mb-1.5 font-mono">
        <span v-for="(w, i) in weekdays" :key="i">{{ w }}</span>
      </div>
      <div class="grid grid-cols-7 gap-0.5">
        <span
          v-for="(cell, i) in cells"
          :key="i"
          :class="[
            'flex items-center justify-center h-[30px] rounded-full text-xs cursor-pointer text-ink hover:bg-paper-2',
            cell.muted ? 'text-ink-soft opacity-40 hover:bg-transparent cursor-default' : '',
            !cell.muted && isOutOfRange(cell.date)
              ? 'text-ink-soft opacity-30 hover:bg-transparent cursor-not-allowed'
              : '',
            isToday(cell.date) && !isSelected(cell.date) ? 'border-[1.5px] border-calipso font-bold' : '',
            isSelected(cell.date) ? 'bg-calipso text-primary-ink font-bold hover:bg-calipso' : '',
          ]"
          @click="select(cell)"
          >{{ cell.day }}</span
        >
      </div>
    </div>
  </div>
</template>
