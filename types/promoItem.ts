export type PromoItemStatus = 'todo' | 'in_progress' | 'done'

export interface PromoItem {
  id: string
  eventId?: string
  title: string
  channel?: string
  dueAt?: string
  status: PromoItemStatus
  copy?: string
  assetLinks?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}
