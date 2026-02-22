<script setup lang="ts">
import type { Venue } from '~/types/venue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const store = useVenuesStore()

const id = route.params.id as string
const venue = ref<Venue | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    venue.value = store.byId(id) ?? await store.fetchById(id)
    if (!venue.value) error.value = 'Venue not found'
  } catch {
    error.value = 'Venue not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/venues')

const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('venues.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="venue" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ venue.name }}</h1>
      <dl class="space-y-3">
        <div v-if="venue.address">
          <dt class="text-sm text-gray-500">{{ $t('venues.form.address') }}</dt>
          <dd>{{ venue.address }}</dd>
        </div>
        <div v-if="venue.capacity">
          <dt class="text-sm text-gray-500">{{ $t('venues.capacity') }}</dt>
          <dd>{{ venue.capacity }}</dd>
        </div>
        <div v-if="venue.notes">
          <dt class="text-sm text-gray-500">{{ $t('venues.form.notes') }}</dt>
          <dd class="whitespace-pre-wrap">{{ venue.notes }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(venue.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
