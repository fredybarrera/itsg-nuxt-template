export type CalendarTone = 'primary' | 'success' | 'warning' | 'danger'

export interface CalendarEvent {
  date: Date | string
  label: string
  tone?: CalendarTone
}
