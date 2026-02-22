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
  createRequest: vi.fn((data: any) => Promise.resolve(createMockRequest('sponsor', data)))
})

describe('POST /api/public/sponsor-requests', () => {
  let postHandler: any

  beforeEach(() => {
    resetRateLimit()
  })

  beforeAll(async () => {
    const module = await import('../../server/api/public/sponsor-requests.post.ts')
    postHandler = module.default
  })

  it('creates sponsor request with valid payload', async () => {
    const mockEvent = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        companyName: 'Tech Corp'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^req_/)
    expect(result.type).toBe('sponsor')
    expect(result.companyName).toBe('Tech Corp')
    expect(result.role).toBeUndefined()
    expect(result.name).toBe('Jane Doe')
    expect(result.email).toBe('jane@example.com')
    expect(result.status).toBe('new')
  })

  it('throws error when companyName is missing', async () => {
    const mockEvent = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when companyName is empty string', async () => {
    const mockEvent = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        companyName: ''
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when name is missing', async () => {
    const mockEvent = {
      body: {
        email: 'jane@example.com',
        companyName: 'Tech Corp'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when email is missing', async () => {
    const mockEvent = {
      body: {
        name: 'Jane Doe',
        companyName: 'Tech Corp'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('throws error when email is invalid', async () => {
    const mockEvent = {
      body: {
        name: 'Jane Doe',
        email: 'not-an-email',
        companyName: 'Tech Corp'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })
})
