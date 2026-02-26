<script setup lang="ts">
import type { Event } from '~/types/event'
import type { PromoItem } from '~/types/promoItem'
import type { LogisticsItem } from '~/types/logisticsItem'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const localePath = useLocalePath()
useHead(() => ({ title: `${t('home.commandCenter')} · ${t('app.title')}` }))

const eventsStore = useEventsStore()
const requestsStore = useRequestsStore()
const promoStore = usePromoItemsStore()
const logisticsStore = useLogisticsItemsStore()

const INBOX_STATUSES = ['new', 'exploring_call', 'validated'] as const
const MODULE_LINKS = [
  { to: '/events', key: 'nav.events' },
  { to: '/calendar', key: 'nav.calendar' },
  { to: '/contacts', key: 'nav.contacts' },
  { to: '/venues', key: 'nav.venues' },
  { to: '/speakers', key: 'nav.speakers' },
  { to: '/sponsors', key: 'nav.sponsors' },
  { to: '/promo', key: 'nav.promo' },
  { to: '/logistics', key: 'nav.logistics' },
  { to: '/contractors', key: 'nav.contractors' },
  { to: '/tools', key: 'nav.tools' },
  { to: '/social', key: 'nav.social' },
  { to: '/requests', key: 'nav.requests' }
]

onMounted(async () => {
  await Promise.all([
    eventsStore.fetchAll(),
    requestsStore.fetchAll(),
    promoStore.fetchAll(),
    logisticsStore.fetchAll()
  ])
})

const upcomingEvents = computed<Event[]>(() => {
  const now = new Date().toISOString()
  return eventsStore.items
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)
})

const inboxCount = (status: string) => {
  return requestsStore.byStatus.get(status as any)?.length ?? 0
}

const promoDueThreshold = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString()
})

const promoItems = computed<PromoItem[]>(() => {
  try {
    return promoStore.items
      .filter((p) => p.status !== 'done')
      .filter((p) => p.dueAt && p.dueAt <= promoDueThreshold.value)
      .sort((a, b) => (a.dueAt || '').localeCompare(b.dueAt || ''))
      .slice(0, 5)
  } catch {
    return []
  }
})

const logisticsItems = computed<LogisticsItem[]>(() => {
  try {
    return logisticsStore.items
      .filter((l) => l.status !== 'done' && l.status !== 'ready')
      .slice(0, 5)
  } catch {
    return []
  }
})

const requestsLink = (status: string) => localePath(`/requests?status=${status}`)
</script>

<template>
  <div class="space-y-8 py-6">
    <!-- Top section: title + quick actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-3xl font-bold">
        {{ t('app.title') }}
      </h1>
      <div class="flex flex-wrap gap-2">
        <UButton :to="localePath('/events/new')" color="primary" size="sm">
          {{ t('home.createEvent') }}
        </UButton>
        <UButton :to="localePath('/requests')" variant="soft" size="sm">
          {{ t('home.inbox') }}
        </UButton>
        <UButton :to="localePath('/calendar')" variant="soft" size="sm">
          {{ t('home.calendar') }}
        </UButton>
      </div>
    </div>

    <!-- Upcoming events -->
    <section>
      <h2 class="text-lg font-semibold mb-3">
        {{ t('home.upcomingEvents') }}
      </h2>
      <ul class="space-y-2">
        <li
          v-for="e in upcomingEvents"
          :key="e.id"
          class="flex items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          <div class="min-w-0 flex-1">
            <span class="font-medium">{{ e.title }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {{ new Date(e.date).toLocaleDateString() }}
              <template v-if="e.location">
                · {{ e.location }}
              </template>
            </span>
          </div>
          <UButton :to="localePath(`/events/${e.id}`)" variant="soft" size="xs">
            {{ t('events.open') }}
          </UButton>
        </li>
        <li v-if="upcomingEvents.length === 0" class="text-sm text-gray-500 py-3">
          {{ t('home.noUpcomingEvents') }}
        </li>
      </ul>
    </section>

    <!-- Inbox summary -->
    <section>
      <h2 class="text-lg font-semibold mb-3">
        {{ t('home.inboxSummary') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="s in INBOX_STATUSES"
          :key="s"
          :to="requestsLink(s)"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span class="text-sm font-medium">{{ t(`requests.status.${s}`) }}</span>
          <UBadge size="xs" color="primary">
            {{ inboxCount(s) }}
          </UBadge>
        </NuxtLink>
      </div>
    </section>

    <!-- Todos: Promo + Logistics -->
    <div class="grid md:grid-cols-2 gap-6">
      <section>
        <h2 class="text-lg font-semibold mb-3">
          {{ t('home.todosPromo') }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="p in promoItems"
            :key="p.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm"
          >
            <NuxtLink :to="localePath(`/promo/${p.id}`)" class="truncate hover:underline flex-1 min-w-0">
              {{ p.title }}
            </NuxtLink>
            <span class="text-gray-500 shrink-0">
              {{ p.dueAt ? new Date(p.dueAt).toLocaleDateString() : '—' }}
            </span>
          </li>
          <li v-if="promoItems.length === 0" class="text-sm text-gray-500 py-2">
            {{ t('home.noPromoTodos') }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3">
          {{ t('home.todosLogistics') }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="l in logisticsItems"
            :key="l.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm"
          >
            <NuxtLink :to="localePath(`/logistics/${l.id}`)" class="truncate hover:underline flex-1 min-w-0">
              {{ l.name }}
            </NuxtLink>
            <span class="text-gray-500 shrink-0">
              {{ t(`status.logistics.${l.status}`) }}
            </span>
          </li>
          <li v-if="logisticsItems.length === 0" class="text-sm text-gray-500 py-2">
            {{ t('home.noLogisticsTodos') }}
          </li>
        </ul>
      </section>
    </div>

    <!-- Module shortcuts grid -->
    <section>
      <h2 class="text-lg font-semibold mb-3">
        {{ t('home.modules') }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <NuxtLink
          v-for="link in MODULE_LINKS"
          :key="link.to"
          :to="localePath(link.to)"
          class="flex items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center font-medium"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
