import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExternalCommunity } from '~/types/externalCommunity'

export const useExternalCommunitiesStore = defineStore('externalCommunities', () => {
  const items = ref<ExternalCommunity[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<ExternalCommunity[]>('/api/external-communities')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const c = await $fetch<ExternalCommunity>(`/api/external-communities/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = c
    else items.value.push(c)
    return c
  }

  const create = async (payload: Omit<ExternalCommunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<ExternalCommunity>('/api/external-communities', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const patch = async (id: string, payload: Partial<Omit<ExternalCommunity, 'id'>>) => {
    const updated = await $fetch<ExternalCommunity>(`/api/external-communities/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const byId = (id: string) => items.value.find((c) => c.id === id)

  return { items, loaded, fetchAll, fetchById, create, patch, byId }
})
