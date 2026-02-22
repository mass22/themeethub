<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = usePromoItemsStore()
const eventsStore = useEventsStore()

onMounted(async () => {
  await Promise.all([store.fetchAll(), eventsStore.fetchAll()])
})

const getEventTitle = (eventId: string) => eventsStore.byId(eventId)?.title ?? eventId
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.promo') }}</h1>
    <UButton to="/promo/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="p in store.items" :key="p.id" :to="`/promo/${p.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ p.title }}</h3>
        <p class="text-sm text-gray-600">{{ getEventTitle(p.eventId) }}</p>
        <UBadge :label="$t(`status.promo.${p.status}`)" :color="p.status === 'done' ? 'green' : p.status === 'in_progress' ? 'blue' : 'gray'" class="mt-2" />
      </UCard>
    </NuxtLink>
  </div>
</template>
