<script setup lang="ts">
import type { Event } from '~/types/event'
import type { PromoItem } from '~/types/promoItem'
import type { LogisticsItem } from '~/types/logisticsItem'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()
useHead(() => ({ title: `${t('dashboard.title')} · ${t('app.title')}` }))

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

const now = computed(() => new Date().toISOString())

const LOCATION_MODES = ['in_person', 'online', 'hybrid'] as const
function formatEventLocation(value?: string) {
  if (!value) return ''
  if (!LOCATION_MODES.includes(value as any)) return t('events.locationModes.in_person')
  const key = `events.locationModes.${value}`
  const res = t(key)
  return res === key ? value : res
}

const upcomingEvents = computed<Event[]>(() => {
  return eventsStore.items
    .filter((e) => e.date >= now.value)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)
})

const pastEvents = computed<Event[]>(() => {
  return eventsStore.items
    .filter((e) => e.date < now.value)
    .sort((a, b) => b.date.localeCompare(a.date))
})

// Statistiques globales
const globalStats = computed(() => {
  const events = eventsStore.items
  const past = pastEvents.value
  let totalRegistered = 0
  let totalAttended = 0
  past.forEach((e) => {
    totalRegistered += e.stats?.registered ?? 0
    totalAttended += e.stats?.attended ?? 0
  })
  const withRegistration = past.filter((e) => (e.stats?.registered ?? 0) > 0)
  const avgConversion = withRegistration.length > 0
    ? (totalAttended / totalRegistered) * 100
    : null
  return {
    totalEvents: events.length,
    totalRegistered,
    totalAttended,
    avgConversion
  }
})

// Statistiques par événement (passés)
const eventStats = computed(() =>
  pastEvents.value.map((e) => {
    const reg = e.stats?.registered ?? 0
    const att = e.stats?.attended ?? 0
    const rate = reg > 0 ? Math.round((att / reg) * 100) : null
    return { event: e, registered: reg, attended: att, conversionRate: rate }
  })
)

// Tendance : évolution du taux de présence (ordre chronologique)
const conversionTrend = computed(() => {
  const withData = eventStats.value.filter((s) => s.conversionRate !== null)
  if (withData.length < 2) return null
  const first = withData[withData.length - 1].conversionRate!
  const last = withData[0].conversionRate!
  return { first, last, improving: last >= first }
})

// Insights
const eventsWithoutStats = computed(() =>
  pastEvents.value.filter((e) => !e.stats || (e.stats.registered === 0 && e.stats.attended === 0))
)
const upcomingWithoutSpeakers = computed(() =>
  upcomingEvents.value.filter((e) => !e.speakers?.length)
)
const promoOverdue = computed(() => {
  const today = new Date().toISOString()
  return promoStore.items.filter((p) => p.status !== 'done' && p.dueAt && p.dueAt < today)
})
const logisticsPending = computed(() =>
  logisticsStore.items.filter((l) => l.status !== 'done' && l.status !== 'ready')
)
const bestEvent = computed(() => {
  const withRate = eventStats.value.filter((s) => s.conversionRate !== null)
  return withRate.length > 0 ? withRate.reduce((a, b) => (a.conversionRate! > b.conversionRate! ? a : b)) : null
})

// Axes d'amélioration
const improvementItems = computed(() => {
  const items: { key: string; count?: number; link?: string }[] = []
  if (eventsWithoutStats.value.length > 0) {
    items.push({ key: 'improveFillStats', count: eventsWithoutStats.value.length, link: '/events' })
  }
  if (upcomingWithoutSpeakers.value.length > 0) {
    items.push({ key: 'improveAddSpeakers', count: upcomingWithoutSpeakers.value.length, link: '/events' })
  }
  if (promoOverdue.value.length > 0) {
    items.push({ key: 'improvePromo', count: promoOverdue.value.length, link: '/promo' })
  }
  if (logisticsPending.value.length > 0) {
    items.push({ key: 'improveLogistics', count: logisticsPending.value.length, link: '/logistics' })
  }
  return items
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
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'medium' })
</script>

