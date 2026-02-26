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
import type { Event } from '../../types/event'
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
        speakers: payload.speakers || []
      }
      ;(events as Event[]).push(e)
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
        tier: payload.tier,
        contactId: payload.contactId,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
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
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        date: row.date.toISOString(),
        location: row.location ?? undefined,
        description: row.description ?? undefined,
        lumaEventId: row.lumaEventId ?? null,
        zoomUrl: row.zoomUrl ?? null,
        replayUrl: row.replayUrl ?? null,
        stats: row.statsJson ? (JSON.parse(row.statsJson) as { registered: number; attended: number }) : undefined,
        speakers: (JSON.parse(row.speakersJson || '[]') as string[])
      }))
    },
    async getEvent(id: string): Promise<Event | null> {
      const row = await prisma.event.findUnique({ where: { id } })
      if (!row) return null
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        date: row.date.toISOString(),
        location: row.location ?? undefined,
        description: row.description ?? undefined,
        lumaEventId: row.lumaEventId ?? null,
        zoomUrl: row.zoomUrl ?? null,
        replayUrl: row.replayUrl ?? null,
        stats: row.statsJson ? (JSON.parse(row.statsJson) as { registered: number; attended: number }) : undefined,
        speakers: (JSON.parse(row.speakersJson || '[]') as string[])
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
          lumaEventId: payload.lumaEventId ?? null,
          zoomUrl: payload.zoomUrl ?? null,
          replayUrl: payload.replayUrl ?? null,
          statsJson: JSON.stringify(stats),
          speakersJson: JSON.stringify(payload.speakers || [])
        }
      })
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        date: row.date.toISOString(),
        location: row.location ?? undefined,
        description: row.description ?? undefined,
        lumaEventId: row.lumaEventId ?? null,
        zoomUrl: row.zoomUrl ?? null,
        replayUrl: row.replayUrl ?? null,
        stats: JSON.parse(row.statsJson || '{}') as { registered: number; attended: number },
        speakers: JSON.parse(row.speakersJson || '[]') as string[]
      }
    },
    async listSpeakers(): Promise<Speaker[]> {
      const rows = await prisma.speaker.findMany()
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role ?? undefined,
        bio: row.bio ?? undefined,
        avatar: row.avatar ?? undefined,
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
        socials: match.socialsJson ? (JSON.parse(match.socialsJson) as Speaker['socials']) : undefined,
        topics: match.topicsJson ? (JSON.parse(match.topicsJson) as string[]) : undefined,
        createdAt: match.createdAt.toISOString(),
        updatedAt: match.updatedAt.toISOString()
      }
    },
    async listSponsors(): Promise<Sponsor[]> {
      return []
    },
    async getSponsor(_id: string): Promise<Sponsor | null> {
      return null
    },
    async createSponsor(_payload: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sponsor> {
      throw new Error('Sponsors DB not implemented yet')
    },
    async findSponsorByCompanyAndEmail(_companyName: string, _contactEmail: string): Promise<Sponsor | null> {
      return null
    },
    async updateSpeaker(_id: string, _payload: Partial<Omit<Speaker, 'id'>>): Promise<Speaker | null> {
      throw new Error('Speaker update DB not implemented yet')
    },
    async updateSponsor(_id: string, _payload: Partial<Omit<Sponsor, 'id'>>): Promise<Sponsor | null> {
      throw new Error('Sponsor update DB not implemented yet')
    },
    async listContacts(): Promise<Contact[]> { return [] },
    async getContact(_id: string): Promise<Contact | null> { return null },
    async createContact(_p: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> { throw new Error('Contacts DB not implemented yet') },
    async updateContact(_id: string, _p: Partial<Omit<Contact, 'id'>>): Promise<Contact | null> { throw new Error('Contacts DB not implemented yet') },
    async listVenues(): Promise<Venue[]> { return [] },
    async getVenue(_id: string): Promise<Venue | null> { return null },
    async createVenue(_p: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue> { throw new Error('Venues DB not implemented yet') },
    async updateVenue(_id: string, _p: Partial<Omit<Venue, 'id'>>): Promise<Venue | null> { throw new Error('Venues DB not implemented yet') },
    async listContractors(): Promise<Contractor[]> { return [] },
    async getContractor(_id: string): Promise<Contractor | null> { return null },
    async createContractor(_p: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contractor> { throw new Error('Contractors DB not implemented yet') },
    async updateContractor(_id: string, _p: Partial<Omit<Contractor, 'id'>>): Promise<Contractor | null> { throw new Error('Contractors DB not implemented yet') },
    async listTools(): Promise<Tool[]> { return [] },
    async getTool(_id: string): Promise<Tool | null> { return null },
    async createTool(_p: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> { throw new Error('Tools DB not implemented yet') },
    async updateTool(_id: string, _p: Partial<Omit<Tool, 'id'>>): Promise<Tool | null> { throw new Error('Tools DB not implemented yet') },
    async listPromoItems(): Promise<PromoItem[]> { return [] },
    async getPromoItem(_id: string): Promise<PromoItem | null> { return null },
    async createPromoItem(_p: Omit<PromoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromoItem> { throw new Error('PromoItems DB not implemented yet') },
    async updatePromoItem(_id: string, _p: Partial<Omit<PromoItem, 'id'>>): Promise<PromoItem | null> { throw new Error('PromoItems DB not implemented yet') },
    async listLogisticsItems(): Promise<LogisticsItem[]> { return [] },
    async getLogisticsItem(_id: string): Promise<LogisticsItem | null> { return null },
    async createLogisticsItem(_p: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LogisticsItem> { throw new Error('LogisticsItems DB not implemented yet') },
    async updateLogisticsItem(_id: string, _p: Partial<Omit<LogisticsItem, 'id'>>): Promise<LogisticsItem | null> { throw new Error('LogisticsItems DB not implemented yet') },
    async listSocialPosts(): Promise<SocialPost[]> { return [] },
    async getSocialPost(_id: string): Promise<SocialPost | null> { return null },
    async createSocialPost(_p: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> { throw new Error('SocialPosts DB not implemented yet') },
    async updateSocialPost(_id: string, _p: Partial<Omit<SocialPost, 'id'>>): Promise<SocialPost | null> { throw new Error('SocialPosts DB not implemented yet') },
    async listExternalCommunities(): Promise<ExternalCommunity[]> { return [] },
    async getExternalCommunity(_id: string): Promise<ExternalCommunity | null> { return null },
    async createExternalCommunity(_p: Omit<ExternalCommunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalCommunity> { throw new Error('ExternalCommunities DB not implemented yet') },
    async updateExternalCommunity(_id: string, _p: Partial<Omit<ExternalCommunity, 'id'>>): Promise<ExternalCommunity | null> { throw new Error('ExternalCommunities DB not implemented yet') },
    async listExternalEvents(): Promise<ExternalEvent[]> { return [] },
    async getExternalEvent(_id: string): Promise<ExternalEvent | null> { return null },
    async createExternalEvent(_p: Omit<ExternalEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalEvent> { throw new Error('ExternalEvents DB not implemented yet') },
    async updateExternalEvent(_id: string, _p: Partial<Omit<ExternalEvent, 'id'>>): Promise<ExternalEvent | null> { throw new Error('ExternalEvents DB not implemented yet') },
    async listParticipations(): Promise<Participation[]> { return [] },
    async getParticipation(_id: string): Promise<Participation | null> { return null },
    async createParticipation(_p: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Participation> { throw new Error('Participations DB not implemented yet') },
    async updateParticipation(_id: string, _p: Partial<Omit<Participation, 'id'>>): Promise<Participation | null> { throw new Error('Participations DB not implemented yet') },
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
