import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SocialPost } from '~/types/socialPost'

export const useSocialPostsStore = defineStore('socialPosts', () => {
  const items = ref<SocialPost[]>([])
  const loaded = ref(false)

  const fetchAll = async () => {
    if (loaded.value) return
    items.value = await $fetch<SocialPost[]>('/api/social_posts')
    loaded.value = true
  }

  const fetchById = async (id: string) => {
    const s = await $fetch<SocialPost>(`/api/social_posts/${id}`)
    const idx = items.value.findIndex((x) => x.id === id)
    if (idx >= 0) items.value[idx] = s
    else items.value.push(s)
    return s
  }

  const create = async (payload: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await $fetch<SocialPost>('/api/social_posts', { method: 'POST', body: payload })
    items.value.push(created)
    return created
  }

  const byId = (id: string) => items.value.find((s) => s.id === id)

  return { items, loaded, fetchAll, fetchById, create, byId }
})
