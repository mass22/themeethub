/**
 * Integration tests against real database.
 * Run with: NUXT_USE_MOCKS=false DATABASE_URL="postgresql://..." npm run test:integration:db
 * Or: npm run test:integration:db (requires .env with DATABASE_URL)
 *
 * Skipped when DATABASE_URL is not set.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const hasDb = !!process.env.DATABASE_URL

describe.runIf(hasDb)('dataSource (Prisma/DB)', () => {
  beforeAll(() => {
    process.env.NUXT_USE_MOCKS = 'false'
    ;(globalThis as any).useRuntimeConfig = () => ({ useMocks: false })
  })

  afterAll(() => {
    delete process.env.NUXT_USE_MOCKS
    delete (globalThis as any).useRuntimeConfig
  })

  it('uses Prisma when useMocks is false', async () => {
    const { useDataSource } = await import('../../server/utils/dataSource')
    const ds = useDataSource()
    expect(ds.useMocks).toBe(false)
  })

  it('creates and lists events', async () => {
    const { useDataSource } = await import('../../server/utils/dataSource')
    const ds = useDataSource()
    const slug = `test-${Date.now()}`
    const created = await ds.createEvent({
      title: 'DB Test Event',
      date: new Date().toISOString(),
      slug,
      speakers: []
    })
    expect(created.id).toMatch(/^evt_/)
    expect(created.slug).toBe(slug)
    const found = await ds.getEvent(created.id)
    expect(found?.id).toBe(created.id)
    const list = await ds.listEvents()
    expect(list.some((e) => e.id === created.id)).toBe(true)
  })

  it('creates and lists speakers', async () => {
    const { useDataSource } = await import('../../server/utils/dataSource')
    const ds = useDataSource()
    const created = await ds.createSpeaker({ name: 'DB Test Speaker' })
    expect(created.id).toMatch(/^spk_/)
    const list = await ds.listSpeakers()
    expect(list.some((s) => s.id === created.id)).toBe(true)
  })

  it('creates and lists requests with filters', async () => {
    const { useDataSource } = await import('../../server/utils/dataSource')
    const ds = useDataSource()
    const created = await ds.createRequest({
      type: 'speaker',
      name: 'DB Test',
      email: 'dbtest@example.com',
      role: 'Engineer'
    })
    expect(created.id).toMatch(/^req_/)
    expect(created.status).toBe('new')
    const byType = await ds.listRequests({ type: 'speaker' })
    expect(byType.some((r) => r.id === created.id)).toBe(true)
    const updated = await ds.patchRequestStatus(created.id, 'validated', {
      exploringCallEmailSentAt: new Date().toISOString()
    })
    expect(updated?.status).toBe('validated')
  })
})
