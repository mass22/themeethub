<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useSocialPostsStore()
const eventsStore = useEventsStore()

onMounted(async () => {
  await Promise.all([store.fetchAll(), eventsStore.fetchAll()])
})

const getEventTitle = (eventId: string) => eventsStore.byId(eventId)?.title ?? eventId
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.social') }}</h1>
    <UButton to="/social/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="s in store.items" :key="s.id" :to="`/social/${s.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ s.platform || 'Social post' }}</h3>
        <p class="text-sm text-gray-600">{{ getEventTitle(s.eventId) }}</p>
        <p v-if="s.copy" class="text-sm text-gray-700 line-clamp-2 mt-1">{{ s.copy }}</p>
        <UBadge :label="$t(`status.social.${s.status}`)" :color="s.status === 'posted' ? 'green' : s.status === 'scheduled' ? 'blue' : 'gray'" class="mt-2" />
      </UCard>
    </NuxtLink>
  </div>
</template>
