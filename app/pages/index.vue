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
  <div class="space-y-10">
    <!-- Hero section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 dark:from-primary-700 dark:via-primary-600 dark:to-indigo-700 p-8 md:p-10 text-white shadow-xl">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <div class="relative">
        <div class="flex items-center gap-3 mb-4">
          <span class="flex w-12 h-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <UIcon name="i-heroicons-user-group" class="w-7 h-7" />
          </span>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
            {{ t('app.title') }}
          </h1>
        </div>
        <p class="text-lg text-white/90 max-w-2xl mb-6">
          {{ t('home.tagline') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <UButton :to="localePath('/dashboard')" size="lg" class="!bg-white !text-primary-600 hover:!bg-white/90">
            {{ t('home.ctaDashboard') }}
          </UButton>
          <UButton :to="localePath('/events/new')" size="lg" variant="outline" class="!border-white/50 !text-white hover:!bg-white/20">
            {{ t('home.createEvent') }}
          </UButton>
          <UButton :to="localePath('/requests')" size="lg" variant="ghost" class="!text-white/90 hover:!bg-white/10">
            {{ t('home.ctaRequests') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Upcoming events -->
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
              <template v-if="e.location">
                · {{ e.location }}
              </template>
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

    <!-- Inbox summary -->
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
          <UBadge size="xs" color="primary">
            {{ inboxCount(s) }}
          </UBadge>
        </NuxtLink>
      </div>
    </section>

    <!-- Todos: Promo + Logistics -->
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
            <span class="text-slate-500 shrink-0">
              {{ t(`status.logistics.${l.status}`) }}
            </span>
          </li>
          <li v-if="logisticsItems.length === 0" class="text-sm text-slate-500 py-2">
            {{ t('home.noLogisticsTodos') }}
          </li>
        </ul>
      </section>
    </div>

    <!-- Module shortcuts grid -->
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
