import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PromoItem } from '~/types/promoItem'

export const usePromoItemsStore = defineStore('promoItems', () => {
  const items = ref<PromoItem[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<PromoItem[]>('/api/promo_items')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const p = await $fetch<PromoItem>(`/api/promo_items/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = p
    else items.value.push(p)
    return p
  }

  const create = async (payload: Omit<PromoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<PromoItem>('/api/promo_items', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const patch = async (id: string, payload: Partial<Omit<PromoItem, 'id'>>) => {
    const updated = await $fetch<PromoItem>(`/api/promo_items/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const byId = (id: string) => items.value.find((p) => p.id === id)

  return { items, loaded, fetchAll, fetchById, create, patch, byId }
})
