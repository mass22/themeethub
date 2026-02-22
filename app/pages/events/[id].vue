<script setup lang="ts">
import type { Event } from '~/types/event'
import type { Speaker } from '~/types/speaker'
import type { PromoItem } from '~/types/promoItem'
import type { LogisticsItem } from '~/types/logisticsItem'
import type { SocialPost } from '~/types/socialPost'

const route = useRoute()
const router = useRouter()
const eventId = route.params.id as string

const eventsStore = useEventsStore()
const speakersStore = useSpeakersStore()
const venuesStore = useVenuesStore()
const sponsorsStore = useSponsorsStore()
const promoStore = usePromoItemsStore()
const logisticsStore = useLogisticsItemsStore()
const contractorsStore = useContractorsStore()
const toolsStore = useToolsStore()
const socialStore = useSocialPostsStore()

const event = ref<Event | null>(null)
const speakers = ref<Speaker[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const linkedPromo = computed<PromoItem[]>(() =>
  eventId ? promoStore.items.filter((p) => p.eventId === eventId) : []
)
const linkedLogistics = computed<LogisticsItem[]>(() =>
  eventId ? logisticsStore.items.filter((l) => l.eventId === eventId) : []
)
const linkedSocial = computed<SocialPost[]>(() =>
  eventId ? socialStore.items.filter((s) => s.eventId === eventId) : []
)

onMounted(async () => {
  try {
    await Promise.all([
      eventsStore.fetchAll(),
      speakersStore.fetchAll(),
      venuesStore.fetchAll(),
      sponsorsStore.fetchAll(),
      promoStore.fetchAll(),
      logisticsStore.fetchAll(),
      contractorsStore.fetchAll(),
      toolsStore.fetchAll(),
      socialStore.fetchAll()
    ])

    const foundEvent = eventsStore.byId(eventId)
    if (!foundEvent) {
      error.value = 'Événement non trouvé'
      event.value = null
      speakers.value = []
      return
    }
    event.value = foundEvent
    speakers.value = foundEvent.speakers
      .map((speakerId: string) => speakersStore.byId(speakerId))
      .filter((s): s is Speaker => s !== undefined)
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'événement'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/events')

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const addPromoLink = computed(() => ({ path: '/promo/new', query: { eventId } }))
const addLogisticsLink = computed(() => ({ path: '/logistics/new', query: { eventId } }))
const addSocialLink = computed(() => ({ path: '/social/new', query: { eventId } }))
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UButton @click="goBack" variant="soft" icon="i-heroicons-arrow-left" class="mb-4">
        {{ $t('events.back') }}
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <div v-else-if="event" class="max-w-4xl mx-auto">
      <!-- En-tête de l'événement -->
      <div class="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ event.title }}</h1>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('events.date') }}</h3>
            <p class="text-lg text-gray-900">{{ formatDate(event.date) }}</p>
          </div>
          <div v-if="event.location">
            <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('events.location') }}</h3>
            <p class="text-lg text-gray-900">{{ event.location }}</p>
          </div>
        </div>

        <div v-if="event.description" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('events.description') }}</h3>
          <p class="text-gray-900 leading-relaxed">{{ event.description }}</p>
        </div>
        <div v-else class="mb-6">
          <p class="text-gray-500 italic">{{ $t('events.noDescription') }}</p>
        </div>

        <div v-if="event.zoomUrl || event.replayUrl" class="flex gap-4 mb-6">
          <UButton v-if="event.zoomUrl" :to="event.zoomUrl" target="_blank" variant="solid" color="info" icon="i-simple-icons-zoom">
            Rejoindre sur Zoom
          </UButton>
          <UButton v-if="event.replayUrl" :to="event.replayUrl" target="_blank" variant="outline" icon="i-heroicons-play">
            Voir le replay
          </UButton>
        </div>

        <div v-if="event.stats" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">{{ $t('events.stats') }}</h3>
          <div class="flex gap-6">
            <div>
              <p class="text-2xl font-bold text-blue-600">{{ event.stats.registered }}</p>
              <p class="text-sm text-gray-600">{{ $t('events.registered') }}</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-600">{{ event.stats.attended }}</p>
              <p class="text-sm text-gray-600">{{ $t('events.attended') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hub: sections liées -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Venue / Location -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.venue') }}</h3>
            </div>
          </template>
          <p v-if="event.location" class="text-gray-700">{{ event.location }}</p>
          <p v-else class="text-gray-500 italic">{{ $t('events.noLocation') }}</p>
        </UCard>

        <!-- Speakers -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.speakers') }}</h3>
              <UButton size="xs" to="/speakers/new" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <ul v-if="speakers.length > 0" class="space-y-2">
            <li v-for="s in speakers" :key="s.id">
              <NuxtLink :to="`/speakers/${s.id}`" class="text-primary hover:underline">{{ s.name }}</NuxtLink>
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.noSpeakers') }}</p>
        </UCard>

        <!-- Sponsors -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.sponsors') }}</h3>
              <UButton size="xs" to="/sponsors/new" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <p class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Promo -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.promo') }}</h3>
              <UButton size="xs" :to="addPromoLink" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <ul v-if="linkedPromo.length > 0" class="space-y-2">
            <li v-for="p in linkedPromo" :key="p.id">
              <NuxtLink :to="`/promo/${p.id}`" class="text-primary hover:underline">{{ p.title }}</NuxtLink>
              <UBadge :label="$t(`status.promo.${p.status}`)" size="xs" class="ml-2" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Logistics -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.logistics') }}</h3>
              <UButton size="xs" :to="addLogisticsLink" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <ul v-if="linkedLogistics.length > 0" class="space-y-2">
            <li v-for="l in linkedLogistics" :key="l.id">
              <NuxtLink :to="`/logistics/${l.id}`" class="text-primary hover:underline">{{ l.name }}</NuxtLink>
              <UBadge :label="$t(`status.logistics.${l.status}`)" size="xs" class="ml-2" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Contractors -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.contractors') }}</h3>
              <UButton size="xs" to="/contractors/new" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <p class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Tools -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.tools') }}</h3>
              <UButton size="xs" to="/tools/new" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <p class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Social -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('events.hub.social') }}</h3>
              <UButton size="xs" :to="addSocialLink" variant="soft">{{ $t('events.hub.add') }}</UButton>
            </div>
          </template>
          <ul v-if="linkedSocial.length > 0" class="space-y-2">
            <li v-for="s in linkedSocial" :key="s.id">
              <NuxtLink :to="`/social/${s.id}`" class="text-primary hover:underline">
                {{ s.platform || s.copy?.slice(0, 40) || s.id }}
              </NuxtLink>
              <UBadge :label="$t(`status.social.${s.status}`)" size="xs" class="ml-2" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>
      </div>
    </div>
  </div>
</template>
