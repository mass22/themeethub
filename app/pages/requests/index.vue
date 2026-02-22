<script setup lang="ts">
import type { RequestStatus, RequestType } from '~/types/request'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

useHead(() => ({ title: `${t('requests.title')} · ${t('app.title')}` }))
const store = useRequestsStore()

const TYPE_TABS: { value: RequestType | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'requests.tabs.all' },
  { value: 'sponsor', labelKey: 'requests.tabs.sponsors' },
  { value: 'speaker', labelKey: 'requests.tabs.speakers' }
]

const STATUSES: RequestStatus[] = ['new', 'exploring_call', 'validated', 'in_progress', 'closed', 'rejected']

const selectedType = ref<RequestType | 'all'>('all')
const selectedStatus = ref<RequestStatus>('new')

function syncFromQuery() {
  const status = route.query.status
  if (status && STATUSES.includes(status as RequestStatus)) {
    selectedStatus.value = status as RequestStatus
  }
}

onMounted(async () => {
  syncFromQuery()
  await store.fetchAll()
})

watch(() => route.query.status, syncFromQuery)

const currentRequests = computed(() => {
  const byStatus = store.byStatus.get(selectedStatus.value) ?? []
  if (selectedType.value === 'all') return byStatus
  return byStatus.filter((r) => r.type === selectedType.value)
})
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('requests.title') }}</h1>

    <div class="flex flex-wrap gap-2 mb-4">
      <UButton
        v-for="tab in TYPE_TABS"
        :key="tab.value"
        :variant="selectedType === tab.value ? 'solid' : 'soft'"
        @click="selectedType = tab.value"
      >
        {{ t(tab.labelKey) }}
      </UButton>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      <UButton
        v-for="s in STATUSES"
        :key="s"
        :variant="selectedStatus === s ? 'solid' : 'soft'"
        size="sm"
        @click="router.replace({ path: route.path, query: { ...route.query, status: s } })"
      >
        {{ t(`requests.status.${s}`) }}
      </UButton>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RequestCard v-for="r in currentRequests" :key="r.id" :request="r" />
    </div>

    <p v-if="currentRequests.length === 0" class="text-gray-500 py-8 text-center">
      {{ t('requests.empty') }}
    </p>
  </section>
</template>
