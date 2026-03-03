import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LogisticsItem } from '~/types/logisticsItem'

export const useLogisticsItemsStore = defineStore('logisticsItems', () => {
  const items = ref<LogisticsItem[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    try {
      items.value = await $fetch<LogisticsItem[]>('/api/logistics_items')
    } catch (e) {
      console.error('[logistics store] fetchAll failed:', e)
      items.value = []
    }
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const l = await $fetch<LogisticsItem>(`/api/logistics_items/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = l
    else items.value.push(l)
    return l
  }

  const create = async (payload: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<LogisticsItem>('/api/logistics_items', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const patch = async (id: string, payload: Partial<Omit<LogisticsItem, 'id'>>) => {
    const updated = await $fetch<LogisticsItem>(`/api/logistics_items/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const byId = (id: string) => items.value.find((l) => l.id === id)

  return { items, loaded, fetchAll, fetchById, create, patch, byId }
})
