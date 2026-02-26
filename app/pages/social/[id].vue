<script setup lang="ts">
import type { SocialPost, SocialPostStatus } from '~/types/socialPost'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = useSocialPostsStore()
const eventsStore = useEventsStore()
const { add: addToast } = useToast()

const id = route.params.id as string
const post = ref<SocialPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const statusPatching = ref(false)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    if (!eventsStore.loaded) await eventsStore.fetchAll()
    post.value = store.byId(id) ?? await store.fetchById(id)
    if (!post.value) error.value = 'Social post not found'
  } catch {
    error.value = 'Social post not found'
  } finally {
    loading.value = false
  }
})

async function changeStatus(newStatus: SocialPostStatus) {
  if (!post.value || post.value.status === newStatus) return
  statusPatching.value = true
  try {
    const updated = await store.patch(id, { status: newStatus })
    post.value = updated
    addToast({ title: 'Status updated', color: 'success' })
  } catch {
    addToast({ title: 'Error updating status', color: 'error' })
  } finally {
    statusPatching.value = false
  }
}

const goBack = () => useRouter().push('/social')
const eventTitle = computed(() => {
  if (!post.value?.eventId) return null
  return eventsStore.byId(post.value.eventId)?.title ?? post.value.eventId
})
const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('social.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="post" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ post.platform || $t('social.postTitle') }}</h1>
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <UBadge :label="$t(`status.social.${post.status}`)" :color="post.status === 'posted' ? 'green' : post.status === 'scheduled' ? 'blue' : 'gray'" />
        <USelectMenu
          :model-value="{ label: $t(`status.social.${post.status}`), value: post.status }"
          :items="[
            { label: $t('status.social.draft'), value: 'draft' },
            { label: $t('status.social.scheduled'), value: 'scheduled' },
            { label: $t('status.social.posted'), value: 'posted' }
          ]"
          value-key="value"
          :disabled="statusPatching"
          @update:model-value="changeStatus(($event as { value: SocialPostStatus })?.value ?? post.status)"
        />
      </div>
      <dl class="space-y-3">
        <div v-if="post.eventId && eventTitle">
          <dt class="text-sm text-gray-500">{{ $t('social.form.event') }}</dt>
          <dd><NuxtLink :to="`/events/${post.eventId}`" class="text-primary hover:underline">{{ eventTitle }}</NuxtLink></dd>
        </div>
        <div v-if="post.copy">
          <dt class="text-sm text-gray-500">{{ $t('social.form.copy') }}</dt>
          <dd class="whitespace-pre-wrap">{{ post.copy }}</dd>
        </div>
        <div v-if="post.scheduledAt">
          <dt class="text-sm text-gray-500">{{ $t('social.form.scheduledAt') }}</dt>
          <dd>{{ formatDate(post.scheduledAt) }}</dd>
        </div>
        <div v-if="post.assetLinks?.length">
          <dt class="text-sm text-gray-500">{{ $t('social.form.assetLinks') }}</dt>
          <dd>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(link, i) in post.assetLinks" :key="i">
                <a :href="link" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ link }}</a>
              </li>
            </ul>
          </dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(post.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
