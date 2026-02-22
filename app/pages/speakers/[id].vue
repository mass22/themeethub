<script setup lang="ts">
import type { Speaker } from '~/types/speaker'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const speakersStore = useSpeakersStore()

const speakerId = route.params.id as string
const speaker = ref<Speaker | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const s = await speakersStore.fetchById(speakerId)
    speaker.value = s
    if (!speaker.value) {
      if (!speakersStore.loaded) await speakersStore.fetchAll()
      speaker.value = speakersStore.byId(speakerId) ?? null
    }
    if (!speaker.value) error.value = 'Intervenant non trouvé'
  } catch (err) {
    error.value = 'Intervenant non trouvé'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/speakers')

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
        {{ $t('speakers.back') }}
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('requests.error') }}</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <div v-else-if="speaker" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <div class="flex items-center space-x-4 mb-6">
          <img
            v-if="speaker.avatar"
            :src="speaker.avatar"
            :alt="speaker.name"
            class="h-20 w-20 rounded-full object-cover"
          />
          <div v-else class="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
            <span class="text-2xl text-gray-600 font-semibold">{{ speaker.name.charAt(0) }}</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ speaker.name }}</h1>
            <p v-if="speaker.role" class="text-lg text-gray-500">{{ speaker.role }}</p>
          </div>
        </div>

        <div v-if="speaker.bio" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('speakers.form.bio') }}</h3>
          <p class="text-gray-900 whitespace-pre-wrap">{{ speaker.bio }}</p>
        </div>
        <div v-else class="mb-6">
          <p class="text-gray-500 italic">{{ $t('speakers.noBio') }}</p>
        </div>

        <div v-if="speaker.topics && speaker.topics.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('speakers.topics') }}</h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="topic in speaker.topics"
              :key="topic"
              :label="topic"
              color="primary"
              variant="soft"
            />
          </div>
        </div>

        <div v-if="speaker.socials && (speaker.socials.linkedin || speaker.socials.x || speaker.socials.website)" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('speakers.socials') }}</h3>
          <div class="flex gap-3">
            <UButton
              v-if="speaker.socials.linkedin"
              :to="speaker.socials.linkedin"
              target="_blank"
              variant="soft"
              size="sm"
              icon="i-simple-icons-linkedin"
            >
              LinkedIn
            </UButton>
            <UButton
              v-if="speaker.socials.x"
              :to="`https://x.com/${speaker.socials.x}`"
              target="_blank"
              variant="soft"
              size="sm"
              icon="i-simple-icons-x"
            >
              X
            </UButton>
            <UButton
              v-if="speaker.socials.website"
              :to="speaker.socials.website"
              target="_blank"
              variant="soft"
              size="sm"
              icon="i-heroicons-globe-alt"
            >
              Site
            </UButton>
          </div>
        </div>

        <div class="text-sm text-gray-500">
          <p>{{ $t('sponsors.updatedAt') }} {{ formatDate(speaker.updatedAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
