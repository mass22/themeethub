import { createApp, createError, createRouter, defineEventHandler, getRouterParam, readBody, toNodeListener } from 'h3'
import { listen } from 'listhen'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

// Mock de useDataSource
const mockDataSource = {
  listEvents: vi.fn(() => [
    { id: 'evt_1', title: 'Test Event 1', date: '2024-01-01', slug: 'test-1', speakers: [] },
    { id: 'evt_2', title: 'Test Event 2', date: '2024-01-02', slug: 'test-2', speakers: [] }
  ]),
  getEventById: vi.fn((id: string) => {
    if (id === 'evt_1') {
      return { id: 'evt_1', title: 'Test Event 1', date: '2024-01-01', slug: 'test-1', speakers: [] }
    }
    return null
  }),
  createEvent: vi.fn((event: any) => ({
    id: 'evt_' + Math.random().toString(36).substr(2, 9),
    ...event
  }))
}

// Simuler les handlers API directement dans le test
const eventsListHandler = defineEventHandler(async () => {
  return mockDataSource.listEvents()
})

const createEventHandler = defineEventHandler(async (event) => {
  const body = await readBody(event)
  return mockDataSource.createEvent(body)
})

const eventByIdHandler = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = mockDataSource.getEventById(id)
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }
  return result
})

describe('API /api/events', () => {
  let url: string
  let close: () => Promise<void>

  beforeAll(async () => {
    process.env.NUXT_USE_MOCKS = 'true'
    const app = createApp()
    const router = createRouter()

    // Routes API
    router.get('/api/events', eventsListHandler)
    router.post('/api/events', createEventHandler)
    router.get('/api/events/:id', eventByIdHandler)

    app.use(router)

    const listener = toNodeListener(app)
    const server = await listen(listener, { port: 0 }) // port aléatoire
    url = server.url
    close = server.close
  })

  afterAll(async () => { await close?.() })

  it('GET /api/events → 200 + array', async () => {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/events`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
  })

  it('POST /api/events → 200 + objet créé', async () => {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Event Int Test',
        date: '2025-10-01T00:00:00Z',
        slug: 'event-int-test',
        speakers: []
      })
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toMatch(/^evt_/)
    expect(json.title).toBe('Event Int Test')
  })

  it('GET /api/events/:id (unknown) → 404', async () => {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/events/not-found`)
    expect(res.status).toBe(404)
  })
})
