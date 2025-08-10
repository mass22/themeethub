/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'

// Mock des composables Nuxt globalement
if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

if (!globalThis.createError) {
  globalThis.createError = (options: any) => new Error(options.statusMessage || 'Error')
}

if (!globalThis.readBody) {
  globalThis.readBody = async (event: any) => event.body
}

if (!globalThis.useDataSource) {
  globalThis.useDataSource = () => ({
    createEvent: vi.fn((_data: any) => Promise.resolve({ id: 'evt_test' })),
    listEvents: vi.fn(() => Promise.resolve([]))
  })
}

describe('POST /api/events', () => {
  let postHandler: any

  beforeAll(async () => {
    // Import dynamique pour éviter les problèmes de mocks
    const module = await import('../../server/api/events.post.ts')
    postHandler = module.default
  })

  it('creates event with valid payload', async () => {
    const mockEvent = {
      body: {
        title: 'From Test',
        date: '2025-10-01T00:00:00Z',
        slug: 'from-test',
        speakers: []
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^evt_/)
    // Les autres propriétés peuvent ne pas être présentes selon l'implémentation du mock
  })

  it('throws error on invalid payload', async () => {
    const mockEvent = {
      body: {
        title: 'x',
        date: '',
        slug: 'BAD slug'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('validates required fields', async () => {
    const mockEvent = {
      body: {
        title: 'Valid Title',
        date: '2025-10-01T00:00:00Z',
        // slug manquant
        speakers: []
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('validates slug format', async () => {
    const mockEvent = {
      body: {
        title: 'Valid Title',
        date: '2025-10-01T00:00:00Z',
        slug: 'invalid slug with spaces',
        speakers: []
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('accepts optional fields', async () => {
    const mockEvent = {
      body: {
        title: 'Valid Title',
        date: '2025-10-01T00:00:00Z',
        slug: 'valid-slug',
        location: 'Montréal, QC',
        description: 'Description optionnelle',
        speakers: []
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^evt_/)
    // Les champs optionnels sont acceptés par la validation
  })
})