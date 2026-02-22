<script setup lang="ts">
import type { Sponsor } from '~/types/sponsor'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const sponsorsStore = useSponsorsStore()

const sponsorId = route.params.id as string
const sponsor = ref<Sponsor | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!sponsorsStore.loaded) {
      await sponsorsStore.fetchAll()
    }
    const found = sponsorsStore.byId(sponsorId)
    if (found) {
      sponsor.value = found
    } else {
      sponsor.value = await sponsorsStore.fetchById(sponsorId)
    }
  } catch (e) {
    error.value = 'Sponsor non trouvé'
    sponsor.value = null
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/sponsors')

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
        {{ $t('sponsors.back') }}
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('requests.error') }}</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <div v-else-if="sponsor" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ sponsor.companyName }}</h1>

        <div class="space-y-4">
          <div v-if="sponsor.contactName">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ $t('sponsors.form.contactName') }}</h3>
            <p class="text-gray-900">{{ sponsor.contactName }}</p>
          </div>
          <div v-if="sponsor.contactEmail">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ $t('sponsors.form.contactEmail') }}</h3>
            <p class="text-gray-900">
              <a :href="`mailto:${sponsor.contactEmail}`" class="text-primary hover:underline">{{ sponsor.contactEmail }}</a>
            </p>
          </div>
          <div v-if="sponsor.tier">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Tier</h3>
            <p class="text-gray-900">{{ sponsor.tier }}</p>
          </div>
          <div v-if="sponsor.notes">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ $t('sponsors.form.notes') }}</h3>
            <p class="text-gray-900 whitespace-pre-wrap">{{ sponsor.notes }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ $t('requests.createdAt') }}</h3>
            <p class="text-gray-900">{{ formatDate(sponsor.createdAt) }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ $t('sponsors.updatedAt') }}</h3>
            <p class="text-gray-900">{{ formatDate(sponsor.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
