<script setup lang="ts">
import type { Event } from '~~/types/event'

defineProps<{ event: Event }>()
const localePath = useLocalePath()
</script>

<template>
  <UCard variant="subtle" class="overflow-hidden">
  <template #header>
      <div class="p-4 pb-0">
        <h3 class="text-lg font-semibold">{{ event.title }}</h3>
        <p class="text-xs mt-1" :class="event.publishedAt ? 'text-green-600' : 'text-amber-600'">
          {{ event.publishedAt ? 'Publié' : 'Brouillon' }}
        </p>
      </div>
    </template>
    <div class="px-4">
      <p class="text-sm opacity-70">{{ new Date(event.date).toLocaleString() }}</p>
    </div>
    <template #footer>
      <div class="p-4 pt-2">
        <UButton :to="localePath(`/events/${event.id}`)" variant="soft">{{ $t('events.open') }}</UButton>
      </div>
    </template>
  </UCard>
</template>