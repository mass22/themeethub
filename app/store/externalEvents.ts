import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExternalEvent } from '~/types/externalEvent'

export const useExternalEventsStore = defineStore('externalEvents', () => {
  const items = ref<ExternalEvent[]>([])
  const loaded = ref(false)

  const fetchAll = async (communityId?: string) => {
    const url = communityId ? `/api/external-events?communityId=${communityId}` : '/api/external-events'
    items.value = await $fetch<ExternalEvent[]>(url)
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const e = await $fetch<ExternalEvent>(`/api/external-events/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = e
    else items.value.push(e)
    return e
  }

  const create = async (payload: Omit<ExternalEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<ExternalEvent>('/api/external-events', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const patch = async (id: string, payload: Partial<Omit<ExternalEvent, 'id'>>) => {
    const updated = await $fetch<ExternalEvent>(`/api/external-events/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const byId = (id: string) => items.value.find((e) => e.id === id)

  return { items, loaded, fetchAll, fetchById, create, patch, byId }
})
