import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contractor } from '~~/types/contractor'

export const useContractorsStore = defineStore('contractors', () => {
  const items = ref<Contractor[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    try {
      items.value = await fetchWithRetry(() => $fetch<Contractor[]>('/api/contractors'))
    } catch (e) {
      console.error('[contractors store] fetchAll failed:', e)
      items.value = []
    }
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const c = await $fetch<Contractor>(`/api/contractors/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = c
    else items.value.push(c)
    return c
  }

  const create = async (payload: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Contractor>('/api/contractors', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const remove = async (id: string) => {
    await $fetch(`/api/admin/delete/contractors/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((c) => c.id !== id)
  }

  const byId = (id: string) => items.value.find((c) => c.id === id)

  return { items, loaded, fetchAll, fetchById, create, remove, byId }
})
