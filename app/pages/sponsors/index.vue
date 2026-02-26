<script setup lang="ts">
import SponsorCard from '../../components/sponsor/SponsorCard.vue'

definePageMeta({ layout: 'default' })

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
  <div v-if="store.items.length > 0" class="grid md:grid-cols-2 gap-4">
    <SponsorCard v-for="s in store.items" :key="s.id" :sponsor="s" />
  </div>
  <p v-else class="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 px-4 py-6 text-center text-gray-600 dark:text-gray-400">
    {{ $t('sponsors.empty') }}
  </p>
</template>
