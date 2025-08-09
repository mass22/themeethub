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
})
