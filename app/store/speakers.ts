import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Speaker } from '~/types/speaker'

export const useSpeakersStore = defineStore('Speakers', () => {
  // État (équivalent de state)
  const items = ref<Speaker[]>([])
  const loaded = ref(false)

  // Actions
  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Speaker[]>('/api/speakers')
    loaded.value = true
  }

  const create = async (payload: Partial<Speaker>) => {
    const created = await $fetch<Speaker>('/api/speakers', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  // Getter simple sans fonction
  const byId = (id: string) => items.value.find((e: Speaker) => e.id === id)

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
