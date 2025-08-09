import { describe, expect, it, vi } from 'vitest'

// Mock global de useDataSource
global.useDataSource = vi.fn(() => ({
  listEvents: vi.fn().mockResolvedValue([
    {
      id: 'evt_123',
      title: 'Test Event API',
      date: '2024-12-31T19:00:00Z',
      description: 'Test API description'
    }
  ]),
  getEvent: vi.fn().mockImplementation((id) =>
    Promise.resolve({
      id,
      title: `Event ${id}`,
      date: '2024-12-31T19:00:00Z'
    })
  ),
  createEvent: vi.fn().mockImplementation((data) =>
    Promise.resolve({
      id: 'evt_new',
      ...data
    })
  )
}))

// Mock global de defineEventHandler
global.defineEventHandler = vi.fn((handler) => handler)

// Mock des fonctions Nuxt
global.getRouterParam = vi.fn((event, param) => event.context?.params?.[param])
global.createError = vi.fn((options) => new Error(options.statusMessage))

describe('API Routes - Events', () => {
  it('GET /api/events should return events list', async () => {
    const { default: eventsGetHandler } = await import('../../../server/api/events.get')

    const mockEvent = {}
    const result = await eventsGetHandler(mockEvent)

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('id', 'evt_123')
    expect(result[0]).toHaveProperty('title', 'Test Event API')
  })

  it('GET /api/events/[id] should return specific event', async () => {
    const { default: eventByIdHandler } = await import('../../../server/api/events/[id].get')

    const mockEvent = {
      context: {
        params: { id: 'test_id' }
      }
    }
    const result = await eventByIdHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('id', 'test_id')
    expect(result).toHaveProperty('title', 'Event test_id')
  })
})
