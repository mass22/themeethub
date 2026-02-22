<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const store = useSponsorsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.sponsors') }}</h1>
    <UButton to="/sponsors/new" class="mb-4">{{ $t('sponsors.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 gap-4">
    <SponsorCard v-for="s in store.items" :key="s.id" :sponsor="s" />
  </div>
</template>
