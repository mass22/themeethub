/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { Request } from '../../types/request'

const sendExploringCallEmailMock = vi.fn(() => Promise.resolve())

vi.mock('../../server/services/emailService', () => ({
  useEmailService: vi.fn(() => ({
    sendExploringCallEmail: sendExploringCallEmailMock
  })),
  buildExploringCallEmailParams: (req: Request, config: { calSponsorLink: string; calSpeakerLink: string; fromEmail: string }) => ({
    to: req.email,
    name: req.name,
    type: req.type,
    calLink: req.type === 'sponsor' ? config.calSponsorLink : config.calSpeakerLink,
    fromEmail: config.fromEmail
  })
}))

if (!globalThis.getRouterParam) {
  globalThis.getRouterParam = vi.fn((_event: any, key: string) => (key === 'id' ? 'req_001' : undefined))
}
if (!globalThis.useRuntimeConfig) {
  globalThis.useRuntimeConfig = vi.fn(() => ({
    calSponsorLink: 'https://cal.com/sponsor',
    calSpeakerLink: 'https://cal.com/speaker',
    fromEmail: 'noreply@themeethub.com'
  }))
}

describe('PATCH /api/admin/requests/[id] (status + exploring_call email)', () => {
  let patchHandler: any
  let mockGetRequest: ReturnType<typeof vi.fn>
  let mockPatchRequestStatus: ReturnType<typeof vi.fn>

  beforeAll(async () => {
    mockGetRequest = vi.fn()
    mockPatchRequestStatus = vi.fn()

    globalThis.useDataSource = vi.fn(() => ({
      getRequest: mockGetRequest,
      patchRequestStatus: mockPatchRequestStatus
    }))

    const module = await import('../../server/api/admin/requests/[id].patch.ts')
    patchHandler = module.default
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends email exactly once when status becomes exploring_call and exploringCallEmailSentAt is null', async () => {
    const request: Request = {
      id: 'req_001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      type: 'sponsor',
      companyName: 'Tech Corp',
      status: 'new',
      createdAt: '2025-02-20T10:00:00.000Z'
    }

    mockGetRequest.mockResolvedValue(request)
    mockPatchRequestStatus.mockImplementation((id: string, status: string, opts?: any) => {
      return Promise.resolve({
        ...request,
        id,
        status,
        exploringCallEmailSentAt: opts?.exploringCallEmailSentAt
      })
    })

    const event = {
      body: { status: 'exploring_call' },
      context: {}
    }
    ;(globalThis as any).readBody = vi.fn(() => Promise.resolve(event.body))
    ;(globalThis as any).getRouterParam = vi.fn((_e: any, k: string) => (k === 'id' ? 'req_001' : undefined))

    const result = await patchHandler(event)

    expect(sendExploringCallEmailMock).toHaveBeenCalledTimes(1)
    expect(mockPatchRequestStatus).toHaveBeenCalledWith(
      'req_001',
      'exploring_call',
      expect.objectContaining({
        exploringCallEmailSentAt: expect.any(String)
      })
    )
    expect(result.exploringCallEmailSentAt).toBeDefined()
    expect(new Date(result.exploringCallEmailSentAt).getTime()).toBeLessThanOrEqual(Date.now() + 1000)
  })

  it('sets exploringCallEmailSentAt timestamp when email is sent', async () => {
    const request: Request = {
      id: 'req_002',
      name: 'John Smith',
      email: 'john@example.com',
      type: 'speaker',
      role: 'Tech Lead',
      status: 'new',
      createdAt: '2025-02-19T14:30:00.000Z'
    }

    mockGetRequest.mockResolvedValue(request)
    mockPatchRequestStatus.mockImplementation((id: string, status: string, opts?: any) => {
      return Promise.resolve({
        ...request,
        id,
        status,
        exploringCallEmailSentAt: opts?.exploringCallEmailSentAt
      })
    })

    const event = {
      body: { status: 'exploring_call' },
      context: {}
    }
    ;(globalThis as any).readBody = vi.fn(() => Promise.resolve(event.body))
    ;(globalThis as any).getRouterParam = vi.fn((_e: any, k: string) => (k === 'id' ? 'req_002' : undefined))

    const result = await patchHandler(event)

    expect(result.exploringCallEmailSentAt).toBeDefined()
    expect(typeof result.exploringCallEmailSentAt).toBe('string')
    expect(result.status).toBe('exploring_call')
  })

  it('does not resend email if exploringCallEmailSentAt is already set', async () => {
    const alreadySentRequest: Request = {
      id: 'req_002',
      name: 'John Smith',
      email: 'john@example.com',
      type: 'speaker',
      role: 'Tech Lead',
      status: 'exploring_call',
      createdAt: '2025-02-19T14:30:00.000Z',
      exploringCallEmailSentAt: '2025-02-20T12:00:00.000Z'
    }

    mockGetRequest.mockResolvedValue(alreadySentRequest)
    mockPatchRequestStatus.mockImplementation((id: string, status: string, opts?: any) => {
      return Promise.resolve({
        ...alreadySentRequest,
        id,
        status,
        exploringCallEmailSentAt: opts?.exploringCallEmailSentAt ?? alreadySentRequest.exploringCallEmailSentAt
      })
    })

    const event = {
      body: { status: 'exploring_call' },
      context: {}
    }
    ;(globalThis as any).readBody = vi.fn(() => Promise.resolve(event.body))
    ;(globalThis as any).getRouterParam = vi.fn((_e: any, k: string) => (k === 'id' ? 'req_002' : undefined))

    await patchHandler(event)

    expect(sendExploringCallEmailMock).not.toHaveBeenCalled()
    expect(mockPatchRequestStatus).toHaveBeenCalledWith('req_002', 'exploring_call', undefined)
  })
})
