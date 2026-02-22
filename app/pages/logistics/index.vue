<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useLogisticsItemsStore()
const eventsStore = useEventsStore()

onMounted(async () => {
  await Promise.all([store.fetchAll(), eventsStore.fetchAll()])
})

const getEventTitle = (eventId: string) => eventsStore.byId(eventId)?.title ?? eventId
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.logistics') }}</h1>
    <UButton to="/logistics/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="l in store.items" :key="l.id" :to="`/logistics/${l.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ l.name }}</h3>
        <p class="text-sm text-gray-600">{{ getEventTitle(l.eventId) }}</p>
        <UBadge :label="$t(`status.logistics.${l.status}`)" :color="l.status === 'done' ? 'green' : l.status === 'ready' ? 'blue' : 'gray'" class="mt-2" />
      </UCard>
    </NuxtLink>
  </div>
</template>
