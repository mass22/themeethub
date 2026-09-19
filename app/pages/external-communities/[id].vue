<script setup lang="ts">
import type { ExternalCommunity } from '~~/types/externalCommunity'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const communitiesStore = useExternalCommunitiesStore()
const eventsStore = useExternalEventsStore()
const { add: addToast } = useToast()

const id = route.params.id as string
const community = ref<ExternalCommunity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const deleting = ref(false)
const publishSaving = ref(false)

const isPublished = computed(() => Boolean(community.value?.publishedAt))

async function togglePublish() {
  if (!community.value || publishSaving.value) return
  publishSaving.value = true
  const willPublish = !isPublished.value
  try {
    const updated = await communitiesStore.patch(id, {
      publishedAt: willPublish ? new Date().toISOString() : null
    })
    community.value = updated
    addToast({ title: willPublish ? 'Communauté publiée' : 'Communauté dépubliée', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de la publication', color: 'error' })
  } finally {
    publishSaving.value = false
  }
}

const communityEvents = computed(() =>
  eventsStore.items.filter((e) => e.communityId === id)
)

onMounted(async () => {
  try {
    if (!communitiesStore.loaded) await communitiesStore.fetchAll()
    community.value = communitiesStore.byId(id) ?? await communitiesStore.fetchById(id)
    if (!community.value) {
      error.value = 'Community not found'
    } else {
      await eventsStore.fetchAll(id)
    }
  } catch {
    error.value = 'Community not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/external-communities')

async function deleteCommunity() {
  if (!community.value || deleting.value) return
  if (!window.confirm('Supprimer cette communauté et ses événements externes ?')) return
  deleting.value = true
  try {
    await communitiesStore.remove(id)
    addToast({ title: 'Communauté supprimée', color: 'success' })
    await router.push('/external-communities')
  } catch {
    addToast({ title: 'Impossible de supprimer cette communauté', color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('externalCommunities.back') }}
    </UButton>
    <UButton color="error" variant="soft" class="mb-4 ml-2" :loading="deleting" @click="deleteCommunity">
      Supprimer
    </UButton>
    <UButton
      class="mb-4 ml-2"
      :color="isPublished ? 'neutral' : 'primary'"
      :variant="isPublished ? 'outline' : 'solid'"
      :loading="publishSaving"
      @click="togglePublish"
    >
      {{ isPublished ? 'Dépublier' : 'Publier' }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="community" class="space-y-6">
      <UCard class="max-w-2xl">
        <h1 class="text-2xl font-bold mb-4">{{ community.name }}</h1>
        <dl class="space-y-3">
          <div v-if="community.url">
            <dt class="text-sm text-gray-500">{{ $t('externalCommunities.form.url') }}</dt>
            <dd>
              <a :href="community.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ community.url }}</a>
            </dd>
          </div>
          <div v-if="community.notes">
            <dt class="text-sm text-gray-500">{{ $t('externalCommunities.form.notes') }}</dt>
            <dd class="whitespace-pre-wrap">{{ community.notes }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">Statut</dt>
            <dd class="mt-1">
              <span :class="isPublished ? 'text-green-600' : 'text-amber-600'" class="text-sm font-medium">
                {{ isPublished ? 'Publiée' : 'Non publiée (brouillon)' }}
              </span>
            </dd>
          </div>
        </dl>
      </UCard>

      <div>
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">{{ $t('externalCommunities.events') }}</h2>
          <UButton size="sm" :to="`/external-events/new?communityId=${id}`">{{ $t('common.create') }}</UButton>
        </div>
        <div v-if="communityEvents.length === 0" class="text-sm text-gray-500 py-4">
          {{ $t('externalCommunities.noEvents') }}
        </div>
        <div v-else class="grid md:grid-cols-2 gap-4">
          <NuxtLink v-for="e in communityEvents" :key="e.id" :to="`/external-events/${e.id}`" class="block">
            <UCard class="p-3 hover:shadow-md transition-shadow">
              <h3 class="font-semibold">{{ e.title }}</h3>
              <p class="text-sm text-gray-600">{{ new Date(e.startAt).toLocaleDateString() }}</p>
            </UCard>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
