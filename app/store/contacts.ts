import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contact } from '~/types/contact'

export const useContactsStore = defineStore('contacts', () => {
  const items = ref<Contact[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<Contact[]>('/api/contacts')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const c = await $fetch<Contact>(`/api/contacts/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = c
    else items.value.push(c)
    return c
  }

  const create = async (payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<Contact>('/api/contacts', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const byId = (id: string) => items.value.find((c) => c.id === id)

  return { items, loaded, fetchAll, fetchById, create, byId }
})
