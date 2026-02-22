/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

if (!globalThis.createError) {
  globalThis.createError = (options: any) => new Error(options.statusMessage || 'Error')
}

if (!globalThis.getRouterParam) {
  globalThis.getRouterParam = (_event: any, key: string) => (key === 'id' ? 'spo_001' : undefined)
}

const mockSponsors = [
  {
    id: 'spo_001',
    companyName: 'Tech Corp',
    contactName: 'Jane Doe',
    contactEmail: 'jane@example.com',
    createdAt: '2025-02-20T10:00:00.000Z',
    updatedAt: '2025-02-20T10:00:00.000Z'
  }
]

const mockDs = {
  listSponsors: vi.fn(() => Promise.resolve(mockSponsors)),
  getSponsor: vi.fn((id: string) =>
    Promise.resolve(mockSponsors.find((s) => s.id === id) ?? null)
  )
}

globalThis.useDataSource = () => mockDs

describe('GET /api/sponsors', () => {
  let getHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/sponsors.get.ts')
    getHandler = module.default
  })

  it('returns list of sponsors', async () => {
    const result = await getHandler({})

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(result[0].companyName).toBe('Tech Corp')
  })
})

describe('GET /api/sponsors/[id]', () => {
  let getByIdHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/sponsors/[id].get.ts')
    getByIdHandler = module.default
  })

  it('returns sponsor by id', async () => {
    const mockEvent = { context: {} }
    if (!globalThis.getRouterParam) {
      ;(globalThis as any).getRouterParam = () => 'spo_001'
    }
    const originalGetRouterParam = globalThis.getRouterParam
    ;(globalThis as any).getRouterParam = () => 'spo_001'

    const result = await getByIdHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toBe('spo_001')
    expect(result.companyName).toBe('Tech Corp')
    ;(globalThis as any).getRouterParam = originalGetRouterParam
  })

  it('returns 404 for unknown sponsor id', async () => {
    mockDs.getSponsor.mockResolvedValueOnce(null)
    ;(globalThis as any).getRouterParam = () => 'spo_unknown'

    await expect(getByIdHandler({})).rejects.toThrow('Sponsor not found')
  })
})
