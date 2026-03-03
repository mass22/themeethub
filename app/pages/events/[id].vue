<script setup lang="ts">
import type { Event } from '~/types/event'
import type { Speaker } from '~/types/speaker'
import type { Sponsor } from '~/types/sponsor'
import type { Contractor } from '~/types/contractor'
import type { Tool } from '~/types/tool'
import type { Venue } from '~/types/venue'
import type { PromoItem } from '~/types/promoItem'
import type { LogisticsItem } from '~/types/logisticsItem'
import type { SocialPost } from '~/types/socialPost'

const route = useRoute()
const router = useRouter()
const eventId = route.params.id as string
const { add: addToast } = useToast()

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

const selectedSpeakerId = ref<string | null>(null)
const selectedSponsorId = ref<string | null>(null)
const selectedContractorId = ref<string | null>(null)
const selectedToolId = ref<string | null>(null)
const selectedVenueId = ref<string | null>(null)
const selectedPromoId = ref<string | null>(null)
const selectedLogisticsId = ref<string | null>(null)
const selectedSocialId = ref<string | null>(null)

const statsForm = reactive({ registered: 0, attended: 0 })
const statsSaving = ref(false)
const bannerForm = reactive({ bannerImageUrl: '' })
const bannerSaving = ref(false)

watch(event, (e) => {
  bannerForm.bannerImageUrl = e?.bannerImageUrl ?? ''
}, { immediate: true })

watch(event, (e) => {
  if (e?.stats) {
    statsForm.registered = e.stats.registered
    statsForm.attended = e.stats.attended
  } else {
    statsForm.registered = 0
    statsForm.attended = 0
  }
}, { immediate: true })

const statsChanged = computed(() =>
  event.value
    ? (event.value.stats?.registered ?? 0) !== (Number(statsForm.registered) || 0) ||
      (event.value.stats?.attended ?? 0) !== (Number(statsForm.attended) || 0)
    : false
)

async function saveStats() {
  if (!event.value || statsSaving.value) return
  const reg = Math.max(0, Number(statsForm.registered) || 0)
  const att = Math.max(0, Number(statsForm.attended) || 0)
  statsSaving.value = true
  try {
    const updated = await eventsStore.update(eventId, {
      stats: { registered: reg, attended: att }
    })
    event.value = updated
    addToast({ title: 'Statistiques enregistrées', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'enregistrement', color: 'error' })
  } finally {
    statsSaving.value = false
  }
}

const bannerChanged = computed(() =>
  event.value && (event.value.bannerImageUrl ?? '') !== bannerForm.bannerImageUrl
)

async function saveBanner() {
  if (!event.value || bannerSaving.value) return
  bannerSaving.value = true
  try {
    const updated = await eventsStore.update(eventId, {
      bannerImageUrl: bannerForm.bannerImageUrl?.trim() || null
    })
    event.value = updated
    addToast({ title: 'Bannière enregistrée', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'enregistrement', color: 'error' })
  } finally {
    bannerSaving.value = false
  }
}

const linkedSponsors = computed<Sponsor[]>(() => {
  if (!event.value?.sponsors) return []
  return event.value.sponsors
    .map((id) => sponsorsStore.byId(id))
    .filter((s): s is Sponsor => s !== undefined)
})
const linkedContractors = computed<Contractor[]>(() => {
  if (!event.value?.contractors) return []
  return event.value.contractors
    .map((id) => contractorsStore.byId(id))
    .filter((c): c is Contractor => c !== undefined)
})
const linkedPromo = computed<PromoItem[]>(() =>
  eventId ? promoStore.items.filter((p) => p.eventId === eventId) : []
)
const linkedLogistics = computed<LogisticsItem[]>(() =>
  eventId ? logisticsStore.items.filter((l) => l.eventId === eventId) : []
)
const linkedSocial = computed<SocialPost[]>(() =>
  eventId ? socialStore.items.filter((s) => s.eventId === eventId) : []
)

