export type ParticipationIntent = 'attend' | 'network' | 'ask_promo' | 'propose_talk' | 'sponsor'
export type ParticipationStatus = 'planned' | 'done'

export interface Participation {
  id: string
  externalEventId: string
  intent: ParticipationIntent
  ownerContactId?: string
  status: ParticipationStatus
  followUpDueAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
