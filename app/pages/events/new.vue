<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  date: z.string().min(1, 'La date est requise'),
  slug: z.string().min(3, 'Le slug doit contenir au moins 3 caractères').regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  location: z.string().optional(),
  description: z.string().optional(),
  speakers: z.array(z.string()).default([])
})

const state = reactive({
  title: '',
  date: '',
  slug: '',
  location: '',
  description: '',
  speakerIds: [] as string[]
})

const events = useEventsStore()
const speakersStore = useSpeakersStore()

const errors = reactive({
  title: '',
  date: '',
  slug: '',
  location: '',
  description: ''
})

const pending = ref(false)
const router = useRouter()
const { add: addToast } = useToast()

onMounted(async () => {
  await speakersStore.fetchAll()
})

const speakerOptions = computed(() =>
  speakersStore.items.map((s) => ({ label: s.role ? `${s.name} (${s.role})` : s.name, value: s.id }))
)

// Fonction pour valider un champ spécifique
function validateField(field: keyof typeof state) {
  const fieldSchema = z.object({ [field]: schema.shape[field] })
  const result = fieldSchema.safeParse({ [field]: state[field] })

  if (!result.success) {
    const fieldError = result.error.issues.find((e: any) => e.path.includes(field))
    errors[field] = fieldError?.message || ''
  } else {
    errors[field] = ''
  }
}

// Fonction pour valider tout le formulaire
function validateForm() {
  const result = schema.safeParse({ ...state, speakers: state.speakerIds })

  if (!result.success) {
    // Réinitialiser toutes les erreurs
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })

    // Afficher les erreurs pour chaque champ
    result.error.issues.forEach((error: any) => {
      const field = error.path[0] as keyof typeof errors
      if (field && errors[field] !== undefined) {
        errors[field] = error.message
      }
    })

    return false
  }

  // Réinitialiser toutes les erreurs si validation réussie
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  return true
}

async function onSubmit () {
  if (!validateForm()) {
    addToast({ title: 'Veuillez corriger les erreurs', color: 'error' })
    return
  }

  pending.value = true
  try {
    const created = await events.create({
      title: state.title,
      date: state.date,
      slug: state.slug,
      location: state.location || undefined,
      description: state.description || undefined,
      speakers: state.speakerIds
    })
    addToast({ title: 'Événement créé avec succès', color: 'success' })
    router.push(`/events/${created.id}`)
  } catch (error) {
    addToast({ title: 'Erreur lors de la création', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">Créer un événement</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <UInput
          id="title"
          v-model="state.title"
          :class="errors.title ? 'error-field' : ''"
          @blur="validateField('title')"
        />
        <p v-if="errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
        <UInput
          id="date"
          type="datetime-local"
          v-model="state.date"
          :min="new Date().toISOString().slice(0, 16)"
          :class="errors.date ? 'error-field' : ''"
          @blur="validateField('date')"
        />
        <p v-if="errors.date" class="text-sm text-red-600 mt-1">{{ errors.date }}</p>
        <p v-else class="text-xs text-gray-500 mt-1">Sélectionnez la date et l'heure de l'événement</p>
      </div>

      <div>
        <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <UInput
          id="slug"
          v-model="state.slug"
          placeholder="vue-montreal-1"
          :class="errors.slug ? 'error-field' : ''"
          @blur="validateField('slug')"
        />
        <p v-if="errors.slug" class="text-sm text-red-600 mt-1">{{ errors.slug }}</p>
        <p v-else class="text-xs text-gray-500 mt-1">Identifiant unique pour l'URL (lettres, chiffres et tirets uniquement)</p>
      </div>

      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <UInput
          id="location"
          v-model="state.location"
          placeholder="Montréal, QC"
          :class="errors.location ? 'error-field' : ''"
          @blur="validateField('location')"
        />
        <p v-if="errors.location" class="text-sm text-red-600 mt-1">{{ errors.location }}</p>
      </div>

      <div>
        <label for="speakers" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.speakers') }}</label>
        <USelectMenu
          v-model="state.speakerIds"
          :items="speakerOptions"
          multiple
          value-key="value"
          placeholder="Sélectionner des intervenants"
          class="w-full"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <UTextarea
          id="description"
          v-model="state.description"
          :rows="4"
          :class="errors.description ? 'error-field' : ''"
          @blur="validateField('description')"
        />
        <p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description }}</p>
      </div>

      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">Créer l'événement</UButton>
        <UButton variant="ghost" to="/events">Annuler</UButton>
      </div>
    </form>
  </UCard>
</template>

<style scoped>
.error-field {
  border: 2px solid #ef4444 !important;
  border-radius: 0.5rem !important;
}

.error-field:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}
</style>