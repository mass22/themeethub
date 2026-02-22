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

const createMockSponsor = (payload: any) => ({
  id: 'spo_test',
  companyName: payload.companyName,
  tier: payload.tier,
  contactId: payload.contactId,
  contactName: payload.contactName,
  contactEmail: payload.contactEmail,
  notes: payload.notes,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const mockDs = {
  createSponsor: vi.fn((data: any) => Promise.resolve(createMockSponsor(data))),
  findSponsorByCompanyAndEmail: vi.fn(() => Promise.resolve(null))
}

globalThis.useDataSource = () => mockDs

describe('POST /api/sponsors', () => {
  let postHandler: any

  beforeAll(async () => {
    const module = await import('../../server/api/sponsors.post.ts')
    postHandler = module.default
  })

  it('creates sponsor with valid payload', async () => {
    const mockEvent = {
      body: {
        companyName: 'Tech Corp',
        contactName: 'Jane Doe',
        contactEmail: 'jane@example.com'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.id).toMatch(/^spo_/)
    expect(result.companyName).toBe('Tech Corp')
    expect(result.contactName).toBe('Jane Doe')
    expect(result.contactEmail).toBe('jane@example.com')
  })

  it('throws error when companyName is missing', async () => {
    const mockEvent = {
      body: {
        contactName: 'Jane Doe',
        contactEmail: 'jane@example.com'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('creates sponsor with companyName and contactId only', async () => {
    const mockEvent = {
      body: {
        companyName: 'Tech Corp',
        contactId: 'ctc_001',
        tier: 'gold',
        notes: 'Premium partner'
      }
    }

    const result = await postHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.companyName).toBe('Tech Corp')
    expect(result.contactId).toBe('ctc_001')
  })

  it('throws error when contactEmail is invalid', async () => {
    const mockEvent = {
      body: {
        companyName: 'Tech Corp',
        contactName: 'Jane Doe',
        contactEmail: 'not-an-email'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Invalid payload')
  })

  it('returns 409 when sponsor already exists with same company and email', async () => {
    mockDs.findSponsorByCompanyAndEmail.mockResolvedValueOnce({
      id: 'spo_existing',
      companyName: 'Tech Corp',
      contactName: 'Jane Doe',
      contactEmail: 'jane@example.com',
      createdAt: '',
      updatedAt: ''
    })

    const mockEvent = {
      body: {
        companyName: 'Tech Corp',
        contactName: 'Jane Doe',
        contactEmail: 'jane@example.com'
      }
    }

    await expect(postHandler(mockEvent)).rejects.toThrow('Sponsor already exists')
  })
})
