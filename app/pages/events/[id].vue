<script setup lang="ts">
import type { Event } from '~/types/event'
import type { Speaker } from '~/types/speaker'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const speakersStore = useSpeakersStore()

const eventId = route.params.id as string
const event = ref<Event | null>(null)
const speakers = ref<Speaker[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Récupérer l'événement et les speakers
onMounted(async () => {
  try {
    // Charger tous les événements si pas encore fait
    if (!eventsStore.loaded) {
      await eventsStore.fetchAll()
    }

    // Charger tous les speakers si pas encore fait
    if (!speakersStore.loaded) {
      await speakersStore.fetchAll()
    }

    // Trouver l'événement
    const foundEvent = eventsStore.byId(eventId)
    if (!foundEvent) {
      error.value = 'Événement non trouvé'
      event.value = null
      speakers.value = []
      return
    }
    event.value = foundEvent

    // Récupérer les speakers de l'événement
    speakers.value = event.value.speakers
      .map((speakerId: string) => speakersStore.byId(speakerId))
      .filter((speaker): speaker is Speaker => speaker !== undefined)

  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'événement'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Navigation retour
const goBack = () => {
  router.push('/events')
}

// Formatage de la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Bouton retour -->
    <div class="mb-6">
      <UButton
        @click="goBack"
        variant="soft"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        {{ $t('events.back') }}
      </UButton>
    </div>

    <!-- Contenu principal -->
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

        <!-- Informations principales -->
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

        <!-- Description -->
        <div v-if="event.description" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('events.description') }}</h3>
          <p class="text-gray-900 leading-relaxed">{{ event.description }}</p>
        </div>
        <div v-else class="mb-6">
          <p class="text-gray-500 italic">{{ $t('events.noDescription') }}</p>
        </div>

        <!-- Liens externes -->
        <div v-if="event.zoomUrl || event.replayUrl" class="flex gap-4 mb-6">
          <UButton
            v-if="event.zoomUrl"
            :to="event.zoomUrl"
            target="_blank"
            variant="solid"
            color="info"
            icon="i-simple-icons-zoom"
          >
            Rejoindre sur Zoom
          </UButton>

          <UButton
            v-if="event.replayUrl"
            :to="event.replayUrl"
            target="_blank"
            variant="outline"
            icon="i-heroicons-play"
          >
            Voir le replay
          </UButton>
        </div>

        <!-- Statistiques -->
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

      <!-- Section des speakers -->
      <div v-if="speakers.length > 0" class="bg-white rounded-lg shadow-sm border p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('events.speakers') }}</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="speaker in speakers"
            :key="speaker.id"
            class="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <div v-if="speaker.avatar" class="flex-shrink-0">
                <img
                  :src="speaker.avatar"
                  :alt="speaker.name"
                  class="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div v-else class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UIcon name="i-heroicons-user" class="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ speaker.name }}</h3>
                <p v-if="speaker.bio" class="text-sm text-gray-600 line-clamp-2">{{ speaker.bio }}</p>

                <!-- Topics -->
                <div v-if="speaker.topics && speaker.topics.length > 0" class="mt-2">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="topic in speaker.topics.slice(0, 3)"
                      :key="topic"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ topic }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm border p-8 text-center">
        <UIcon name="i-heroicons-users" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">{{ $t('events.noSpeakers') }}</p>
      </div>
    </div>
  </div>
</template>