<template>
  <div class="space-y-8">
    <!-- Hero / Welcome -->
    <div class="rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-transparent dark:from-primary-600/20 dark:via-primary-500/10 p-6 border border-primary-200/50 dark:border-primary-800/30">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('dashboard.title') }}</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {{ t('home.tagline') }}
          </p>
        </div>
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
    </div>

    <!-- Statistiques globales -->
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        {{ t('dashboard.stats.global') }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UCard class="p-5 relative overflow-hidden group">
          <div class="absolute top-3 right-3 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ t('dashboard.stats.totalEvents') }}</p>
          <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ globalStats.totalEvents }}</p>
        </UCard>
        <UCard class="p-5 relative overflow-hidden group">
          <div class="absolute top-3 right-3 w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ t('dashboard.stats.totalRegistered') }}</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ globalStats.totalRegistered }}</p>
        </UCard>
        <UCard class="p-5 relative overflow-hidden group">
          <div class="absolute top-3 right-3 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ t('dashboard.stats.totalAttended') }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ globalStats.totalAttended }}</p>
        </UCard>
        <UCard class="p-5 relative overflow-hidden group">
          <div class="absolute top-3 right-3 w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ t('dashboard.stats.avgConversion') }}</p>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
            {{ globalStats.avgConversion != null ? `${Math.round(globalStats.avgConversion)}%` : '—' }}
          </p>
        </UCard>
      </div>
    </section>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Stats par événement -->
      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {{ t('dashboard.perEvent') }}
        </h2>
        <UCard class="overflow-hidden p-0">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th class="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{{ t('dashboard.stats.pastEvents') }}</th>
                  <th class="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{{ t('events.registered') }}</th>
                  <th class="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{{ t('events.attended') }}</th>
                  <th class="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{{ t('dashboard.stats.avgConversion') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
                <tr
                  v-for="{ event: e, registered, attended, conversionRate } in eventStats"
                  :key="e.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td class="px-4 py-3">
                    <NuxtLink :to="localePath(`/events/${e.id}`)" class="font-medium hover:text-primary-600 truncate block max-w-[200px]">
                      {{ e.title }}
                    </NuxtLink>
                    <span class="text-slate-500 text-xs">{{ formatDate(e.date) }}</span>
                  </td>
                  <td class="text-right px-4 py-3">{{ registered }}</td>
                  <td class="text-right px-4 py-3">{{ attended }}</td>
                  <td class="text-right px-4 py-3">
                    <span v-if="conversionRate !== null" :class="conversionRate >= 70 ? 'text-green-600 dark:text-green-400' : conversionRate >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'">
                      {{ conversionRate }}%
                    </span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                </tr>
                <tr v-if="eventStats.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-slate-500">
                    {{ t('dashboard.noPastEvents') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UCard>
      </section>

      <!-- Insights & Tendances -->
      <section class="space-y-4">
        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {{ t('dashboard.insights') }}
          </h2>
          <ul class="space-y-2">
            <li v-if="bestEvent" class="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <UIcon name="i-heroicons-trophy" class="shrink-0" />
              <span>
                {{ t('dashboard.insightBestEvent') }}:
                <NuxtLink :to="localePath(`/events/${bestEvent.event.id}`)" class="font-medium hover:underline">
                  {{ bestEvent.event.title }}
                </NuxtLink>
                ({{ bestEvent.conversionRate }}%)
              </span>
            </li>
            <li v-if="eventsWithoutStats.length > 0" class="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
              <UIcon name="i-heroicons-chart-bar" class="shrink-0" />
              <span>{{ eventsWithoutStats.length }} {{ t('dashboard.insightNoStats') }}</span>
            </li>
            <li v-if="upcomingWithoutSpeakers.length > 0" class="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
              <UIcon name="i-heroicons-user-group" class="shrink-0" />
              <span>{{ upcomingWithoutSpeakers.length }} {{ t('dashboard.insightNoSpeakers') }}</span>
            </li>
            <li v-if="promoOverdue.length > 0" class="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
              <UIcon name="i-heroicons-clock" class="shrink-0" />
              <span>{{ promoOverdue.length }} {{ t('dashboard.insightPromoOverdue') }}</span>
            </li>
            <li v-if="logisticsPending.length > 0" class="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <UIcon name="i-heroicons-clipboard-document-list" class="shrink-0" />
              <span>{{ logisticsPending.length }} {{ t('dashboard.insightLogisticsPending') }}</span>
            </li>
            <li v-if="!bestEvent && eventsWithoutStats.length === 0 && upcomingWithoutSpeakers.length === 0 && promoOverdue.length === 0 && logisticsPending.length === 0" class="text-slate-500 py-2">
              {{ t('dashboard.noInsights') }}
            </li>
          </ul>
        </div>

        <!-- Tendances -->
        <div v-if="conversionTrend">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {{ t('dashboard.trends') }}
          </h2>
          <UCard class="p-4">
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">{{ t('dashboard.trendConversion') }}</p>
            <div class="flex items-center gap-2">
              <span class="text-lg font-medium">{{ conversionTrend.first }}%</span>
              <UIcon name="i-heroicons-arrow-right" class="text-slate-400" />
              <span class="text-lg font-semibold" :class="conversionTrend.improving ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                {{ conversionTrend.last }}%
              </span>
              <UIcon v-if="conversionTrend.improving" name="i-heroicons-arrow-trending-up" class="text-green-600 dark:text-green-400" />
              <UIcon v-else name="i-heroicons-arrow-trending-down" class="text-amber-600 dark:text-amber-400" />
            </div>
            <p class="text-xs text-slate-500 mt-1">
              {{ conversionTrend.improving ? t('dashboard.trendUp') : t('dashboard.trendDown') }}
            </p>
          </UCard>
        </div>

        <!-- Axes d'amélioration -->
        <div v-if="improvementItems.length > 0">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {{ t('dashboard.improvements') }}
          </h2>
          <ul class="space-y-2">
            <li
              v-for="item in improvementItems"
              :key="item.key"
              class="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
            >
              <span class="text-sm">{{ t(`dashboard.${item.key}`) }}</span>
              <UButton v-if="item.link" :to="localePath(item.link)" size="xs" variant="soft">
                {{ t('dashboard.see') }}
              </UButton>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        {{ t('home.upcomingEvents') }}
      </h2>
      <ul class="space-y-2">
        <li
          v-for="e in upcomingEvents"
          :key="e.id"
          class="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow transition-shadow"
        >
          <div class="min-w-0 flex-1">
            <span class="font-medium">{{ e.title }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400 ml-2">
              {{ new Date(e.date).toLocaleDateString() }}
              <template v-if="e.location"> · {{ formatEventLocation(e.location) }}</template>
            </span>
          </div>
          <UButton :to="localePath(`/events/${e.id}`)" variant="soft" size="xs">
            {{ t('events.open') }}
          </UButton>
        </li>
        <li v-if="upcomingEvents.length === 0" class="text-sm text-slate-500 py-3">
          {{ t('home.noUpcomingEvents') }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        {{ t('home.inboxSummary') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="s in INBOX_STATUSES"
          :key="s"
          :to="requestsLink(s)"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all"
        >
          <span class="text-sm font-medium">{{ t(`requests.status.${s}`) }}</span>
          <UBadge size="xs" color="primary">{{ inboxCount(s) }}</UBadge>
        </NuxtLink>
      </div>
    </section>

    <div class="grid md:grid-cols-2 gap-6">
      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {{ t('home.todosPromo') }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="p in promoItems"
            :key="p.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm"
          >
            <NuxtLink :to="localePath(`/promo/${p.id}`)" class="truncate hover:underline flex-1 min-w-0">
              {{ p.title }}
            </NuxtLink>
            <span class="text-slate-500 shrink-0">
              {{ p.dueAt ? new Date(p.dueAt).toLocaleDateString() : '—' }}
            </span>
          </li>
          <li v-if="promoItems.length === 0" class="text-sm text-slate-500 py-2">
            {{ t('home.noPromoTodos') }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {{ t('home.todosLogistics') }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="l in logisticsItems"
            :key="l.id"
            class="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm"
          >
            <NuxtLink :to="localePath(`/logistics/${l.id}`)" class="truncate hover:underline flex-1 min-w-0">
              {{ l.name }}
            </NuxtLink>
            <span class="text-slate-500 shrink-0">{{ t(`status.logistics.${l.status}`) }}</span>
          </li>
          <li v-if="logisticsItems.length === 0" class="text-sm text-slate-500 py-2">
            {{ t('home.noLogisticsTodos') }}
          </li>
        </ul>
      </section>
    </div>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        {{ t('home.modules') }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <NuxtLink
          v-for="link in MODULE_LINKS"
          :key="link.to"
          :to="localePath(link.to)"
          class="flex items-center justify-center p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all text-center font-medium text-slate-700 dark:text-slate-300"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
