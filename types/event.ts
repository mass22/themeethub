export interface Event {
  id: string
  title: string
  slug: string
  date: string // ISO
  location?: string
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
  venueId?: string
}