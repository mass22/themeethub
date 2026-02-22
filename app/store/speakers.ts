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

  const fetchById = async (id: string) => {
    const cached = items.value.find((s) => s.id === id)
    if (cached) return cached
    const s = await $fetch<Speaker>(`/api/speakers/${id}`)
    if (!items.value.find((x) => x.id === s.id)) items.value.push(s)
    return s
  }

  const create = async (payload: Omit<Speaker, 'id' | 'createdAt' | 'updatedAt'>) => {
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
    fetchById,
    create,
    // Getters
    byId
  }
})
