<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const store = useEventsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.events') }}</h1>
    <UButton to="/events/new" class="mb-4">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 gap-4">
    <EventCard v-for="e in store.items" :key="e.id" :event="e" />
  </div>
</template>