<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import enLocale from '@fullcalendar/core/locales/en-gb'
import type { CalendarItem, CalendarItemType } from '~/types/calendarItem'
import type { EventClickArg } from '@fullcalendar/core'

/** Couleurs FullCalendar par type — appliquées via la propriété `color` (priorité sur le CSS par défaut) */
const TYPE_COLORS: Record<CalendarItemType, string> = {
  event: '#3b82f6',
  promo: '#a855f7',
  logistics: '#f97316',
  social: '#22c55e',
  external_event: '#64748b',
  participation: '#0ea5e9'
}

const { t, locale } = useI18n()
const localePath = useLocalePath()

const loading = ref(false)
const hasFetched = ref(false)
const eventsCount = ref(0)
const isEmpty = computed(() => hasFetched.value && !loading.value && eventsCount.value === 0)

const fullCalendarLocale = computed(() => (locale.value === 'fr' ? 'fr' : 'en-gb'))

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  contentHeight: 500,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  buttonText: {
    today: t('calendar.today'),
    month: t('calendar.rangeMonth'),
    week: t('calendar.rangeWeek')
  },
  locales: [frLocale, enLocale],
  locale: fullCalendarLocale.value,
  editable: false,
  selectable: false,
  events: loadEvents,
  eventClick: onEventClick,
  eventClassNames: eventClassNames
}))

function eventClassNames(arg: { extendedProps?: { type?: CalendarItemType } }) {
  const type = arg.extendedProps?.type ?? 'event'
  return `fc-event-type-${type}`
}

async function loadEvents(info: { start: Date; end: Date }, successCallback: (events: any[]) => void, _failureCallback: (error: Error) => void) {
  loading.value = true
  hasFetched.value = false
  try {
    const params = new URLSearchParams({
      from: info.start.toISOString(),
      to: info.end.toISOString()
    })
    const items = await $fetch<CalendarItem[]>(`/api/calendar?${params}`)
    const fcEvents = items.map((item) => ({
      id: item.id,
      title: item.title,
      start: item.startAt,
      end: item.endAt,
      color: TYPE_COLORS[item.type],
      extendedProps: {
        type: item.type,
        href: item.href,
        status: item.status
      }
    }))
    eventsCount.value = fcEvents.length
    successCallback(fcEvents)
  } catch (e) {
    console.error('[CalendarView] loadEvents failed:', e)
    eventsCount.value = 0
    successCallback([])
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

function onEventClick(arg: EventClickArg) {
  const href = arg.event.extendedProps?.href as string | undefined
  if (href) {
    navigateTo(localePath(href))
  }
}
</script>

<template>
  <section class="space-y-4">
    <div v-if="isEmpty" class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      {{ t('calendar.empty') }}
    </div>

    <div v-if="loading" class="mb-2 text-sm text-gray-500">
      {{ t('calendar.loading') }}
    </div>
    <div class="mb-4 flex flex-wrap gap-4 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-blue-500" />
        {{ t('calendar.legend.event') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-purple-500" />
        {{ t('calendar.legend.promo') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-orange-500" />
        {{ t('calendar.legend.logistics') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-green-500" />
        {{ t('calendar.legend.social') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-slate-500" />
        {{ t('calendar.legend.external_event') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-sky-500" />
        {{ t('calendar.legend.participation') }}
      </span>
    </div>
    <div class="fc-wrapper min-h-[500px] w-full">
      <FullCalendar :options="calendarOptions" />
    </div>
  </section>
</template>

<style scoped>
.fc-wrapper :deep(.fc) {
  width: 100%;
}
/* Couleurs par type d'item */
.fc-wrapper :deep(.fc-event-type-event) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border-color: #1d4ed8 !important;
}
.fc-wrapper :deep(.fc-event-type-promo) {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%) !important;
  border-color: #6d28d9 !important;
}
.fc-wrapper :deep(.fc-event-type-logistics) {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
  border-color: #c2410c !important;
}
.fc-wrapper :deep(.fc-event-type-social) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  border-color: #15803d !important;
}
.fc-wrapper :deep(.fc-event-type-external_event) {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%) !important;
  border-color: #334155 !important;
}
.fc-wrapper :deep(.fc-event-type-participation) {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
  border-color: #0369a1 !important;
}
</style>
