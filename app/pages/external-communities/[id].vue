<script setup lang="ts">
import type { ExternalCommunity } from '~/types/externalCommunity'

definePageMeta({ layout: 'default' })

const route = useRoute()
const communitiesStore = useExternalCommunitiesStore()
const eventsStore = useExternalEventsStore()

const id = route.params.id as string
const community = ref<ExternalCommunity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

const goBack = () => useRouter().push('/external-communities')
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('externalCommunities.back') }}
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