const sponsorOptions = computed(() =>
  sponsorsStore.items
    .filter((s) => !event.value?.sponsors?.includes(s.id))
    .map((s) => ({ label: s.companyName, value: s.id }))
)
const contractorOptions = computed(() =>
  contractorsStore.items
    .filter((c) => !event.value?.contractors?.includes(c.id))
    .map((c) => ({ label: c.role ? `${c.name} (${c.role})` : c.name, value: c.id }))
)
const speakerOptions = computed(() =>
  speakersStore.items
    .filter((s) => !event.value?.speakers?.includes(s.id))
    .map((s) => ({ label: s.role ? `${s.name} (${s.role})` : s.name, value: s.id }))
)
const toolOptions = computed(() =>
  toolsStore.items
    .filter((t) => !event.value?.tools?.includes(t.id))
    .map((t) => ({ label: t.type ? `${t.name} (${t.type})` : t.name, value: t.id }))
)
const venueOptions = computed(() =>
  venuesStore.items.map((v) => ({ label: v.name, value: v.id }))
)
const promoOptions = computed(() =>
  promoStore.items
    .filter((p) => p.eventId !== eventId)
    .map((p) => ({ label: p.title, value: p.id }))
)
const logisticsOptions = computed(() =>
  logisticsStore.items
    .filter((l) => l.eventId !== eventId)
    .map((l) => ({ label: l.name, value: l.id }))
)
const socialOptions = computed(() =>
  socialStore.items
    .filter((s) => s.eventId !== eventId)
    .map((s) => ({ label: s.platform || s.copy?.slice(0, 30) || s.id, value: s.id }))
)

const linkedTools = computed<Tool[]>(() => {
  if (!event.value?.tools) return []
  return event.value.tools
    .map((id) => toolsStore.byId(id))
    .filter((t): t is Tool => t !== undefined)
})
const linkedVenue = computed<Venue | null>(() =>
  event.value?.venueId ? venuesStore.byId(event.value.venueId) ?? null : null
)

async function addSponsor(sponsorId: string) {
  if (!event.value) return
  const next = [...(event.value.sponsors || []), sponsorId]
  await eventsStore.update(eventId, { sponsors: next })
  event.value = { ...event.value, sponsors: next }
}

async function removeSponsor(sponsorId: string) {
  if (!event.value) return
  const next = (event.value.sponsors || []).filter((id) => id !== sponsorId)
  await eventsStore.update(eventId, { sponsors: next })
  event.value = { ...event.value, sponsors: next }
}

async function addContractor(contractorId: string) {
  if (!event.value) return
  const next = [...(event.value.contractors || []), contractorId]
  await eventsStore.update(eventId, { contractors: next })
  event.value = { ...event.value, contractors: next }
}

async function removeContractor(contractorId: string) {
  if (!event.value) return
  const next = (event.value.contractors || []).filter((id) => id !== contractorId)
  await eventsStore.update(eventId, { contractors: next })
  event.value = { ...event.value, contractors: next }
}

async function addSpeaker(speakerId: string) {
  if (!event.value) return
  const next = [...event.value.speakers, speakerId]
  await eventsStore.update(eventId, { speakers: next })
  event.value = { ...event.value, speakers: next }
  speakers.value = next
    .map((id) => speakersStore.byId(id))
    .filter((s): s is Speaker => s !== undefined)
}

async function removeSpeaker(speakerId: string) {
  if (!event.value) return
  const next = event.value.speakers.filter((id) => id !== speakerId)
  await eventsStore.update(eventId, { speakers: next })
  event.value = { ...event.value, speakers: next }
  speakers.value = next
    .map((id) => speakersStore.byId(id))
    .filter((s): s is Speaker => s !== undefined)
}

