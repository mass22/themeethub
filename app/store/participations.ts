import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Participation } from '~/types/participation'

export const useParticipationsStore = defineStore('participations', () => {
  const items = ref<Participation[]>([])
  const loaded = ref(false)

  const fetchAll = async (externalEventId?: string) => {
    const url = externalEventId ? `/api/participations?externalEventId=${externalEventId}` : '/api/participations'
    items.value = await $fetch<Participation[]>(url)
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const p = await $fetch<Participation>(`/api/participations/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = p
    else items.value.push(p)
    return p
  }

  const create = async (payload: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Participation>('/api/participations', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const patch = async (id: string, payload: Partial<Omit<Participation, 'id'>>) => {
    const updated = await $fetch<Participation>(`/api/participations/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const byId = (id: string) => items.value.find((p) => p.id === id)

  return { items, loaded, fetchAll, fetchById, create, patch, byId }
})
