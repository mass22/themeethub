/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRateLimit } from '../../server/utils/rateLimit'

vi.mock('h3', () => ({ getRequestIP: vi.fn(() => 'test-ip') }))

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}

if (!globalThis.createError) {
  globalThis.createError = (options: any) => new Error(options.statusMessage || 'Error')
}

if (!globalThis.readBody) {
  globalThis.readBody = async (event: any) => event.body
}

const createMockRequest = (type: 'sponsor' | 'speaker', payload: any) => ({
  id: 'req_test',
  name: payload.name,
  email: payload.email,
  type,
  companyName: type === 'sponsor' ? payload.companyName : undefined,
  role: type === 'speaker' ? payload.role : undefined,
  status: 'new',
  createdAt: new Date().toISOString()
})

globalThis.useDataSource = () => ({
  createRequest: vi.fn((data: any) => Promise.resolve(createMockRequest('speaker', data)))
})

describe('POST /api/public/speaker-requests', () => {
  let postHandler: any

  beforeEach(() => {
    resetRateLimit()
  })

  beforeAll(async () => {
    const module = await import('../../server/api/public/speaker-requests.post.ts')
    postHandler = module.default
  })

  it('creates speaker request with valid payload', async () => {
    const mockEvent = {
      body: {
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Tech Lead'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^req_/)
    expect(result.type).toBe('speaker')
    expect(result.role).toBe('Tech Lead')
    expect(result.companyName).toBeUndefined()
    expect(result.name).toBe('John Smith')
    expect(result.email).toBe('john@example.com')
    expect(result.status).toBe('new')
  })

  it('throws error when role is missing', async () => {
    const mockEvent = {
      body: {
        name: 'John Smith',
        email: 'john@example.com'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when role is empty string', async () => {
    const mockEvent = {
      body: {
        name: 'John Smith',
        email: 'john@example.com',
        role: ''
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when name is missing', async () => {
    const mockEvent = {
      body: {
        email: 'john@example.com',
        role: 'Tech Lead'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when email is missing', async () => {
    const mockEvent = {
      body: {
        name: 'John Smith',
        role: 'Tech Lead'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when email is invalid', async () => {
    const mockEvent = {
      body: {
        name: 'John Smith',
        email: 'invalid-email',
        role: 'Tech Lead'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })
})
