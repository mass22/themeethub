import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithRetry } from '../../../app/utils/fetchWithRetry'
import { useEventsStore } from '../../../app/store/events'

vi.mock('../../../app/utils/fetchWithRetry', () => ({
  fetchWithRetry: vi.fn()
}))

describe('events store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchWithRetry).mockResolvedValue([
      { id: '1', title: 'T', date: '2025-01-01T00:00:00.000Z', speakers: [] }
    ] as any)
  })

  it('fetchAll loads items', async () => {
    const store = useEventsStore()
    await store.fetchAll()
    expect(store.items.length).toBe(1)
  })
})
