<script setup lang="ts">
import SponsorCard from '../../components/sponsor/SponsorCard.vue'

definePageMeta({ layout: 'default' })

const store = useSponsorsStore()

onMounted(async () => {
  await store.fetchAll()
})

const financialSponsors = computed(() =>
  store.items.filter((s) => (s.type ?? 'financial') === 'financial')
)

const communitySponsors = computed(() =>
  store.items.filter((s) => s.type === 'community')
)

const eventFinancialSponsors = computed(() =>
  store.items.filter((s) => s.type === 'financial_event')
)
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.sponsors') }}</h1>
    <UButton to="/sponsors/new" class="mb-4">{{ $t('sponsors.create') }}</UButton>
  </div>
  <div v-if="store.items.length > 0" class="space-y-6">
    <section v-if="financialSponsors.length > 0">
      <h2 class="text-lg font-semibold mb-3">{{ $t('sponsors.types.financial') }}</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <SponsorCard v-for="s in financialSponsors" :key="s.id" :sponsor="s" />
      </div>
    </section>
    <section v-if="communitySponsors.length > 0">
      <h2 class="text-lg font-semibold mb-3">{{ $t('sponsors.types.community') }}</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <SponsorCard v-for="s in communitySponsors" :key="s.id" :sponsor="s" />
      </div>
    </section>
    <section v-if="eventFinancialSponsors.length > 0">
      <h2 class="text-lg font-semibold mb-3">{{ $t('sponsors.types.financial_event') }}</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <SponsorCard v-for="s in eventFinancialSponsors" :key="s.id" :sponsor="s" />
      </div>
    </section>
  </div>
  <p v-else class="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 px-4 py-6 text-center text-gray-600 dark:text-gray-400">
    {{ $t('sponsors.empty') }}
  </p>
</template>
