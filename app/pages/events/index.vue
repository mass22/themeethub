<script setup lang="ts">
const store = useEventsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <EventCard v-for="e in store.items" :key="e.id" :event="e" />
  </div>
</template>