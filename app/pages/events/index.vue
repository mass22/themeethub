<script setup lang="ts">
import EventCard from '../../components/event/EventCard.vue'

definePageMeta({ layout: 'default' })

const localePath = useLocalePath()
const store = useEventsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ $t('nav.events') }}</h1>
      <UButton :to="localePath('/events/new')">{{ $t('common.create') }}</UButton>
    </div>
    <div v-if="store.items.length > 0" class="grid md:grid-cols-2 gap-4">
      <EventCard v-for="e in store.items" :key="e.id" :event="e" />
    </div>
    <p v-else class="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 px-4 py-6 text-center text-gray-600 dark:text-gray-400">
      {{ $t('events.empty') }}
    </p>
  </div>
</template>