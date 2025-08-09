<script setup lang="ts">
import type { Event } from '~/types/event';
defineProps<{ event: Event }>()
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ event.title }}</h3>
        <p class="text-sm opacity-70">{{ new Date(event.date).toLocaleString() }}</p>
      </div>
      <UButton :to="`/events/${event.id}`" variant="soft">{{ $t('events.open') }}</UButton>
    </div>
  </UCard>
</template>