import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDataSource } from '../../../server/utils/dataSource'

// Mock de useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  useMocks: true
}))

describe('dataSource (mocks)', () => {
  let ds: ReturnType<typeof useDataSource>

  beforeEach(() => {
    process.env.NUXT_USE_MOCKS = 'true'
    ds = useDataSource()
  })

  it('listEvents renvoie un tableau', async () => {
    const list = await ds.listEvents()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it('getEvent renvoie null si inconnu', async () => {
    const e = await ds.getEvent('does_not_exist')
    expect(e).toBeNull()
  })

  it('createEvent crée un ID et conserve le payload', async () => {
    const created = await ds.createEvent({
      title: 'Test',
      date: '2025-01-01T00:00:00Z',
      slug: 'test',
      speakers: []
    })
    expect(created.id).toMatch(/^evt_/)
    expect(created.title).toBe('Test')
  })

  it('listRequests renvoie un tableau', async () => {
    const list = await ds.listRequests()
    expect(Array.isArray(list)).toBe(true)
  })

  it('getRequest renvoie null si inconnu', async () => {
    const r = await ds.getRequest('does_not_exist')
    expect(r).toBeNull()
  })

  it('createRequest (sponsor) a type sponsor, companyName et role undefined', async () => {
    const created = await ds.createRequest({
      type: 'sponsor',
      name: 'Jane',
      email: 'jane@example.com',
      companyName: 'Tech Corp'
    })
    expect(created.id).toMatch(/^req_/)
    expect(created.type).toBe('sponsor')
    expect(created.companyName).toBe('Tech Corp')
    expect(created.role).toBeUndefined()
    expect(created.status).toBe('new')
  })

  it('createRequest (speaker) a type speaker, role et companyName undefined', async () => {
    const created = await ds.createRequest({
      type: 'speaker',
      name: 'John',
      email: 'john@example.com',
      role: 'Tech Lead'
    })
    expect(created.id).toMatch(/^req_/)
    expect(created.type).toBe('speaker')
    expect(created.role).toBe('Tech Lead')
    expect(created.companyName).toBeUndefined()
    expect(created.status).toBe('new')
  })

  it('listSpeakers renvoie un tableau', async () => {
    const list = await ds.listSpeakers()
    expect(Array.isArray(list)).toBe(true)
  })

  it('createSpeaker crée un speaker avec createdAt et updatedAt', async () => {
    const created = await ds.createSpeaker({
      name: 'Test Speaker',
      role: 'Engineer'
    })
    expect(created.id).toMatch(/^spk_/)
    expect(created.name).toBe('Test Speaker')
    expect(created.role).toBe('Engineer')
    expect(created.createdAt).toBeDefined()
    expect(created.updatedAt).toBeDefined()
  })

  it('patchRequestStatus avec exploringCallEmailSentAt met à jour le timestamp', async () => {
    const list = await ds.listRequests()
    const req = list.find((r: { id: string }) => r.id === 'req_001')
    expect(req).toBeDefined()
    const before = req?.exploringCallEmailSentAt
    const updated = await ds.patchRequestStatus('req_001', 'exploring_call', {
      exploringCallEmailSentAt: '2025-02-22T15:00:00.000Z'
    })
    expect(updated?.status).toBe('exploring_call')
    expect(updated?.exploringCallEmailSentAt).toBe('2025-02-22T15:00:00.000Z')
    expect(updated?.exploringCallEmailSentAt).not.toBe(before)
  })
})
