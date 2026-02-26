export type CalendarItemType = 'event' | 'promo' | 'social' | 'logistics' | 'external_event' | 'participation'

export interface CalendarItem {
  id: string
  type: CalendarItemType
  title: string
  startAt: string // ISO
  endAt?: string // ISO
  status?: string
  href: string
  meta?: Record<string, unknown>
}
