import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sponsor } from '~~/types/sponsor'

export const useSponsorsStore = defineStore('Sponsors', () => {
  const items = ref<Sponsor[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    try {
      items.value = await fetchWithRetry(() => $fetch<Sponsor[]>('/api/sponsors'))
    } catch (e) {
      console.error('[sponsors store] fetchAll failed:', e)
      items.value = []
    }
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

  const update = async (id: string, payload: Partial<Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = await $fetch<Sponsor>(`/api/sponsors/${id}`, { method: 'PATCH', body: payload })
    const idx = items.value.findIndex((s) => s.id === id)
    if (idx >= 0) items.value[idx] = updated
    else items.value.push(updated)
    return updated
  }

  const remove = async (id: string) => {
    await $fetch(`/api/admin/delete/sponsors/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((s) => s.id !== id)
  }

  const byId = (id: string) => items.value.find((s) => s.id === id)

  return {
    items,
    loaded,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    byId
  }
})
