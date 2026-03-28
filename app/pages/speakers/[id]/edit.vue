<script setup lang="ts">
import { z } from 'zod'
import type { Speaker } from '~~/types/speaker'

definePageMeta({
  layout: 'default'
})

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  socialsLinkedin: z.string().optional(),
  socialsX: z.string().optional(),
  socialsWebsite: z.string().optional(),
  topicsStr: z.string().optional()
})

const route = useRoute()
const router = useRouter()
const speakersStore = useSpeakersStore()
const { add: addToast } = useToast()

const speakerId = computed(() => route.params.id as string)

// Redirection si l'id est "edit" (conflit avec /speakers/edit)
if (speakerId.value === 'edit') {
  await navigateTo('/speakers', { replace: true })
}

const { data: speaker, pending: loading, error: fetchError } = await useAsyncData(
  () => `speaker-edit-${speakerId.value}`,
  async () => {
    const id = speakerId.value
    if (!id || id === 'edit') return null
    const s = await speakersStore.fetchById(id)
    if (s) return s
    if (!speakersStore.loaded) await speakersStore.fetchAll()
    return speakersStore.byId(id) ?? null
  },
  { watch: [speakerId] }
)

const error = computed(() => {
  if (fetchError.value) return 'Intervenant non trouvé'
  if (!loading.value && !speaker.value) return 'Intervenant non trouvé'
  return null
})

const state = reactive({
  name: '',
  role: '',
  bio: '',
  avatar: '',
  socialsLinkedin: '',
  socialsX: '',
  socialsWebsite: '',
  topicsStr: ''
})

// Synchroniser state avec speaker quand chargé
watch(speaker, (s) => {
  if (s) {
    state.name = s.name
    state.role = s.role ?? ''
    state.bio = s.bio ?? ''
    state.avatar = s.avatar ?? ''
    state.socialsLinkedin = s.socials?.linkedin ?? ''
    state.socialsX = s.socials?.x ?? ''
    state.socialsWebsite = s.socials?.website ?? ''
    state.topicsStr = s.topics?.join(', ') ?? ''
  }
}, { immediate: true })

const errors = reactive({
  name: '',
  role: '',
  bio: '',
  avatar: '',
  socialsLinkedin: '',
  socialsX: '',
  socialsWebsite: '',
  topicsStr: ''
})

const pending = ref(false)

function validateForm() {
  const result = schema.safeParse(state)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof typeof errors
      if (field && field in errors) {
        errors[field] = issue.message
      }
    })
    return false
  }
  Object.keys(errors).forEach((k) => { (errors as Record<string, string>)[k] = '' })
  return true
}

async function onSubmit() {
  if (!validateForm()) {
    addToast({ title: 'Veuillez corriger les erreurs', color: 'error' })
    return
  }

  pending.value = true
  try {
    const topics = state.topicsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const socials = {
      ...(state.socialsLinkedin.trim() && { linkedin: state.socialsLinkedin.trim() }),
      ...(state.socialsX.trim() && { x: state.socialsX.trim() }),
      ...(state.socialsWebsite.trim() && { website: state.socialsWebsite.trim() })
    }
    await speakersStore.update(speakerId.value, {
      name: state.name.trim(),
      role: state.role.trim() || undefined,
      bio: state.bio.trim() || undefined,
      avatar: state.avatar.trim() || undefined,
      socials,
      topics
    })
    addToast({ title: 'Intervenant mis à jour', color: 'success' })
    router.push(`/speakers/${speakerId.value}`)
  } catch {
    addToast({ title: 'Erreur lors de la mise à jour', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" :to="`/speakers/${speakerId}`">
        {{ $t('speakers.back') }}
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-lucide-circle-alert" class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('requests.error') }}</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <UCard v-else>
      <h1 class="text-xl font-semibold mb-4">{{ $t('speakers.edit') }}</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('speakers.form.name') }}</label>
          <UInput
            id="name"
            v-model="state.name"
            required
            :placeholder="$t('speakers.form.namePlaceholder')"
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('speakers.form.role') }}</label>
          <UInput
            id="role"
            v-model="state.role"
            :placeholder="$t('speakers.form.rolePlaceholder')"
          />
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('speakers.form.bio') }}</label>
          <UTextarea
            id="bio"
            v-model="state.bio"
            :rows="3"
            :placeholder="$t('speakers.form.bioPlaceholder')"
          />
        </div>

        <div>
          <label for="avatar" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('speakers.form.avatar') }}</label>
          <UInput
            id="avatar"
            v-model="state.avatar"
            type="url"
            :placeholder="$t('speakers.form.avatarPlaceholder')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('speakers.socials') }}</label>
          <div class="space-y-2">
            <UInput
              v-model="state.socialsLinkedin"
              :placeholder="$t('speakers.form.linkedinPlaceholder')"
            />
            <UInput
              v-model="state.socialsX"
              :placeholder="$t('speakers.form.xPlaceholder')"
            />
            <UInput
              v-model="state.socialsWebsite"
              type="url"
              :placeholder="$t('speakers.form.websitePlaceholder')"
            />
          </div>
        </div>

        <div>
          <label for="topics" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('speakers.topics') }}</label>
          <UInput
            id="topics"
            v-model="state.topicsStr"
            :placeholder="$t('speakers.form.topicsPlaceholder')"
          />
        </div>

        <div class="flex gap-2">
          <UButton :loading="pending" type="submit">{{ $t('speakers.form.submitEdit') }}</UButton>
          <UButton variant="ghost" :to="`/speakers/${speakerId}`">{{ $t('speakers.form.cancel') }}</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
