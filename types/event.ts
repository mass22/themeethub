import type { Venue } from './venue'

export type EventLocationMode = 'in_person' | 'online' | 'hybrid'

export interface EventVideoItem {
  title: string
  youtube_url: string
}

export interface Event {
  id: string
  title: string
  slug: string
  date: string // ISO
  // Mode de participation (remplace l'ancienne valeur texte libre)
  location?: EventLocationMode
  description?: string
  bannerImageUrl?: string | null
  lumaEventId?: string | null
  zoomUrl?: string | null
  replayUrl?: string | null
  stats?: { registered: number; attended: number }
  speakers: string[] // speaker ids
  sponsors: string[] // sponsor ids
  contractors: string[] // contractor ids
  tools: string[] // tool ids
  videos?: EventVideoItem[]
  publishedAt?: string | null
  venueId?: string
  venue?: Venue | null
}