import events from '../../mocks/events.json'
import speakers from '../../mocks/speakers.json'
import requests from '../../mocks/requests.json'
import sponsors from '../../mocks/sponsors.json'
import contacts from '../../mocks/contacts.json'
import venues from '../../mocks/venues.json'
import contractors from '../../mocks/contractors.json'
import tools from '../../mocks/tools.json'
import promoItems from '../../mocks/promo_items.json'
import logisticsItems from '../../mocks/logistics_items.json'
import socialPosts from '../../mocks/social_posts.json'
import externalCommunities from '../../mocks/external_communities.json'
import externalEvents from '../../mocks/external_events.json'
import participations from '../../mocks/participations.json'
import type { Event, EventVideoItem } from '../../types/event'
import type { Speaker } from '../../types/speaker'
import type { Sponsor } from '../../types/sponsor'
import type { Request, RequestStatus } from '../../types/request'
import type { Contact } from '../../types/contact'
import type { Venue } from '../../types/venue'
import type { Contractor } from '../../types/contractor'
import type { Tool } from '../../types/tool'
import type { PromoItem } from '../../types/promoItem'
import type { LogisticsItem } from '../../types/logisticsItem'
import type { SocialPost } from '../../types/socialPost'
import type { ExternalCommunity } from '../../types/externalCommunity'
import type { ExternalEvent } from '../../types/externalEvent'
import type { Participation } from '../../types/participation'

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

export interface ListRequestsFilters {
  type?: 'sponsor' | 'speaker'
  status?: RequestStatus
}

