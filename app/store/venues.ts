import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Venue } from '~/types/venue'

export const useVenuesStore = defineStore('venues', () => {
  const items = ref<Venue[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Venue[]>('/api/venues')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const v = await $fetch<Venue>(`/api/venues/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = v
    else items.value.push(v)
    return v
  }

  const create = async (payload: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Venue>('/api/venues', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const byId = (id: string) => items.value.find((v) => v.id === id)

  return { items, loaded, fetchAll, fetchById, create, byId }
})
