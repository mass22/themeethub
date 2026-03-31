import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Speaker } from '~~/types/speaker'

export const useSpeakersStore = defineStore('Speakers', () => {
  // État (équivalent de state)
  const items = ref<Speaker[]>([])
  const loaded = ref(false)

  // Actions
  const fetchAll = async () => {
    if (loaded.value) return
    try {
      items.value = await fetchWithRetry(() => $fetch<Speaker[]>('/api/speakers'))
    } catch {
      items.value = []
    }
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

  const update = async (id: string, payload: Partial<Omit<Speaker, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = await $fetch<Speaker>(`/api/speakers/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((s) => s.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const remove = async (id: string) => {
    await $fetch(`/api/admin/delete/speakers/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((s) => s.id !== id)
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
    update,
    remove,
    // Getters
    byId
  }
})
