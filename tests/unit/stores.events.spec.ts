import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
// Import avec chemin relatif pour contourner le problème d'alias dans vitest
import { useEventsStore } from '../../app/store/events'

describe('events store', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('fetchAll loads items', async () => {
    // Mock de $fetch pour l'environnement de test
    globalThis.$fetch = vi.fn().mockResolvedValue([
      { id:'1', title:'T', date:'2025-01-01T00:00:00Z', speakers: [] }
    ])

    const store = useEventsStore()
    await store.fetchAll()
    expect(store.items.length).toBe(1)
  })
})
