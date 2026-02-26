<script setup lang="ts">
import type { PromoItem, PromoItemStatus } from '~/types/promoItem'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = usePromoItemsStore()
const eventsStore = useEventsStore()
const { add: addToast } = useToast()

const id = route.params.id as string
const item = ref<PromoItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const statusPatching = ref(false)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    if (!eventsStore.loaded) await eventsStore.fetchAll()
    item.value = store.byId(id) ?? await store.fetchById(id)
    if (!item.value) error.value = 'Promo item not found'
  } catch {
    error.value = 'Promo item not found'
  } finally {
    loading.value = false
  }
})

async function changeStatus(newStatus: PromoItemStatus) {
  if (!item.value || item.value.status === newStatus) return
  statusPatching.value = true
  try {
    const updated = await store.patch(id, { status: newStatus })
    item.value = updated
    addToast({ title: 'Status updated', color: 'success' })
  } catch {
    addToast({ title: 'Error updating status', color: 'error' })
  } finally {
    statusPatching.value = false
  }
}

const goBack = () => useRouter().push('/promo')
const eventTitle = computed(() => {
  if (!item.value?.eventId) return null
  return eventsStore.byId(item.value.eventId)?.title ?? item.value.eventId
})
const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('promo.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="item" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ item.title }}</h1>
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <UBadge :label="$t(`status.promo.${item.status}`)" :color="item.status === 'done' ? 'green' : item.status === 'in_progress' ? 'blue' : 'gray'" />
        <USelectMenu
          :model-value="{ label: $t(`status.promo.${item.status}`), value: item.status }"
          :items="[
            { label: $t('status.promo.todo'), value: 'todo' },
            { label: $t('status.promo.in_progress'), value: 'in_progress' },
            { label: $t('status.promo.done'), value: 'done' }
          ]"
          value-key="value"
          :disabled="statusPatching"
          @update:model-value="changeStatus(($event as { value: PromoItemStatus })?.value ?? item.status)"
        />
      </div>
      <dl class="space-y-3">
        <div v-if="item.eventId && eventTitle">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.event') }}</dt>
          <dd><NuxtLink :to="`/events/${item.eventId}`" class="text-primary hover:underline">{{ eventTitle }}</NuxtLink></dd>
        </div>
        <div v-if="item.channel">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.channel') }}</dt>
          <dd>{{ item.channel }}</dd>
        </div>
        <div v-if="item.dueAt">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.dueAt') }}</dt>
          <dd>{{ formatDate(item.dueAt) }}</dd>
        </div>
        <div v-if="item.copy">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.copy') }}</dt>
          <dd class="whitespace-pre-wrap">{{ item.copy }}</dd>
        </div>
        <div v-if="item.assetLinks?.length">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.assetLinks') }}</dt>
          <dd>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(link, i) in item.assetLinks" :key="i">
                <a :href="link" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ link }}</a>
              </li>
            </ul>
          </dd>
        </div>
        <div v-if="item.notes">
          <dt class="text-sm text-gray-500">{{ $t('promo.form.notes') }}</dt>
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