export interface DataSource {
  useMocks: boolean
  listEvents(): Promise<Event[]>
  getEvent(id: string): Promise<Event | null>
  createEvent(payload: Omit<Event, 'id'>): Promise<Event>
  updateEvent(id: string, payload: Partial<Omit<Event, 'id'>>): Promise<Event | null>
  listSpeakers(): Promise<Speaker[]>
  getSpeaker(id: string): Promise<Speaker | null>
  createSpeaker(payload: Omit<Speaker, 'id' | 'createdAt' | 'updatedAt'>): Promise<Speaker>
  findSpeakerByNameAndRole(name: string, role?: string): Promise<Speaker | null>
  listSponsors(): Promise<Sponsor[]>
  getSponsor(id: string): Promise<Sponsor | null>
  createSponsor(payload: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sponsor>
  findSponsorByCompanyAndEmail(companyName: string, contactEmail: string): Promise<Sponsor | null>
  updateSpeaker(id: string, payload: Partial<Omit<Speaker, 'id'>>): Promise<Speaker | null>
  updateSponsor(id: string, payload: Partial<Omit<Sponsor, 'id'>>): Promise<Sponsor | null>
  listContacts(): Promise<Contact[]>
  getContact(id: string): Promise<Contact | null>
  createContact(payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact>
  updateContact(id: string, payload: Partial<Omit<Contact, 'id'>>): Promise<Contact | null>
  listVenues(): Promise<Venue[]>
  getVenue(id: string): Promise<Venue | null>
  createVenue(payload: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue>
  updateVenue(id: string, payload: Partial<Omit<Venue, 'id'>>): Promise<Venue | null>
  listContractors(): Promise<Contractor[]>
  getContractor(id: string): Promise<Contractor | null>
  createContractor(payload: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contractor>
  updateContractor(id: string, payload: Partial<Omit<Contractor, 'id'>>): Promise<Contractor | null>
  listTools(): Promise<Tool[]>
  getTool(id: string): Promise<Tool | null>
  createTool(payload: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool>
  updateTool(id: string, payload: Partial<Omit<Tool, 'id'>>): Promise<Tool | null>
  listPromoItems(): Promise<PromoItem[]>
  getPromoItem(id: string): Promise<PromoItem | null>
  createPromoItem(payload: Omit<PromoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromoItem>
  updatePromoItem(id: string, payload: Partial<Omit<PromoItem, 'id'>>): Promise<PromoItem | null>
  listLogisticsItems(): Promise<LogisticsItem[]>
  getLogisticsItem(id: string): Promise<LogisticsItem | null>
  createLogisticsItem(payload: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LogisticsItem>
  updateLogisticsItem(id: string, payload: Partial<Omit<LogisticsItem, 'id'>>): Promise<LogisticsItem | null>
  listSocialPosts(): Promise<SocialPost[]>
  getSocialPost(id: string): Promise<SocialPost | null>
  createSocialPost(payload: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost>
  updateSocialPost(id: string, payload: Partial<Omit<SocialPost, 'id'>>): Promise<SocialPost | null>
  listRequests(filters?: ListRequestsFilters): Promise<Request[]>
  getRequest(id: string): Promise<Request | null>
  createRequest(payload: { type: 'sponsor' | 'speaker'; name: string; email: string; companyName?: string; role?: string }): Promise<Request>
  patchRequestStatus(id: string, status: RequestStatus, options?: { exploringCallEmailSentAt?: string }): Promise<Request | null>
  listExternalCommunities(): Promise<ExternalCommunity[]>
  getExternalCommunity(id: string): Promise<ExternalCommunity | null>
  createExternalCommunity(payload: Omit<ExternalCommunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalCommunity>
  updateExternalCommunity(id: string, payload: Partial<Omit<ExternalCommunity, 'id'>>): Promise<ExternalCommunity | null>
  listExternalEvents(): Promise<ExternalEvent[]>
  getExternalEvent(id: string): Promise<ExternalEvent | null>
  createExternalEvent(payload: Omit<ExternalEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalEvent>
  updateExternalEvent(id: string, payload: Partial<Omit<ExternalEvent, 'id'>>): Promise<ExternalEvent | null>
  listParticipations(): Promise<Participation[]>
  getParticipation(id: string): Promise<Participation | null>
  createParticipation(payload: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Participation>
  updateParticipation(id: string, payload: Partial<Omit<Participation, 'id'>>): Promise<Participation | null>
}

function createMockDataSource(): DataSource {
  return {
    useMocks: true,
    async listEvents(): Promise<Event[]> {
      return events as Event[]
    },
    async getEvent(id: string): Promise<Event | null> {
      return (events as Event[]).find((e: Event) => e.id === id) ?? null
    },
    async createEvent(payload: Omit<Event, 'id'>): Promise<Event> {
      const id = randomId('evt')
      const e: Event = {
        id,
        stats: { registered: 0, attended: 0 },
        ...payload,
        bannerImageUrl: payload.bannerImageUrl ?? undefined,
        speakers: payload.speakers || [],
        sponsors: payload.sponsors || [],
        contractors: payload.contractors || [],
        tools: payload.tools || [],
        videos: payload.videos ?? [],
        venueId: payload.venueId
      }
      ;(events as Event[]).push(e)
      return e
    },
    async updateEvent(id: string, payload: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
      const e = (events as Event[]).find((x) => x.id === id)
      if (!e) return null
      if (payload.speakers !== undefined) e.speakers = payload.speakers
      if (payload.sponsors !== undefined) e.sponsors = payload.sponsors
      if (payload.contractors !== undefined) e.contractors = payload.contractors
      if (payload.tools !== undefined) e.tools = payload.tools
      if (payload.venueId !== undefined) e.venueId = payload.venueId
      if (payload.title !== undefined) e.title = payload.title
      if (payload.slug !== undefined) e.slug = payload.slug
      if (payload.date !== undefined) e.date = payload.date
      if (payload.location !== undefined) e.location = payload.location
      if (payload.description !== undefined) e.description = payload.description
      if (payload.stats !== undefined) e.stats = payload.stats
      if (payload.bannerImageUrl !== undefined) e.bannerImageUrl = payload.bannerImageUrl
      if (payload.videos !== undefined) e.videos = payload.videos
      return e
    },
    async listSpeakers(): Promise<Speaker[]> {
      return speakers as Speaker[]
    },
    async getSpeaker(id: string): Promise<Speaker | null> {
      return (speakers as Speaker[]).find((s) => s.id === id) ?? null
    },
    async createSpeaker(payload: Omit<Speaker, 'id' | 'createdAt' | 'updatedAt'>): Promise<Speaker> {
      const id = randomId('spk')
      const now = new Date().toISOString()
      const s: Speaker = { id, ...payload, createdAt: now, updatedAt: now }
      ;(speakers as Speaker[]).push(s)
      return s
    },
    async findSpeakerByNameAndRole(name: string, role?: string): Promise<Speaker | null> {
      return (speakers as Speaker[]).find(
        (s) => s.name === name && (role === undefined || (s.role ?? '') === (role ?? ''))
      ) ?? null
    },
    async listSponsors(): Promise<Sponsor[]> {
      return sponsors as Sponsor[]
    },
    async getSponsor(id: string): Promise<Sponsor | null> {
      return (sponsors as Sponsor[]).find((s: Sponsor) => s.id === id) ?? null
    },
    async createSponsor(payload: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sponsor> {
      const id = randomId('spo')
      const now = new Date().toISOString()
      const s: Sponsor = {
        id,
        companyName: payload.companyName,
        type: payload.type ?? 'financial',
        tier: payload.tier,
        contactId: payload.contactId,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        logoUrl: payload.logoUrl ?? undefined,
        websiteUrl: payload.websiteUrl ?? undefined,
        notes: payload.notes,
        createdAt: now,
        updatedAt: now
      }
      ;(sponsors as Sponsor[]).push(s)
      return s
    },
    async findSponsorByCompanyAndEmail(companyName: string, contactEmail: string): Promise<Sponsor | null> {
      return (sponsors as Sponsor[]).find((s: Sponsor) => s.companyName === companyName && s.contactEmail === contactEmail) ?? null
    },
    async updateSpeaker(id: string, payload: Partial<Omit<Speaker, 'id'>>): Promise<Speaker | null> {
      const s = (speakers as Speaker[]).find((x) => x.id === id)
      if (!s) return null
      Object.assign(s, payload, { updatedAt: new Date().toISOString() })
      return s
    },
    async updateSponsor(id: string, payload: Partial<Omit<Sponsor, 'id'>>): Promise<Sponsor | null> {
      const s = (sponsors as Sponsor[]).find((x: Sponsor) => x.id === id)
      if (!s) return null
      Object.assign(s, payload, { updatedAt: new Date().toISOString() })
      return s
    },
    async listContacts(): Promise<Contact[]> {
      return contacts as Contact[]
    },
    async getContact(id: string): Promise<Contact | null> {
      return (contacts as Contact[]).find((c) => c.id === id) ?? null
    },
    async createContact(payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
      const id = randomId('ctc')
      const now = new Date().toISOString()
      const c: Contact = { id, ...payload, createdAt: now, updatedAt: now }
      ;(contacts as Contact[]).push(c)
      return c
    },
    async updateContact(id: string, payload: Partial<Omit<Contact, 'id'>>): Promise<Contact | null> {
      const c = (contacts as Contact[]).find((x) => x.id === id)
      if (!c) return null
      Object.assign(c, payload, { updatedAt: new Date().toISOString() })
      return c
    },
    async listVenues(): Promise<Venue[]> {
      return venues as Venue[]
    },
    async getVenue(id: string): Promise<Venue | null> {
      return (venues as Venue[]).find((v) => v.id === id) ?? null
    },
    async createVenue(payload: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue> {
      const id = randomId('ven')
      const now = new Date().toISOString()
      const v: Venue = { id, ...payload, createdAt: now, updatedAt: now }
      ;(venues as Venue[]).push(v)
      return v
    },
    async updateVenue(id: string, payload: Partial<Omit<Venue, 'id'>>): Promise<Venue | null> {
      const v = (venues as Venue[]).find((x) => x.id === id)
      if (!v) return null
      Object.assign(v, payload, { updatedAt: new Date().toISOString() })
      return v
    },
    async listContractors(): Promise<Contractor[]> {
      return contractors as Contractor[]
    },
    async getContractor(id: string): Promise<Contractor | null> {
      return (contractors as Contractor[]).find((c) => c.id === id) ?? null
    },
    async createContractor(payload: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contractor> {
      const id = randomId('cns')
      const now = new Date().toISOString()
      const c: Contractor = { id, ...payload, createdAt: now, updatedAt: now }
      ;(contractors as Contractor[]).push(c)
      return c
    },
    async updateContractor(id: string, payload: Partial<Omit<Contractor, 'id'>>): Promise<Contractor | null> {
      const c = (contractors as Contractor[]).find((x) => x.id === id)
      if (!c) return null
      Object.assign(c, payload, { updatedAt: new Date().toISOString() })
      return c
    },
    async listTools(): Promise<Tool[]> {
      return tools as Tool[]
    },
    async getTool(id: string): Promise<Tool | null> {
      return (tools as Tool[]).find((t) => t.id === id) ?? null
    },
    async createTool(payload: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
      const id = randomId('tls')
      const now = new Date().toISOString()
      const t: Tool = { id, ...payload, createdAt: now, updatedAt: now }
      ;(tools as Tool[]).push(t)
      return t
    },
    async updateTool(id: string, payload: Partial<Omit<Tool, 'id'>>): Promise<Tool | null> {
      const t = (tools as Tool[]).find((x) => x.id === id)
      if (!t) return null
      Object.assign(t, payload, { updatedAt: new Date().toISOString() })
      return t
    },
    async listPromoItems(): Promise<PromoItem[]> {
      return promoItems as PromoItem[]
    },
    async getPromoItem(id: string): Promise<PromoItem | null> {
      return (promoItems as PromoItem[]).find((p) => p.id === id) ?? null
    },
    async createPromoItem(payload: Omit<PromoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromoItem> {
      const id = randomId('prm')
      const now = new Date().toISOString()
      const p: PromoItem = { id, ...payload, status: payload.status ?? 'todo', createdAt: now, updatedAt: now }
      ;(promoItems as PromoItem[]).push(p)
      return p
    },
    async updatePromoItem(id: string, payload: Partial<Omit<PromoItem, 'id'>>): Promise<PromoItem | null> {
      const p = (promoItems as PromoItem[]).find((x) => x.id === id)
      if (!p) return null
      Object.assign(p, payload, { updatedAt: new Date().toISOString() })
      return p
    },
    async listLogisticsItems(): Promise<LogisticsItem[]> {
      return logisticsItems as LogisticsItem[]
    },
    async getLogisticsItem(id: string): Promise<LogisticsItem | null> {
      return (logisticsItems as LogisticsItem[]).find((l) => l.id === id) ?? null
    },
    async createLogisticsItem(payload: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LogisticsItem> {
      const id = randomId('lgs')
      const now = new Date().toISOString()
      const l: LogisticsItem = { id, ...payload, status: payload.status ?? 'todo', createdAt: now, updatedAt: now }
      ;(logisticsItems as LogisticsItem[]).push(l)
      return l
    },
    async updateLogisticsItem(id: string, payload: Partial<Omit<LogisticsItem, 'id'>>): Promise<LogisticsItem | null> {
      const l = (logisticsItems as LogisticsItem[]).find((x) => x.id === id)
      if (!l) return null
      Object.assign(l, payload, { updatedAt: new Date().toISOString() })
      return l
    },
    async listSocialPosts(): Promise<SocialPost[]> {
      return socialPosts as SocialPost[]
    },
    async getSocialPost(id: string): Promise<SocialPost | null> {
      return (socialPosts as SocialPost[]).find((s) => s.id === id) ?? null
    },
    async createSocialPost(payload: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
      const id = randomId('soc')
      const now = new Date().toISOString()
      const s: SocialPost = { id, ...payload, status: payload.status ?? 'draft', createdAt: now, updatedAt: now }
      ;(socialPosts as SocialPost[]).push(s)
      return s
    },
    async updateSocialPost(id: string, payload: Partial<Omit<SocialPost, 'id'>>): Promise<SocialPost | null> {
      const s = (socialPosts as SocialPost[]).find((x) => x.id === id)
      if (!s) return null
      Object.assign(s, payload, { updatedAt: new Date().toISOString() })
      return s
    },
    async listRequests(filters?: ListRequestsFilters): Promise<Request[]> {
      let list = requests as Request[]
      if (filters?.type) {
        list = list.filter((r) => r.type === filters.type)
      }
      if (filters?.status) {
        list = list.filter((r) => r.status === filters.status)
      }
      return list
    },
    async getRequest(id: string): Promise<Request | null> {
      return (requests as Request[]).find((r: Request) => r.id === id) ?? null
    },
    async patchRequestStatus(id: string, status: RequestStatus, options?: { exploringCallEmailSentAt?: string }): Promise<Request | null> {
      const r = (requests as Request[]).find((req: Request) => req.id === id)
      if (!r) return null
      r.status = status
      if (options?.exploringCallEmailSentAt !== undefined) {
        r.exploringCallEmailSentAt = options.exploringCallEmailSentAt
      }
      return r
    },
    async createRequest(payload: { type: 'sponsor' | 'speaker'; name: string; email: string; companyName?: string; role?: string }): Promise<Request> {
      const id = randomId('req')
      const r: Request = {
        id,
        name: payload.name,
        email: payload.email,
        type: payload.type,
        companyName: payload.type === 'sponsor' ? (payload.companyName ?? undefined) : undefined,
        role: payload.type === 'speaker' ? (payload.role ?? undefined) : undefined,
        status: 'new',
        createdAt: new Date().toISOString()
      }
      ;(requests as Request[]).push(r)
      return r
    },
    async listExternalCommunities(): Promise<ExternalCommunity[]> {
      return externalCommunities as ExternalCommunity[]
    },
    async getExternalCommunity(id: string): Promise<ExternalCommunity | null> {
      return (externalCommunities as ExternalCommunity[]).find((c) => c.id === id) ?? null
    },
    async createExternalCommunity(payload: Omit<ExternalCommunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalCommunity> {
      const id = randomId('ext')
      const now = new Date().toISOString()
      const c: ExternalCommunity = { id, ...payload, createdAt: now, updatedAt: now }
      ;(externalCommunities as ExternalCommunity[]).push(c)
      return c
    },
    async updateExternalCommunity(id: string, payload: Partial<Omit<ExternalCommunity, 'id'>>): Promise<ExternalCommunity | null> {
      const c = (externalCommunities as ExternalCommunity[]).find((x) => x.id === id)
      if (!c) return null
      Object.assign(c, payload, { updatedAt: new Date().toISOString() })
      return c
    },
    async listExternalEvents(): Promise<ExternalEvent[]> {
      return externalEvents as ExternalEvent[]
    },
    async getExternalEvent(id: string): Promise<ExternalEvent | null> {
      return (externalEvents as ExternalEvent[]).find((e) => e.id === id) ?? null
    },
    async createExternalEvent(payload: Omit<ExternalEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalEvent> {
      const id = randomId('exe')
      const now = new Date().toISOString()
      const e: ExternalEvent = { id, ...payload, createdAt: now, updatedAt: now }
      ;(externalEvents as ExternalEvent[]).push(e)
      return e
    },
    async updateExternalEvent(id: string, payload: Partial<Omit<ExternalEvent, 'id'>>): Promise<ExternalEvent | null> {
      const e = (externalEvents as ExternalEvent[]).find((x) => x.id === id)
      if (!e) return null
      Object.assign(e, payload, { updatedAt: new Date().toISOString() })
      return e
    },
    async listParticipations(): Promise<Participation[]> {
      return participations as Participation[]
    },
    async getParticipation(id: string): Promise<Participation | null> {
      return (participations as Participation[]).find((p) => p.id === id) ?? null
    },
    async createParticipation(payload: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Participation> {
      const id = randomId('par')
      const now = new Date().toISOString()
      const p: Participation = { id, ...payload, status: payload.status ?? 'planned', createdAt: now, updatedAt: now }
      ;(participations as Participation[]).push(p)
      return p
    },
    async updateParticipation(id: string, payload: Partial<Omit<Participation, 'id'>>): Promise<Participation | null> {
      const p = (participations as Participation[]).find((x) => x.id === id)
      if (!p) return null
      Object.assign(p, payload, { updatedAt: new Date().toISOString() })
      return p
    }
  }
}

function createPrismaDataSource(): DataSource {
  const prisma = usePrisma()

  return {
    useMocks: false,
    async listEvents(): Promise<Event[]> {
      const rows = await prisma.event.findMany({ orderBy: { date: 'desc' } })
      return rows.map((row) => {
        const r = row as { sponsorsJson?: string | null; contractorsJson?: string | null; toolsJson?: string | null; venueId?: string | null; bannerImageUrl?: string | null }
        return {
          id: row.id,
          title: row.title,
          slug: row.slug,
          date: row.date.toISOString(),
          location: row.location ?? undefined,
          description: row.description ?? undefined,
          bannerImageUrl: r.bannerImageUrl ?? null,
          lumaEventId: row.lumaEventId ?? null,
          zoomUrl: row.zoomUrl ?? null,
          replayUrl: row.replayUrl ?? null,
          stats: row.statsJson ? (JSON.parse(row.statsJson) as { registered: number; attended: number }) : undefined,
          speakers: (JSON.parse(row.speakersJson || '[]') as string[]),
          sponsors: (JSON.parse(r.sponsorsJson || '[]') as string[]),
          contractors: (JSON.parse(r.contractorsJson || '[]') as string[]),
          tools: (JSON.parse(r.toolsJson || '[]') as string[]),
          videos: JSON.parse((row as { videosJson?: string }).videosJson || '[]') as EventVideoItem[],
          venueId: r.venueId ?? undefined
        }
      })
    },
    async getEvent(id: string): Promise<Event | null> {
      const row = await prisma.event.findUnique({ where: { id } })
      if (!row) return null
      const r = row as { sponsorsJson?: string | null; contractorsJson?: string | null; toolsJson?: string | null; venueId?: string | null; bannerImageUrl?: string | null }
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        date: row.date.toISOString(),
        location: row.location ?? undefined,
        description: row.description ?? undefined,
        bannerImageUrl: r.bannerImageUrl ?? null,
        lumaEventId: row.lumaEventId ?? null,
        zoomUrl: row.zoomUrl ?? null,
        replayUrl: row.replayUrl ?? null,
        stats: row.statsJson ? (JSON.parse(row.statsJson) as { registered: number; attended: number }) : undefined,
        speakers: (JSON.parse(row.speakersJson || '[]') as string[]),
        sponsors: (JSON.parse(r.sponsorsJson || '[]') as string[]),
        contractors: (JSON.parse(r.contractorsJson || '[]') as string[]),
        tools: (JSON.parse(r.toolsJson || '[]') as string[]),
        videos: JSON.parse((row as { videosJson?: string }).videosJson || '[]') as EventVideoItem[],
        venueId: r.venueId ?? undefined
      }
    },
    async createEvent(payload: Omit<Event, 'id'>): Promise<Event> {
      const id = randomId('evt')
      const stats = payload.stats ?? { registered: 0, attended: 0 }
      const row = await prisma.event.create({
        data: {
          id,
          title: payload.title,
          slug: payload.slug,
          date: new Date(payload.date),
          location: payload.location ?? null,
          description: payload.description ?? null,
          bannerImageUrl: payload.bannerImageUrl ?? null,
          lumaEventId: payload.lumaEventId ?? null,
          zoomUrl: payload.zoomUrl ?? null,
          replayUrl: payload.replayUrl ?? null,
          statsJson: JSON.stringify(stats),
          speakersJson: JSON.stringify(payload.speakers || []),
          sponsorsJson: JSON.stringify(payload.sponsors || []),
          contractorsJson: JSON.stringify(payload.contractors || []),
          toolsJson: JSON.stringify(payload.tools || []),
          videosJson: JSON.stringify(payload.videos ?? []),
          venueId: payload.venueId ?? null
        }
      })
      const r = row as { sponsorsJson?: string; contractorsJson?: string; toolsJson?: string; videosJson?: string }
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        date: row.date.toISOString(),
        location: row.location ?? undefined,
        description: row.description ?? undefined,
        bannerImageUrl: (row as { bannerImageUrl?: string | null }).bannerImageUrl ?? null,
        lumaEventId: row.lumaEventId ?? null,
        zoomUrl: row.zoomUrl ?? null,
        replayUrl: row.replayUrl ?? null,
        stats: JSON.parse(row.statsJson || '{}') as { registered: number; attended: number },
        speakers: JSON.parse(row.speakersJson || '[]') as string[],
        sponsors: JSON.parse(r.sponsorsJson || '[]') as string[],
        contractors: JSON.parse(r.contractorsJson || '[]') as string[],
        tools: JSON.parse(r.toolsJson || '[]') as string[],
        videos: JSON.parse(r.videosJson || '[]') as EventVideoItem[],
        venueId: (row as { venueId?: string | null }).venueId ?? undefined
      }
    },
    async updateEvent(id: string, payload: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
      const existing = await prisma.event.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.speakers !== undefined) data.speakersJson = JSON.stringify(payload.speakers)
      if (payload.sponsors !== undefined) data.sponsorsJson = JSON.stringify(payload.sponsors)
      if (payload.contractors !== undefined) data.contractorsJson = JSON.stringify(payload.contractors)
      if (payload.tools !== undefined) data.toolsJson = JSON.stringify(payload.tools)
      if (payload.venueId !== undefined) data.venueId = payload.venueId
      if (payload.title !== undefined) data.title = payload.title
      if (payload.slug !== undefined) data.slug = payload.slug
      if (payload.date !== undefined) data.date = new Date(payload.date)
      if (payload.location !== undefined) data.location = payload.location
      if (payload.description !== undefined) data.description = payload.description
      if (payload.bannerImageUrl !== undefined) data.bannerImageUrl = payload.bannerImageUrl
      if (payload.stats !== undefined) data.statsJson = JSON.stringify(payload.stats)
      if (payload.videos !== undefined) data.videosJson = JSON.stringify(payload.videos)
      if (Object.keys(data).length === 0) return this.getEvent(id)
      const row = await prisma.event.update({ where: { id }, data: data as never })
      return this.getEvent(row.id)
    },
    async listSpeakers(): Promise<Speaker[]> {
      const rows = await prisma.speaker.findMany()
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role ?? undefined,
        bio: row.bio ?? undefined,
        avatar: row.avatar ?? undefined,
        contactId: row.contactId ?? undefined,
        socials: row.socialsJson ? (JSON.parse(row.socialsJson) as Speaker['socials']) : undefined,
        topics: row.topicsJson ? (JSON.parse(row.topicsJson) as string[]) : undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }))
    },
    async getSpeaker(id: string): Promise<Speaker | null> {
      const row = await prisma.speaker.findUnique({ where: { id } })
      if (!row) return null
      return {
        id: row.id,
        name: row.name,
        role: row.role ?? undefined,
        bio: row.bio ?? undefined,
        avatar: row.avatar ?? undefined,
        contactId: row.contactId ?? undefined,
        socials: row.socialsJson ? (JSON.parse(row.socialsJson) as Speaker['socials']) : undefined,
        topics: row.topicsJson ? (JSON.parse(row.topicsJson) as string[]) : undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }
    },
    async createSpeaker(payload: Omit<Speaker, 'id' | 'createdAt' | 'updatedAt'>): Promise<Speaker> {
      const id = randomId('spk')
      const row = await prisma.speaker.create({
        data: {
          id,
          name: payload.name,
          role: payload.role ?? null,
          bio: payload.bio ?? null,
          avatar: payload.avatar ?? null,
          contactId: payload.contactId ?? null,
          socialsJson: payload.socials ? JSON.stringify(payload.socials) : null,
          topicsJson: payload.topics ? JSON.stringify(payload.topics) : null
        }
      })
      return {
        id: row.id,
        name: row.name,
        role: row.role ?? undefined,
        bio: row.bio ?? undefined,
        avatar: row.avatar ?? undefined,
        contactId: row.contactId ?? undefined,
        socials: row.socialsJson ? (JSON.parse(row.socialsJson) as Speaker['socials']) : undefined,
        topics: row.topicsJson ? (JSON.parse(row.topicsJson) as string[]) : undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }
    },
    async findSpeakerByNameAndRole(name: string, role?: string): Promise<Speaker | null> {
      const rows = await prisma.speaker.findMany({ where: { name } })
      const match = rows.find((r) => (r.role ?? '') === (role ?? ''))
      if (!match) return null
      return {
        id: match.id,
        name: match.name,
        role: match.role ?? undefined,
        bio: match.bio ?? undefined,
        avatar: match.avatar ?? undefined,
        contactId: match.contactId ?? undefined,
        socials: match.socialsJson ? (JSON.parse(match.socialsJson) as Speaker['socials']) : undefined,
        topics: match.topicsJson ? (JSON.parse(match.topicsJson) as string[]) : undefined,
        createdAt: match.createdAt.toISOString(),
        updatedAt: match.updatedAt.toISOString()
      }
    },
    async listSponsors(): Promise<Sponsor[]> {
      const rows = await prisma.sponsor.findMany()
      return rows.map((r) => ({
        id: r.id,
        companyName: r.companyName,
        type: r.type,
        tier: r.tier ?? undefined,
        contactId: r.contactId ?? undefined,
        contactName: r.contactName ?? undefined,
        contactEmail: r.contactEmail ?? undefined,
        logoUrl: r.logoUrl ?? null,
        websiteUrl: r.websiteUrl ?? null,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getSponsor(id: string): Promise<Sponsor | null> {
      const r = await prisma.sponsor.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        companyName: r.companyName,
        type: r.type,
        tier: r.tier ?? undefined,
        contactId: r.contactId ?? undefined,
        contactName: r.contactName ?? undefined,
        contactEmail: r.contactEmail ?? undefined,
        logoUrl: r.logoUrl ?? null,
        websiteUrl: r.websiteUrl ?? null,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createSponsor(payload: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sponsor> {
      const id = randomId('spo')
      const r = await prisma.sponsor.create({
        data: {
          id,
          companyName: payload.companyName,
          type: payload.type ?? 'financial',
          tier: payload.tier ?? null,
          contactId: payload.contactId ?? null,
          contactName: payload.contactName ?? null,
          contactEmail: payload.contactEmail ?? null,
          logoUrl: payload.logoUrl ?? null,
          websiteUrl: payload.websiteUrl ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        companyName: r.companyName,
        type: r.type,
        tier: r.tier ?? undefined,
        contactId: r.contactId ?? undefined,
        contactName: r.contactName ?? undefined,
        contactEmail: r.contactEmail ?? undefined,
        logoUrl: r.logoUrl ?? null,
        websiteUrl: r.websiteUrl ?? null,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async findSponsorByCompanyAndEmail(companyName: string, contactEmail: string): Promise<Sponsor | null> {
      const r = await prisma.sponsor.findFirst({
        where: { companyName, contactEmail }
      })
      if (!r) return null
      return {
        id: r.id,
        companyName: r.companyName,
        type: r.type,
        tier: r.tier ?? undefined,
        contactId: r.contactId ?? undefined,
        contactName: r.contactName ?? undefined,
        contactEmail: r.contactEmail ?? undefined,
        logoUrl: r.logoUrl ?? null,
        websiteUrl: r.websiteUrl ?? null,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateSpeaker(id: string, payload: Partial<Omit<Speaker, 'id'>>): Promise<Speaker | null> {
      const existing = await prisma.speaker.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.role !== undefined) data.role = payload.role ?? null
      if (payload.bio !== undefined) data.bio = payload.bio ?? null
      if (payload.avatar !== undefined) data.avatar = payload.avatar ?? null
      if (payload.contactId !== undefined) data.contactId = payload.contactId ?? null
      if (payload.socials !== undefined) data.socialsJson = payload.socials ? JSON.stringify(payload.socials) : null
      if (payload.topics !== undefined) data.topicsJson = payload.topics ? JSON.stringify(payload.topics) : null
      const row = await prisma.speaker.update({
        where: { id },
        data
      })
      return {
        id: row.id,
        name: row.name,
        role: row.role ?? undefined,
        bio: row.bio ?? undefined,
        avatar: row.avatar ?? undefined,
        socials: row.socialsJson ? (JSON.parse(row.socialsJson) as Speaker['socials']) : undefined,
        topics: row.topicsJson ? (JSON.parse(row.topicsJson) as string[]) : undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }
    },
    async updateSponsor(id: string, payload: Partial<Omit<Sponsor, 'id'>>): Promise<Sponsor | null> {
      const existing = await prisma.sponsor.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.companyName !== undefined) data.companyName = payload.companyName
      if (payload.type !== undefined) data.type = payload.type
      if (payload.tier !== undefined) data.tier = payload.tier ?? null
      if (payload.contactId !== undefined) data.contactId = payload.contactId ?? null
      if (payload.contactName !== undefined) data.contactName = payload.contactName ?? null
      if (payload.contactEmail !== undefined) data.contactEmail = payload.contactEmail ?? null
      if (payload.logoUrl !== undefined) data.logoUrl = payload.logoUrl ?? null
      if (payload.websiteUrl !== undefined) data.websiteUrl = payload.websiteUrl ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getSponsor(id)
      await prisma.sponsor.update({ where: { id }, data: data as never })
      return this.getSponsor(id)
    },
    async listContacts(): Promise<Contact[]> {
      const rows = await prisma.contact.findMany()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone ?? undefined,
        tags: r.tagsJson ? (JSON.parse(r.tagsJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getContact(id: string): Promise<Contact | null> {
      const r = await prisma.contact.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone ?? undefined,
        tags: r.tagsJson ? (JSON.parse(r.tagsJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createContact(payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
      const id = randomId('ctc')
      const r = await prisma.contact.create({
        data: {
          id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone ?? null,
          tagsJson: payload.tags ? JSON.stringify(payload.tags) : null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone ?? undefined,
        tags: r.tagsJson ? (JSON.parse(r.tagsJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateContact(id: string, payload: Partial<Omit<Contact, 'id'>>): Promise<Contact | null> {
      const existing = await prisma.contact.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.email !== undefined) data.email = payload.email
      if (payload.phone !== undefined) data.phone = payload.phone ?? null
      if (payload.tags !== undefined) data.tagsJson = payload.tags ? JSON.stringify(payload.tags) : null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getContact(id)
      await prisma.contact.update({ where: { id }, data: data as never })
      return this.getContact(id)
    },
    async listVenues(): Promise<Venue[]> {
      const rows = await prisma.venue.findMany()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        address: r.address ?? undefined,
        capacity: r.capacity ?? undefined,
        contactId: r.contactId ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getVenue(id: string): Promise<Venue | null> {
      const r = await prisma.venue.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        name: r.name,
        address: r.address ?? undefined,
        capacity: r.capacity ?? undefined,
        contactId: r.contactId ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createVenue(payload: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue> {
      const id = randomId('ven')
      const r = await prisma.venue.create({
        data: {
          id,
          name: payload.name,
          address: payload.address ?? null,
          capacity: payload.capacity ?? null,
          contactId: payload.contactId ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        name: r.name,
        address: r.address ?? undefined,
        capacity: r.capacity ?? undefined,
        contactId: r.contactId ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateVenue(id: string, payload: Partial<Omit<Venue, 'id'>>): Promise<Venue | null> {
      const existing = await prisma.venue.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.address !== undefined) data.address = payload.address ?? null
      if (payload.capacity !== undefined) data.capacity = payload.capacity ?? null
      if (payload.contactId !== undefined) data.contactId = payload.contactId ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getVenue(id)
      await prisma.venue.update({ where: { id }, data: data as never })
      return this.getVenue(id)
    },
    async listContractors(): Promise<Contractor[]> {
      const rows = await prisma.contractor.findMany()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role ?? undefined,
        contactId: r.contactId ?? undefined,
        rate: r.rate ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getContractor(id: string): Promise<Contractor | null> {
      const r = await prisma.contractor.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        name: r.name,
        role: r.role ?? undefined,
        contactId: r.contactId ?? undefined,
        rate: r.rate ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createContractor(payload: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contractor> {
      const id = randomId('cns')
      const r = await prisma.contractor.create({
        data: {
          id,
          name: payload.name,
          role: payload.role ?? null,
          contactId: payload.contactId ?? null,
          rate: payload.rate ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        name: r.name,
        role: r.role ?? undefined,
        contactId: r.contactId ?? undefined,
        rate: r.rate ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateContractor(id: string, payload: Partial<Omit<Contractor, 'id'>>): Promise<Contractor | null> {
      const existing = await prisma.contractor.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.role !== undefined) data.role = payload.role ?? null
      if (payload.contactId !== undefined) data.contactId = payload.contactId ?? null
      if (payload.rate !== undefined) data.rate = payload.rate ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getContractor(id)
      await prisma.contractor.update({ where: { id }, data: data as never })
      return this.getContractor(id)
    },
    async listTools(): Promise<Tool[]> {
      const rows = await prisma.tool.findMany()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getTool(id: string): Promise<Tool | null> {
      const r = await prisma.tool.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        name: r.name,
        type: r.type ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createTool(payload: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
      const id = randomId('tls')
      const r = await prisma.tool.create({
        data: {
          id,
          name: payload.name,
          type: payload.type ?? null,
          url: payload.url ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        name: r.name,
        type: r.type ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateTool(id: string, payload: Partial<Omit<Tool, 'id'>>): Promise<Tool | null> {
      const existing = await prisma.tool.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.type !== undefined) data.type = payload.type ?? null
      if (payload.url !== undefined) data.url = payload.url ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getTool(id)
      await prisma.tool.update({ where: { id }, data: data as never })
      return this.getTool(id)
    },
    async listPromoItems(): Promise<PromoItem[]> {
      const rows = await prisma.promoItem.findMany()
      return rows.map((r) => ({
        id: r.id,
        eventId: r.eventId ?? undefined,
        title: r.title,
        channel: r.channel ?? undefined,
        dueAt: r.dueAt?.toISOString() ?? undefined,
        status: r.status as PromoItem['status'],
        copy: r.copy ?? undefined,
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getPromoItem(id: string): Promise<PromoItem | null> {
      const r = await prisma.promoItem.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        eventId: r.eventId ?? undefined,
        title: r.title,
        channel: r.channel ?? undefined,
        dueAt: r.dueAt?.toISOString() ?? undefined,
        status: r.status as PromoItem['status'],
        copy: r.copy ?? undefined,
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createPromoItem(payload: Omit<PromoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromoItem> {
      const id = randomId('prm')
      const r = await prisma.promoItem.create({
        data: {
          id,
          eventId: payload.eventId ?? null,
          title: payload.title,
          channel: payload.channel ?? null,
          dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
          status: payload.status ?? 'todo',
          copy: payload.copy ?? null,
          assetLinksJson: payload.assetLinks ? JSON.stringify(payload.assetLinks) : null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        eventId: r.eventId ?? undefined,
        title: r.title,
        channel: r.channel ?? undefined,
        dueAt: r.dueAt?.toISOString() ?? undefined,
        status: r.status as PromoItem['status'],
        copy: r.copy ?? undefined,
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updatePromoItem(id: string, payload: Partial<Omit<PromoItem, 'id'>>): Promise<PromoItem | null> {
      const existing = await prisma.promoItem.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.eventId !== undefined) data.eventId = payload.eventId ?? null
      if (payload.title !== undefined) data.title = payload.title
      if (payload.channel !== undefined) data.channel = payload.channel ?? null
      if (payload.dueAt !== undefined) data.dueAt = payload.dueAt ? new Date(payload.dueAt) : null
      if (payload.status !== undefined) data.status = payload.status
      if (payload.copy !== undefined) data.copy = payload.copy ?? null
      if (payload.assetLinks !== undefined) data.assetLinksJson = payload.assetLinks ? JSON.stringify(payload.assetLinks) : null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getPromoItem(id)
      await prisma.promoItem.update({ where: { id }, data: data as never })
      return this.getPromoItem(id)
    },
    async listLogisticsItems(): Promise<LogisticsItem[]> {
      const rows = await prisma.logisticsItem.findMany()
      return rows.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        name: r.name,
        category: r.category ?? undefined,
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as LogisticsItem['status'],
        dueAt: r.dueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getLogisticsItem(id: string): Promise<LogisticsItem | null> {
      const r = await prisma.logisticsItem.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        eventId: r.eventId,
        name: r.name,
        category: r.category ?? undefined,
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as LogisticsItem['status'],
        dueAt: r.dueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createLogisticsItem(payload: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LogisticsItem> {
      const id = randomId('lgs')
      const r = await prisma.logisticsItem.create({
        data: {
          id,
          eventId: payload.eventId,
          name: payload.name,
          category: payload.category ?? null,
          ownerContactId: payload.ownerContactId ?? null,
          status: payload.status ?? 'todo',
          dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        eventId: r.eventId,
        name: r.name,
        category: r.category ?? undefined,
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as LogisticsItem['status'],
        dueAt: r.dueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateLogisticsItem(id: string, payload: Partial<Omit<LogisticsItem, 'id'>>): Promise<LogisticsItem | null> {
      const existing = await prisma.logisticsItem.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.eventId !== undefined) data.eventId = payload.eventId
      if (payload.name !== undefined) data.name = payload.name
      if (payload.category !== undefined) data.category = payload.category ?? null
      if (payload.ownerContactId !== undefined) data.ownerContactId = payload.ownerContactId ?? null
      if (payload.status !== undefined) data.status = payload.status
      if (payload.dueAt !== undefined) data.dueAt = payload.dueAt ? new Date(payload.dueAt) : null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getLogisticsItem(id)
      await prisma.logisticsItem.update({ where: { id }, data: data as never })
      return this.getLogisticsItem(id)
    },
    async listSocialPosts(): Promise<SocialPost[]> {
      const rows = await prisma.socialPost.findMany()
      return rows.map((r) => ({
        id: r.id,
        eventId: r.eventId ?? undefined,
        platform: r.platform ?? undefined,
        copy: r.copy ?? undefined,
        scheduledAt: r.scheduledAt?.toISOString() ?? undefined,
        status: r.status as SocialPost['status'],
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getSocialPost(id: string): Promise<SocialPost | null> {
      const r = await prisma.socialPost.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        eventId: r.eventId ?? undefined,
        platform: r.platform ?? undefined,
        copy: r.copy ?? undefined,
        scheduledAt: r.scheduledAt?.toISOString() ?? undefined,
        status: r.status as SocialPost['status'],
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createSocialPost(payload: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
      const id = randomId('soc')
      const r = await prisma.socialPost.create({
        data: {
          id,
          eventId: payload.eventId ?? null,
          platform: payload.platform ?? null,
          copy: payload.copy ?? null,
          scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
          status: payload.status ?? 'draft',
          assetLinksJson: payload.assetLinks ? JSON.stringify(payload.assetLinks) : null
        }
      })
      return {
        id: r.id,
        eventId: r.eventId ?? undefined,
        platform: r.platform ?? undefined,
        copy: r.copy ?? undefined,
        scheduledAt: r.scheduledAt?.toISOString() ?? undefined,
        status: r.status as SocialPost['status'],
        assetLinks: r.assetLinksJson ? (JSON.parse(r.assetLinksJson) as string[]) : undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateSocialPost(id: string, payload: Partial<Omit<SocialPost, 'id'>>): Promise<SocialPost | null> {
      const existing = await prisma.socialPost.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.eventId !== undefined) data.eventId = payload.eventId ?? null
      if (payload.platform !== undefined) data.platform = payload.platform ?? null
      if (payload.copy !== undefined) data.copy = payload.copy ?? null
      if (payload.scheduledAt !== undefined) data.scheduledAt = payload.scheduledAt ? new Date(payload.scheduledAt) : null
      if (payload.status !== undefined) data.status = payload.status
      if (payload.assetLinks !== undefined) data.assetLinksJson = payload.assetLinks ? JSON.stringify(payload.assetLinks) : null
      if (Object.keys(data).length === 0) return this.getSocialPost(id)
      await prisma.socialPost.update({ where: { id }, data: data as never })
      return this.getSocialPost(id)
    },
    async listExternalCommunities(): Promise<ExternalCommunity[]> {
      const rows = await prisma.externalCommunity.findMany()
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getExternalCommunity(id: string): Promise<ExternalCommunity | null> {
      const r = await prisma.externalCommunity.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        name: r.name,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createExternalCommunity(payload: Omit<ExternalCommunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalCommunity> {
      const id = randomId('ext')
      const r = await prisma.externalCommunity.create({
        data: {
          id,
          name: payload.name,
          url: payload.url ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        name: r.name,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateExternalCommunity(id: string, payload: Partial<Omit<ExternalCommunity, 'id'>>): Promise<ExternalCommunity | null> {
      const existing = await prisma.externalCommunity.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.name !== undefined) data.name = payload.name
      if (payload.url !== undefined) data.url = payload.url ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getExternalCommunity(id)
      await prisma.externalCommunity.update({ where: { id }, data: data as never })
      return this.getExternalCommunity(id)
    },
    async listExternalEvents(): Promise<ExternalEvent[]> {
      const rows = await prisma.externalEvent.findMany()
      return rows.map((r) => ({
        id: r.id,
        communityId: r.communityId,
        title: r.title,
        startAt: r.startAt.toISOString(),
        location: r.location ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getExternalEvent(id: string): Promise<ExternalEvent | null> {
      const r = await prisma.externalEvent.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        communityId: r.communityId,
        title: r.title,
        startAt: r.startAt.toISOString(),
        location: r.location ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createExternalEvent(payload: Omit<ExternalEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalEvent> {
      const id = randomId('exe')
      const r = await prisma.externalEvent.create({
        data: {
          id,
          communityId: payload.communityId,
          title: payload.title,
          startAt: new Date(payload.startAt),
          location: payload.location ?? null,
          url: payload.url ?? null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        communityId: r.communityId,
        title: r.title,
        startAt: r.startAt.toISOString(),
        location: r.location ?? undefined,
        url: r.url ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateExternalEvent(id: string, payload: Partial<Omit<ExternalEvent, 'id'>>): Promise<ExternalEvent | null> {
      const existing = await prisma.externalEvent.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.communityId !== undefined) data.communityId = payload.communityId
      if (payload.title !== undefined) data.title = payload.title
      if (payload.startAt !== undefined) data.startAt = new Date(payload.startAt)
      if (payload.location !== undefined) data.location = payload.location ?? null
      if (payload.url !== undefined) data.url = payload.url ?? null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getExternalEvent(id)
      await prisma.externalEvent.update({ where: { id }, data: data as never })
      return this.getExternalEvent(id)
    },
    async listParticipations(): Promise<Participation[]> {
      const rows = await prisma.participation.findMany()
      return rows.map((r) => ({
        id: r.id,
        externalEventId: r.externalEventId,
        intent: r.intent as Participation['intent'],
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as Participation['status'],
        followUpDueAt: r.followUpDueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))
    },
    async getParticipation(id: string): Promise<Participation | null> {
      const r = await prisma.participation.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        externalEventId: r.externalEventId,
        intent: r.intent as Participation['intent'],
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as Participation['status'],
        followUpDueAt: r.followUpDueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async createParticipation(payload: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Participation> {
      const id = randomId('par')
      const r = await prisma.participation.create({
        data: {
          id,
          externalEventId: payload.externalEventId,
          intent: payload.intent,
          ownerContactId: payload.ownerContactId ?? null,
          status: payload.status ?? 'planned',
          followUpDueAt: payload.followUpDueAt ? new Date(payload.followUpDueAt) : null,
          notes: payload.notes ?? null
        }
      })
      return {
        id: r.id,
        externalEventId: r.externalEventId,
        intent: r.intent as Participation['intent'],
        ownerContactId: r.ownerContactId ?? undefined,
        status: r.status as Participation['status'],
        followUpDueAt: r.followUpDueAt?.toISOString() ?? undefined,
        notes: r.notes ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }
    },
    async updateParticipation(id: string, payload: Partial<Omit<Participation, 'id'>>): Promise<Participation | null> {
      const existing = await prisma.participation.findUnique({ where: { id } })
      if (!existing) return null
      const data: Record<string, unknown> = {}
      if (payload.externalEventId !== undefined) data.externalEventId = payload.externalEventId
      if (payload.intent !== undefined) data.intent = payload.intent
      if (payload.ownerContactId !== undefined) data.ownerContactId = payload.ownerContactId ?? null
      if (payload.status !== undefined) data.status = payload.status
      if (payload.followUpDueAt !== undefined) data.followUpDueAt = payload.followUpDueAt ? new Date(payload.followUpDueAt) : null
      if (payload.notes !== undefined) data.notes = payload.notes ?? null
      if (Object.keys(data).length === 0) return this.getParticipation(id)
      await prisma.participation.update({ where: { id }, data: data as never })
      return this.getParticipation(id)
    },
    async listRequests(filters?: ListRequestsFilters): Promise<Request[]> {
      const where: { type?: string; status?: string } = {}
      if (filters?.type) where.type = filters.type
      if (filters?.status) where.status = filters.status
      const rows = await prisma.request.findMany({
        where: Object.keys(where).length ? where : undefined,
        orderBy: { createdAt: 'desc' }
      })
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        type: row.type as Request['type'],
        companyName: row.companyName ?? undefined,
        role: row.role ?? undefined,
        status: row.status as RequestStatus,
        createdAt: row.createdAt.toISOString(),
        exploringCallEmailSentAt: row.exploringCallEmailSentAt?.toISOString() ?? null
      }))
    },
    async getRequest(id: string): Promise<Request | null> {
      const row = await prisma.request.findUnique({ where: { id } })
      if (!row) return null
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        type: row.type as Request['type'],
        companyName: row.companyName ?? undefined,
        role: row.role ?? undefined,
        status: row.status as RequestStatus,
        createdAt: row.createdAt.toISOString(),
        exploringCallEmailSentAt: row.exploringCallEmailSentAt?.toISOString() ?? null
      }
    },
    async createRequest(payload: { type: 'sponsor' | 'speaker'; name: string; email: string; companyName?: string; role?: string }): Promise<Request> {
      const id = randomId('req')
      const row = await prisma.request.create({
        data: {
          id,
          name: payload.name,
          email: payload.email,
          type: payload.type,
          companyName: payload.type === 'sponsor' ? (payload.companyName ?? null) : null,
          role: payload.type === 'speaker' ? (payload.role ?? null) : null,
          status: 'new'
        }
      })
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        type: row.type as Request['type'],
        companyName: row.companyName ?? undefined,
        role: row.role ?? undefined,
        status: row.status as RequestStatus,
        createdAt: row.createdAt.toISOString(),
        exploringCallEmailSentAt: row.exploringCallEmailSentAt?.toISOString() ?? null
      }
    },
    async patchRequestStatus(id: string, status: RequestStatus, options?: { exploringCallEmailSentAt?: string }): Promise<Request | null> {
      const update: { status: string; exploringCallEmailSentAt?: Date } = { status }
      if (options?.exploringCallEmailSentAt !== undefined) {
        update.exploringCallEmailSentAt = new Date(options.exploringCallEmailSentAt)
      }
      try {
        const row = await prisma.request.update({
          where: { id },
          data: update
        })
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          type: row.type as Request['type'],
          companyName: row.companyName ?? undefined,
          role: row.role ?? undefined,
          status: row.status as RequestStatus,
          createdAt: row.createdAt.toISOString(),
          exploringCallEmailSentAt: row.exploringCallEmailSentAt?.toISOString() ?? null
        }
      } catch {
        return null
      }
    }
  }
}

export function useDataSource(): DataSource {
  const config = useRuntimeConfig()
  const useMocks = process.env.NUXT_USE_MOCKS === 'true' || config.useMocks

  if (useMocks) {
    return createMockDataSource()
  }
  return createPrismaDataSource()
}
