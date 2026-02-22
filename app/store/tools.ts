import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tool } from '~/types/tool'

export const useToolsStore = defineStore('tools', () => {
  const items = ref<Tool[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Tool[]>('/api/tools')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const t = await $fetch<Tool>(`/api/tools/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = t
    else items.value.push(t)
    return t
  }

  const create = async (payload: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Tool>('/api/tools', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const byId = (id: string) => items.value.find((t) => t.id === id)

  return { items, loaded, fetchAll, fetchById, create, byId }
})
