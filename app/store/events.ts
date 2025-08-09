import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Event } from '~/types/event'

export const useEventsStore = defineStore('events', () => {
  // État (équivalent de state)
  const items = ref<Event[]>([])
  const loaded = ref(false)

  // Actions
  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Event[]>('/api/events')
    loaded.value = true
  }

  const create = async (payload: Partial<Event>) => {
    const created = await $fetch<Event>('/api/events', { method: 'POST', body: payload })
    items.value.push(created)
    return created
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
    // Getters
    byId
  }
})
