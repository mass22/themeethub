/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRateLimit } from '../../server/utils/rateLimit'

vi.mock('h3', () => ({
  getRequestIP: vi.fn(() => 'test-ip-1')
}))

if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = (handler: any) => handler
}
if (!globalThis.createError) {
  globalThis.createError = (options: any) => {
    const err = new Error(options.statusMessage || options.message || 'Error')
    ;(err as any).statusCode = options.statusCode
    ;(err as any).statusMessage = options.statusMessage
    return err
  }
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

describe('Public intake anti-spam: honeypot & rate limit', () => {
  let speakerHandler: any
  let sponsorHandler: any

  beforeEach(async () => {
    resetRateLimit()
    globalThis.useDataSource = () => ({
      createRequest: vi.fn((data: any) =>
        Promise.resolve(createMockRequest(data.type, data))
      )
    })
    const speakerMod = await import('../../server/api/public/speaker-requests.post.ts')
    const sponsorMod = await import('../../server/api/public/sponsor-requests.post.ts')
    speakerHandler = speakerMod.default
    sponsorHandler = sponsorMod.default
  })

  describe('honeypot', () => {
    it('rejects when website field is non-empty (speaker)', async () => {
      const event = {
        body: {
          name: 'John',
          email: 'john@example.com',
          role: 'Lead',
          website: 'https://spam.com'
        }
      }
      await expect(speakerHandler(event)).rejects.toThrow('Invalid payload')
    })

    it('rejects when website field is non-empty (sponsor)', async () => {
      const event = {
        body: {
          name: 'Jane',
          email: 'jane@example.com',
          companyName: 'Corp',
          website: 'http://evil.com'
        }
      }
      await expect(sponsorHandler(event)).rejects.toThrow('Invalid payload')
    })

    it('accepts when website is empty string', async () => {
      const event = {
        body: {
          name: 'John',
          email: 'john@example.com',
          role: 'Lead',
          website: ''
        }
      }
      const result = await speakerHandler(event)
      expect(result).toBeDefined()
    })

    it('accepts when website is absent', async () => {
      const event = {
        body: { name: 'John', email: 'john@example.com', role: 'Lead' }
      }
      const result = await speakerHandler(event)
      expect(result).toBeDefined()
    })
  })

  describe('Zod normalization', () => {
    it('normalizes email to lowercase and trims strings', async () => {
      const event = {
        body: {
          name: '  John Smith  ',
          email: 'JOHN@Example.COM',
          role: ' Tech Lead '
        }
      }
      const createRequest = vi.fn((data: any) =>
        Promise.resolve(createMockRequest('speaker', data))
      )
      globalThis.useDataSource = () => ({ createRequest })
      await speakerHandler(event)
      expect(createRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Tech Lead'
        })
      )
    })
  })

  describe('rate limit', () => {
    it('returns 429 after exceeding limit (10 requests per minute)', async () => {
      const event = (body: any) => ({ body })
      const validBody = {
        name: 'John',
        email: 'john@example.com',
        role: 'Lead'
      }

      for (let i = 0; i < 10; i++) {
        const result = await speakerHandler(event(validBody))
        expect(result).toBeDefined()
      }

      const err = await speakerHandler(event(validBody)).catch((e: Error) => e)
      expect((err as any).statusCode).toBe(429)
      expect((err as any).statusMessage || err.message).toMatch(/Too Many|Rate limit/i)
    })
  })
})
