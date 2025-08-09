<script setup lang="ts">
const { t } = useI18n()
const eventsStore = useEventsStore()

onMounted(async () => {
  await eventsStore.fetchAll()
})
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-2xl font-bold">{{ t('dashboard.title') }}</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <EventCard v-for="e in eventsStore.items" :key="e.id" :event="e" />
    </div>
  </section>
</template>