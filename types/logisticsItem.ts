export type LogisticsItemStatus = 'todo' | 'ready' | 'done'

export interface LogisticsItem {
  id: string
  eventId: string
  name: string
  category?: string
  ownerContactId?: string
  status: LogisticsItemStatus
  dueAt?: string // ISO, optional
  notes?: string
  createdAt: string
  updatedAt: string
}
