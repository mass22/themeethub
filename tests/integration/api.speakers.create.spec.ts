/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

if (!globalThis.createError) {
  globalThis.createError = (options: any) => new Error(options.statusMessage || 'Error')
}

if (!globalThis.readBody) {
  globalThis.readBody = async (event: any) => event.body
}

const mockCreateSpeaker = vi.fn((data: any) => Promise.resolve({
  id: 'spk_test',
  ...data,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}))

const mockFindSpeakerByNameAndRole = vi.fn(() => Promise.resolve(null))

if (!globalThis.useDataSource) {
  globalThis.useDataSource = () => ({
    createSpeaker: mockCreateSpeaker,
    findSpeakerByNameAndRole: mockFindSpeakerByNameAndRole,
    listSpeakers: vi.fn(() => Promise.resolve([])),
    getSpeaker: vi.fn(() => null)
  })
}

describe('POST /api/speakers', () => {
  let postHandler: any

  beforeAll(async () => {
    vi.clearAllMocks()
    const module = await import('../../server/api/speakers.post.ts')
    postHandler = module.default
  })

  it('creates speaker with valid payload', async () => {
    const mockEvent = {
      body: {
        name: 'Test Speaker',
        bio: 'Expert speaker'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^spk_/)
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()
  })

  it('throws error on invalid payload', async () => {
    const mockEvent = {
      body: {
        name: '',
        bio: 'Bio'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('validates required name field', async () => {
    const mockEvent = {
      body: {
        bio: 'Bio without name'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('accepts optional fields', async () => {
    const mockEvent = {
      body: {
        name: 'Valid Speaker',
        bio: 'Bio',
        avatar: 'https://example.com/avatar.png',
        role: 'Engineer'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^spk_/)
    expect(result.role).toBe('Engineer')
  })
})
