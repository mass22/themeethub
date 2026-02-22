<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'default'
})

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional()
})

const state = reactive({
  name: '',
  role: '',
  bio: '',
  avatar: ''
})

const errors = reactive({
  name: '',
  role: '',
  bio: '',
  avatar: ''
})

const pending = ref(false)
const router = useRouter()
const speakersStore = useSpeakersStore()
const { add: addToast } = useToast()

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
    await speakersStore.create({
      name: state.name.trim(),
      role: state.role.trim() || undefined,
      bio: state.bio.trim() || undefined,
      avatar: state.avatar.trim() || undefined
    })
    addToast({ title: 'Intervenant créé avec succès', color: 'success' })
    router.push('/speakers')
  } catch {
    addToast({ title: 'Erreur lors de la création', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('speakers.create') }}</h1>
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

      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('speakers.form.submit') }}</UButton>
        <UButton variant="ghost" to="/speakers">{{ $t('speakers.form.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
