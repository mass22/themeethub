<script setup lang="ts">
import type { PromoItemStatus } from '~/types/promoItem'

definePageMeta({ layout: 'default' })

const store = usePromoItemsStore()
const eventsStore = useEventsStore()
const externalEventsStore = useExternalEventsStore()
const externalCommunitiesStore = useExternalCommunitiesStore()

const filterStatus = ref<PromoItemStatus | ''>('')
const filterChannel = ref('')

onMounted(async () => {
  await Promise.all([store.fetchAll(), eventsStore.fetchAll(), externalEventsStore.fetchAll(), externalCommunitiesStore.fetchAll()])
})

const upcomingExternalEvents = computed(() => {
  const now = new Date().toISOString()
  return externalEventsStore.items
    .filter((e) => e.startAt >= now)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
})

const getCommunityName = (communityId: string) => externalCommunitiesStore.byId(communityId)?.name ?? communityId

const channels = computed(() => {
  const set = new Set(store.items.map((p) => p.channel).filter(Boolean))
  return [...set].sort()
})

const filteredItems = computed(() => {
  let list = store.items
  if (filterStatus.value) list = list.filter((p) => p.status === filterStatus.value)
  if (filterChannel.value) list = list.filter((p) => p.channel === filterChannel.value)
  return list
})

const getEventTitle = (eventId?: string) => (eventId ? eventsStore.byId(eventId)?.title ?? eventId : '—')
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <h1 class="text-2xl font-bold">{{ $t('nav.promo') }}</h1>
      <UButton to="/promo/new">{{ $t('common.create') }}</UButton>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('promo.filterStatus') }}:</span>
      <div class="flex gap-1">
        <UButton
          :variant="filterStatus === '' ? 'solid' : 'soft'"
          size="xs"
          @click="filterStatus = ''"
        >
          {{ $t('calendar.filterAll') }}
        </UButton>
        <UButton
          v-for="s in ['todo', 'in_progress', 'done']"
          :key="s"
          :variant="filterStatus === s ? 'solid' : 'soft'"
          size="xs"
          @click="filterStatus = filterStatus === s ? '' : (s as PromoItemStatus)"
        >
          {{ $t(`status.promo.${s}`) }}
        </UButton>
      </div>
      <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">{{ $t('promo.filterChannel') }}:</span>
      <USelectMenu
        :model-value="filterChannel ? { label: filterChannel, value: filterChannel } : { label: $t('calendar.filterAll'), value: '' }"
        :items="[{ label: $t('calendar.filterAll'), value: '' }, ...channels.map((c) => ({ label: c!, value: c! }))]"
        value-key="value"
        @update:model-value="filterChannel = ($event as { value: string })?.value ?? ''"
      />
    </div>
    <div v-if="filteredItems.length === 0" class="py-8 text-center text-gray-500">
      {{ $t('promo.empty') }}
    </div>
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="p in filteredItems" :key="p.id" :to="`/promo/${p.id}`" class="block">
        <UCard class="p-4 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-semibold">{{ p.title }}</h3>
          <p class="text-sm text-gray-600">{{ getEventTitle(p.eventId) }}</p>
          <UBadge :label="$t(`status.promo.${p.status}`)" :color="p.status === 'done' ? 'green' : p.status === 'in_progress' ? 'blue' : 'gray'" class="mt-2" />
        </UCard>
      </NuxtLink>
    </div>

    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 class="text-lg font-semibold">{{ $t('promo.externalOpportunities') }}</h2>
        <UButton variant="soft" size="sm" to="/external-events">{{ $t('externalEvents.title') }}</UButton>
      </div>
      <div v-if="upcomingExternalEvents.length === 0" class="py-4 text-center text-sm text-gray-500">
        {{ $t('promo.noExternalOpportunities') }}
      </div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="e in upcomingExternalEvents" :key="e.id" class="flex flex-col">
          <UCard class="p-4 hover:shadow-md transition-shadow flex-1">
            <h3 class="font-semibold">{{ e.title }}</h3>
            <p class="text-sm text-gray-600">{{ getCommunityName(e.communityId) }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ new Date(e.startAt).toLocaleDateString() }}</p>
            <UButton :to="`/external-events/${e.id}`" variant="soft" size="xs" class="mt-2">
              {{ $t('promo.planParticipation') }}
            </UButton>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
