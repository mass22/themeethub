import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sponsor } from '~/types/sponsor'

export const useSponsorsStore = defineStore('Sponsors', () => {
  const items = ref<Sponsor[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Sponsor[]>('/api/sponsors')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const s = await $fetch<Sponsor>(`/api/sponsors/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = s
    else items.value.push(s)
    return s
  }

  const create = async (payload: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Sponsor>('/api/sponsors', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const byId = (id: string) => items.value.find((s) => s.id === id)

  return {
    items,
    loaded,
    fetchAll,
    fetchById,
    create,
    byId
  }
})
