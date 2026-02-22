/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

if (!globalThis.createError) {
  globalThis.createError = (options: any) => new Error(options.statusMessage || 'Error')
}

if (!globalThis.getRouterParam) {
  globalThis.getRouterParam = vi.fn((_event: any, key: string) => (key === 'id' ? 'spk_001' : undefined))
}

const mockSpeaker = {
  id: 'spk_001',
  name: 'Alex Lichter',
  role: 'Core Team',
  bio: 'Nuxt expert',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z'
}

const mockDs = {
  listSpeakers: vi.fn(() => Promise.resolve([mockSpeaker])),
  getSpeaker: vi.fn((id: string) =>
    Promise.resolve(id === 'spk_001' ? mockSpeaker : null)
  )
}

globalThis.useDataSource = () => mockDs

describe('GET /api/speakers', () => {
  let listHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/speakers.get.ts')
    listHandler = module.default
  })

  it('returns list of speakers', async () => {
    const result = await listHandler({})

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThanOrEqual(0)
  })
})

describe('GET /api/speakers/[id]', () => {
  let getByIdHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/speakers/[id].get.ts')
    getByIdHandler = module.default
  })

  it('returns speaker by id', async () => {
    ;(globalThis as any).getRouterParam = vi.fn((_e: any, k: string) => (k === 'id' ? 'spk_001' : undefined))

    const result = await getByIdHandler({})

    expect(result).toBeDefined()
    expect(result.id).toBe('spk_001')
    expect(result.name).toBe('Alex Lichter')
  })

  it('returns 404 for unknown speaker id', async () => {
    mockDs.getSpeaker.mockResolvedValueOnce(null)
    ;(globalThis as any).getRouterParam = vi.fn((_e: any, k: string) => (k === 'id' ? 'spk_unknown' : undefined))

    await expect(getByIdHandler({})).rejects.toThrow('Speaker not found')
  })
})
