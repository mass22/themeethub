/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

const mockEvents = [
  { id: 'evt_001', title: 'Meetup', date: '2025-09-10T23:00:00.000Z', speakers: [] }
]

const mockPromoItems = [
  { id: 'prm_001', title: 'Annonce', dueAt: '2025-09-08T18:00:00.000Z', status: 'todo', createdAt: '2025-02-20T10:00:00.000Z', updatedAt: '2025-02-20T10:00:00.000Z', eventId: 'evt_001' }
]

const mockSocialPosts = [
  { id: 'soc_001', copy: 'Post', scheduledAt: '2025-09-09T12:00:00.000Z', status: 'draft', createdAt: '2025-02-20T10:00:00.000Z', updatedAt: '2025-02-20T10:00:00.000Z', eventId: 'evt_001' }
]

const mockLogisticsItems = [
  { id: 'lgs_001', name: 'Projecteur', status: 'ready', createdAt: '2025-09-05T10:00:00.000Z', updatedAt: '2025-02-20T10:00:00.000Z', eventId: 'evt_001' }
]

const mockExternalEvents = [
  { id: 'exe_001', communityId: 'ext_001', title: 'Montreal.js Meetup', startAt: '2025-09-15T18:00:00.000Z', createdAt: '2025-02-20T10:00:00.000Z', updatedAt: '2025-02-20T10:00:00.000Z' }
]

const mockParticipations = [
  { id: 'par_001', externalEventId: 'exe_001', intent: 'ask_promo', status: 'planned', followUpDueAt: '2025-09-10T12:00:00.000Z', createdAt: '2025-02-20T10:00:00.000Z', updatedAt: '2025-02-20T10:00:00.000Z' }
]

const mockDs = {
  listEvents: vi.fn(() => Promise.resolve(mockEvents)),
  listPromoItems: vi.fn(() => Promise.resolve(mockPromoItems)),
  listSocialPosts: vi.fn(() => Promise.resolve(mockSocialPosts)),
  listLogisticsItems: vi.fn(() => Promise.resolve(mockLogisticsItems)),
  listExternalEvents: vi.fn(() => Promise.resolve(mockExternalEvents)),
  listParticipations: vi.fn(() => Promise.resolve(mockParticipations)),
  getExternalEvent: vi.fn((id: string) => Promise.resolve(mockExternalEvents.find((e: any) => e.id === id) ?? null))
}

globalThis.useDataSource = () => mockDs

// Mock getQuery to return from/to in range
const from = '2025-09-01T00:00:00.000Z'
const to = '2025-09-30T23:59:59.000Z'

if (!globalThis.getQuery) {
  globalThis.getQuery = () => ({ from, to })
}

describe('GET /api/calendar', () => {
  let getHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/calendar.get.ts')
    getHandler = module.default
  })

  it('returns aggregated calendar items', async () => {
    const mockEvent = { query: { from, to } }
    if (globalThis.getQuery) {
      ;(globalThis as any).getQuery = () => mockEvent.query
    }

    const result = await getHandler(mockEvent)

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThanOrEqual(1)
    const eventItem = result.find((r: any) => r.type === 'event')
    expect(eventItem).toBeDefined()
    expect(eventItem.id).toBe('evt_001')
    expect(eventItem.title).toBe('Meetup')
    expect(eventItem.startAt).toBe('2025-09-10T23:00:00.000Z')
    expect(eventItem.href).toBe('/events/evt_001')
  })

  it('returns items sorted by startAt', async () => {
    const mockEvent = { query: { from, to } }
    ;(globalThis as any).getQuery = () => mockEvent.query

    const result = await getHandler(mockEvent)

    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i].startAt).getTime()).toBeGreaterThanOrEqual(new Date(result[i - 1].startAt).getTime())
    }
  })
})
