<script setup lang="ts">
import type { Contractor } from '~/types/contractor'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = useContractorsStore()

const id = route.params.id as string
const contractor = ref<Contractor | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    contractor.value = store.byId(id) ?? await store.fetchById(id)
    if (!contractor.value) error.value = 'Contractor not found'
  } catch {
    error.value = 'Contractor not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => useRouter().push('/contractors')

const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('contractors.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="contractor" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ contractor.name }}</h1>
      <dl class="space-y-3">
        <div v-if="contractor.role">
          <dt class="text-sm text-gray-500">{{ $t('contractors.form.role') }}</dt>
          <dd>{{ contractor.role }}</dd>
        </div>
        <div v-if="contractor.rate">
          <dt class="text-sm text-gray-500">{{ $t('contractors.rate') }}</dt>
          <dd>{{ contractor.rate }}</dd>
        </div>
        <div v-if="contractor.notes">
          <dt class="text-sm text-gray-500">{{ $t('contractors.form.notes') }}</dt>
          <dd class="whitespace-pre-wrap">{{ contractor.notes }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(contractor.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
