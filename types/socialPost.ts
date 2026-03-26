export type SocialPostStatus = 'draft' | 'scheduled' | 'posted'

export interface SocialPost {
  id: string
  eventId?: string | null
  platform?: string
  copy?: string
  scheduledAt?: string
  status: SocialPostStatus
  assetLinks?: string[]
  createdAt: string
  updatedAt: string
}
