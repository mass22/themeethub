<script setup lang="ts">
definePageMeta({ layout: 'default' })

const eventsStore = useExternalEventsStore()
const communitiesStore = useExternalCommunitiesStore()

onMounted(async () => {
  await Promise.all([eventsStore.fetchAll(), communitiesStore.fetchAll()])
})

const getCommunityName = (communityId: string) => communitiesStore.byId(communityId)?.name ?? communityId
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <h1 class="text-2xl font-bold">{{ $t('externalEvents.title') }}</h1>
      <UButton to="/external-events/new">{{ $t('common.create') }}</UButton>
    </div>
    <div v-if="eventsStore.items.length === 0" class="py-8 text-center text-gray-500">
      {{ $t('externalEvents.empty') }}
    </div>
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="e in eventsStore.items" :key="e.id" :to="`/external-events/${e.id}`" class="block">
        <UCard class="p-4 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-semibold">{{ e.title }}</h3>
          <p class="text-sm text-gray-600">{{ getCommunityName(e.communityId) }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ new Date(e.startAt).toLocaleDateString() }}</p>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
