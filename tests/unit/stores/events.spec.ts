import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventsStore } from '../../../app/store/events'

describe('events store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    ;(globalThis as any).$fetch = vi.fn().mockResolvedValue([
      { id: '1', title: 'T', date: '2025-01-01T00:00:00Z', speakers: [] }
    ])
  })

  it('fetchAll loads items', async () => {
    const store = useEventsStore()
    await store.fetchAll()
    expect(store.items.length).toBe(1)
  })
})
