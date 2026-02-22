<script setup lang="ts">
import type { LogisticsItem } from '~/types/logisticsItem'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = useLogisticsItemsStore()
const eventsStore = useEventsStore()

const id = route.params.id as string
const item = ref<LogisticsItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    if (!eventsStore.loaded) await eventsStore.fetchAll()
    item.value = store.byId(id) ?? await store.fetchById(id)
    if (!item.value) error.value = 'Logistics item not found'
  } catch {
    error.value = 'Logistics item not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => useRouter().push('/logistics')
const eventTitle = computed(() => item.value ? (eventsStore.byId(item.value.eventId)?.title ?? item.value.eventId) : '')
const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('logistics.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="item" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ item.name }}</h1>
      <UBadge :label="$t(`status.logistics.${item.status}`)" :color="item.status === 'done' ? 'green' : item.status === 'ready' ? 'blue' : 'gray'" class="mb-4" />
      <dl class="space-y-3">
        <div>
          <dt class="text-sm text-gray-500">{{ $t('logistics.form.event') }}</dt>
          <dd><NuxtLink :to="`/events/${item.eventId}`" class="text-primary hover:underline">{{ eventTitle }}</NuxtLink></dd>
        </div>
        <div v-if="item.category">
          <dt class="text-sm text-gray-500">{{ $t('logistics.form.category') }}</dt>
          <dd>{{ item.category }}</dd>
        </div>
        <div v-if="item.notes">
          <dt class="text-sm text-gray-500">{{ $t('logistics.form.notes') }}</dt>
          <dd class="whitespace-pre-wrap">{{ item.notes }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(item.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
