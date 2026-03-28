import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Event } from '~~/types/event'

export const useEventsStore = defineStore('events', () => {
  // État (équivalent de state)
  const items = ref<Event[]>([])
  const loaded = ref(false)

  // Actions
  const fetchAll = async () => {
    try {
      items.value = await fetchWithRetry(() => $fetch<Event[]>('/api/events'))
    } catch (e) {
      console.error('[events store] fetchAll failed:', e)
      items.value = []
    }
    loaded.value = true
  }

  const create = async (payload: Partial<Event>) => {
    const created = await $fetch<Event>('/api/events', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const update = async (id: string, payload: Partial<Event>) => {
    const updated = await $fetch<Event>(`/api/events/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((e) => e.id === id)
    if (idx >= 0) items.value[idx] = updated
    return updated
  }

  // Getter simple sans fonction
  const byId = (id: string) => items.value.find((e: Event) => e.id === id)

  return {
    // État
    items,
    loaded,
    // Actions
    fetchAll,
    create,
    update,
    // Getters
    byId
  }
})