async function confirmAddSpeaker() {
  if (!selectedSpeakerId.value) return
  try {
    await addSpeaker(selectedSpeakerId.value)
    selectedSpeakerId.value = null
    addToast({ title: 'Intervenant ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function confirmAddSponsor() {
  if (!selectedSponsorId.value) return
  try {
    await addSponsor(selectedSponsorId.value)
    selectedSponsorId.value = null
    addToast({ title: 'Sponsor ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function confirmAddContractor() {
  if (!selectedContractorId.value) return
  try {
    await addContractor(selectedContractorId.value)
    selectedContractorId.value = null
    addToast({ title: 'Prestataire ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function addTool(toolId: string) {
  if (!event.value) return
  const next = [...(event.value.tools || []), toolId]
  await eventsStore.update(eventId, { tools: next })
  event.value = { ...event.value, tools: next }
}

async function removeTool(toolId: string) {
  if (!event.value) return
  const next = (event.value.tools || []).filter((id) => id !== toolId)
  await eventsStore.update(eventId, { tools: next })
  event.value = { ...event.value, tools: next }
}

async function setVenue(venueId: string | null) {
  if (!event.value) return
  await eventsStore.update(eventId, { venueId: venueId ?? undefined })
  event.value = { ...event.value, venueId }
}

async function addPromo(promoId: string) {
  try {
    await promoStore.patch(promoId, { eventId: eventId })
    await promoStore.fetchById(promoId)
    addToast({ title: 'Item promo ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function addLogistics(logisticsId: string) {
  try {
    await logisticsStore.patch(logisticsId, { eventId: eventId })
    await logisticsStore.fetchById(logisticsId)
    addToast({ title: 'Item logistique ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function addSocial(socialId: string) {
  try {
    await socialStore.patch(socialId, { eventId: eventId })
    await socialStore.fetchById(socialId)
    addToast({ title: 'Publication ajoutée', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function removePromo(promoId: string) {
  try {
    await promoStore.patch(promoId, { eventId: undefined })
    await promoStore.fetchById(promoId)
    addToast({ title: 'Item promo retiré', color: 'success' })
  } catch {
    addToast({ title: 'Erreur', color: 'error' })
  }
}

async function removeLogistics(logisticsId: string) {
  const otherEventId = eventsStore.items.find((e) => e.id !== eventId)?.id
  if (!otherEventId) {
    addToast({ title: 'Impossible de retirer : créez un autre événement d\'abord', color: 'error' })
    return
  }
  try {
    await logisticsStore.patch(logisticsId, { eventId: otherEventId })
    await logisticsStore.fetchById(logisticsId)
    addToast({ title: 'Item logistique retiré', color: 'success' })
  } catch {
    addToast({ title: 'Erreur', color: 'error' })
  }
}

async function removeSocial(socialId: string) {
  try {
    await socialStore.patch(socialId, { eventId: undefined })
    await socialStore.fetchById(socialId)
    addToast({ title: 'Publication retirée', color: 'success' })
  } catch {
    addToast({ title: 'Erreur', color: 'error' })
  }
}

async function confirmAddTool() {
  if (!selectedToolId.value) return
  try {
    await addTool(selectedToolId.value)
    selectedToolId.value = null
    addToast({ title: 'Outil ajouté', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'ajout', color: 'error' })
  }
}

async function confirmAddVenue() {
  if (!selectedVenueId.value) return
  try {
    await setVenue(selectedVenueId.value)
    selectedVenueId.value = null
    addToast({ title: 'Lieu assigné', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de l\'assignation', color: 'error' })
  }
}

async function confirmAddPromo() {
  if (!selectedPromoId.value) return
  await addPromo(selectedPromoId.value)
  selectedPromoId.value = null
}

async function confirmAddLogistics() {
  if (!selectedLogisticsId.value) return
  await addLogistics(selectedLogisticsId.value)
  selectedLogisticsId.value = null
}

async function confirmAddSocial() {
  if (!selectedSocialId.value) return
  await addSocial(selectedSocialId.value)
  selectedSocialId.value = null
}

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
    speakers.value = (foundEvent.speakers || [])
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
const addSponsorLink = computed(() => ({ path: '/sponsors/new', query: { eventId, returnTo: `/events/${eventId}` } }))
const addContractorLink = computed(() => ({ path: '/contractors/new', query: { eventId, returnTo: `/events/${eventId}` } }))
const addSpeakerLink = computed(() => ({ path: '/speakers/new', query: { returnTo: `/events/${eventId}` } }))
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
        <div v-if="event.bannerImageUrl" class="mb-6 -mx-8 -mt-8">
          <img
            :src="event.bannerImageUrl"
            :alt="event.title"
            class="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
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

        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-3">{{ $t('events.hub.bannerImage') }}</h3>
          <div class="flex gap-2 items-end flex-wrap">
            <UInput
              v-model="bannerForm.bannerImageUrl"
              type="url"
              placeholder="https://..."
              class="flex-1 min-w-48"
            />
            <UButton
              size="sm"
              :loading="bannerSaving"
              :disabled="!bannerChanged"
              @click="saveBanner"
            >
              {{ $t('common.submit') }}
            </UButton>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">{{ $t('events.stats') }}</h3>
          <div class="flex gap-6 items-end">
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ $t('events.registered') }}</label>
              <UInput
                v-model.number="statsForm.registered"
                type="number"
                min="0"
                class="w-24"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ $t('events.attended') }}</label>
              <UInput
                v-model.number="statsForm.attended"
                type="number"
                min="0"
                class="w-24"
              />
            </div>
            <UButton
              size="sm"
              :loading="statsSaving"
              :disabled="!statsChanged"
              @click="saveStats"
            >
              {{ $t('common.submit') }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Hub: sections liées -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Venue / Lieu -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.venue') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="(selectedVenueId ? venueOptions.find(o => o.value === selectedVenueId) : null) ?? (linkedVenue ? { label: linkedVenue.name, value: linkedVenue.id } : undefined)"
                :items="venueOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedVenueId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedVenueId"
                @click="confirmAddVenue"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="{ path: '/venues/new', query: { returnTo: `/events/${eventId}` } }">
                {{ $t('events.hub.createNew') }}
              </UButton>
              <UButton v-if="linkedVenue" size="sm" variant="ghost" color="neutral" @click="setVenue(null); selectedVenueId = null">
                Retirer
              </UButton>
            </div>
          </div>
          <div v-if="linkedVenue" class="mt-3">
            <NuxtLink :to="`/venues/${linkedVenue.id}`" class="text-primary hover:underline">{{ linkedVenue.name }}</NuxtLink>
            <p v-if="linkedVenue.address" class="text-sm text-gray-600">{{ linkedVenue.address }}</p>
          </div>
          <p v-else-if="event.location" class="mt-3 text-gray-700">{{ event.location }}</p>
          <p v-else class="mt-3 text-gray-500 italic">{{ $t('events.noLocation') }}</p>
        </UCard>

        <!-- Speakers -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.speakers') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="speakerOptions.find(o => o.value === selectedSpeakerId)"
                :items="speakerOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedSpeakerId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedSpeakerId"
                @click="confirmAddSpeaker"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addSpeakerLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="speakers.length > 0" class="space-y-2 mt-3">
            <li v-for="s in speakers" :key="s.id" class="flex items-center justify-between gap-2">
              <NuxtLink :to="`/speakers/${s.id}`" class="text-primary hover:underline">{{ s.name }}</NuxtLink>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeSpeaker(s.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.noSpeakers') }}</p>
        </UCard>

        <!-- Sponsors -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.sponsors') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="sponsorOptions.find(o => o.value === selectedSponsorId)"
                :items="sponsorOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedSponsorId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedSponsorId"
                @click="confirmAddSponsor"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addSponsorLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedSponsors.length > 0" class="space-y-2 mt-3">
            <li v-for="s in linkedSponsors" :key="s.id" class="flex items-center justify-between gap-2">
              <NuxtLink :to="`/sponsors/${s.id}`" class="text-primary hover:underline">{{ s.companyName }}</NuxtLink>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeSponsor(s.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Promo -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.promo') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="promoOptions.find(o => o.value === selectedPromoId)"
                :items="promoOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedPromoId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedPromoId"
                @click="confirmAddPromo"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addPromoLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedPromo.length > 0" class="space-y-2 mt-3">
            <li v-for="p in linkedPromo" :key="p.id" class="flex items-center justify-between gap-2">
              <div>
                <NuxtLink :to="`/promo/${p.id}`" class="text-primary hover:underline">{{ p.title }}</NuxtLink>
                <UBadge :label="$t(`status.promo.${p.status}`)" size="xs" class="ml-2" />
              </div>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removePromo(p.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic mt-3">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Logistics -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.logistics') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="logisticsOptions.find(o => o.value === selectedLogisticsId)"
                :items="logisticsOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedLogisticsId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedLogisticsId"
                @click="confirmAddLogistics"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addLogisticsLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedLogistics.length > 0" class="space-y-2 mt-3">
            <li v-for="l in linkedLogistics" :key="l.id" class="flex items-center justify-between gap-2">
              <div>
                <NuxtLink :to="`/logistics/${l.id}`" class="text-primary hover:underline">{{ l.name }}</NuxtLink>
                <UBadge :label="$t(`status.logistics.${l.status}`)" size="xs" class="ml-2" />
              </div>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeLogistics(l.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic mt-3">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Contractors -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.contractors') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="contractorOptions.find(o => o.value === selectedContractorId)"
                :items="contractorOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedContractorId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedContractorId"
                @click="confirmAddContractor"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addContractorLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedContractors.length > 0" class="space-y-2 mt-3">
            <li v-for="c in linkedContractors" :key="c.id" class="flex items-center justify-between gap-2">
              <NuxtLink :to="`/contractors/${c.id}`" class="text-primary hover:underline">{{ c.name }}</NuxtLink>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeContractor(c.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Tools -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.tools') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="toolOptions.find(o => o.value === selectedToolId)"
                :items="toolOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedToolId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedToolId"
                @click="confirmAddTool"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="{ path: '/tools/new', query: { returnTo: `/events/${eventId}` } }">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedTools.length > 0" class="space-y-2 mt-3">
            <li v-for="t in linkedTools" :key="t.id" class="flex items-center justify-between gap-2">
              <NuxtLink :to="`/tools/${t.id}`" class="text-primary hover:underline">{{ t.name }}</NuxtLink>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeTool(t.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic mt-3">{{ $t('events.hub.empty') }}</p>
        </UCard>

        <!-- Social -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ $t('events.hub.social') }}</h3>
          </template>
          <div class="space-y-3">
            <div class="flex gap-2 items-center flex-wrap">
              <USelectMenu
                :model-value="socialOptions.find(o => o.value === selectedSocialId)"
                :items="socialOptions"
                value-key="value"
                :placeholder="$t('events.hub.selectOrCreate')"
                class="min-w-48"
                @update:model-value="selectedSocialId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null"
              />
              <UButton
                size="sm"
                :disabled="!selectedSocialId"
                @click="confirmAddSocial"
              >
                {{ $t('events.hub.add') }}
              </UButton>
              <UButton size="sm" variant="outline" :to="addSocialLink">
                {{ $t('events.hub.createNew') }}
              </UButton>
            </div>
          </div>
          <ul v-if="linkedSocial.length > 0" class="space-y-2 mt-3">
            <li v-for="s in linkedSocial" :key="s.id" class="flex items-center justify-between gap-2">
              <div>
                <NuxtLink :to="`/social/${s.id}`" class="text-primary hover:underline">
                  {{ s.platform || s.copy?.slice(0, 40) || s.id }}
                </NuxtLink>
                <UBadge :label="$t(`status.social.${s.status}`)" size="xs" class="ml-2" />
              </div>
              <UButton size="xs" icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="removeSocial(s.id)" />
            </li>
          </ul>
          <p v-else class="text-gray-500 italic mt-3">{{ $t('events.hub.empty') }}</p>
        </UCard>
      </div>
    </div>
  </div>
</template>
