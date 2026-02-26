import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Request, RequestStatus } from '~/types/request'

const STATUSES: RequestStatus[] = ['new', 'exploring_call', 'validated', 'in_progress', 'closed', 'rejected']

export const useRequestsStore = defineStore('requests', () => {
  const items = ref<Request[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    try {
      items.value = await $fetch<Request[]>('/api/admin/requests')
    } catch (e) {
      console.error('[requests store] fetchAll failed:', e)
      items.value = []
    }
    loaded.value = true
  }

  const patchStatus = async (id: string, status: RequestStatus) => {
    const updated = await $fetch<Request>(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      body: { status }
    })
    const idx = items.value.findIndex((r) => r.id === id)
    if (idx >= 0) items.value[idx] = updated
    return updated
  }

  const byId = (id: string) => items.value.find((r) => r.id === id)

  const byStatus = computed(() => {
    const map = new Map<RequestStatus, Request[]>()
    for (const s of STATUSES) map.set(s, [])
    for (const r of items.value) {
      map.get(r.status)!.push(r)
    }
    return map
  })

  return {
    items,
    loaded,
    fetchAll,
    patchStatus,
    byId,
    byStatus,
    STATUSES
  }
})
