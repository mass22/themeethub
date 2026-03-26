<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  date: z.string().min(1, 'La date est requise'),
  slug: z.string().min(3, 'Le slug doit contenir au moins 3 caractères').regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  // Mode de participation : remplace l'ancienne valeur texte libre
  location: z.union([z.enum(['in_person', 'online', 'hybrid']), z.literal('')]).optional(),
  description: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  speakers: z.array(z.string()).default([]),
  sponsors: z.array(z.string()).default([]),
  contractors: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  venueId: z.string().optional()
})

const state = reactive({
  title: '',
  date: '',
  slug: '',
  location: '',
  description: '',
  bannerImageUrl: '' as string,
  speakerIds: [] as string[],
  sponsorIds: [] as string[],
  contractorIds: [] as string[],
  toolIds: [] as string[],
  venueId: '' as string
})

const events = useEventsStore()
const speakersStore = useSpeakersStore()
const sponsorsStore = useSponsorsStore()
const contractorsStore = useContractorsStore()
const toolsStore = useToolsStore()
const venuesStore = useVenuesStore()

const errors = reactive({
  title: '',
  date: '',
  slug: '',
  location: '',
  description: '',
  bannerImageUrl: ''
})

const route = useRoute()
const pending = ref(false)
const router = useRouter()
const { add: addToast } = useToast()

onMounted(async () => {
  await Promise.all([
    speakersStore.fetchAll(),
    sponsorsStore.fetchAll(),
    contractorsStore.fetchAll(),
    toolsStore.fetchAll(),
    venuesStore.fetchAll()
  ])
})

const speakerOptions = computed(() =>
  speakersStore.items.map((s) => ({ label: s.role ? `${s.name} (${s.role})` : s.name, value: s.id }))
)
const sponsorOptions = computed(() =>
  sponsorsStore.items.map((s) => ({ label: s.companyName, value: s.id }))
)
const contractorOptions = computed(() =>
  contractorsStore.items.map((c) => ({ label: c.role ? `${c.name} (${c.role})` : c.name, value: c.id }))
)
const toolOptions = computed(() =>
  toolsStore.items.map((t) => ({ label: t.type ? `${t.name} (${t.type})` : t.name, value: t.id }))
)
const venueOptions = computed(() =>
  venuesStore.items.map((v) => ({ label: v.name, value: v.id }))
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
  const result = schema.safeParse({
    ...state,
    bannerImageUrl: state.bannerImageUrl || undefined,
    speakers: state.speakerIds,
    sponsors: state.sponsorIds,
    contractors: state.contractorIds,
    tools: state.toolIds,
    venueId: state.venueId || undefined
  })

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
      bannerImageUrl: state.bannerImageUrl?.trim() || undefined,
    speakers: state.speakerIds,
    sponsors: state.sponsorIds,
    contractors: state.contractorIds,
    tools: state.toolIds,
    venueId: state.venueId || undefined
  })
    addToast({ title: 'Événement créé avec succès', color: 'success' })
    const returnTo = route.query.returnTo as string
    router.push(returnTo || `/events/${created.id}`)
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
        <label for="bannerImageUrl" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.hub.bannerImage') }}</label>
        <UInput
          id="bannerImageUrl"
          v-model="state.bannerImageUrl"
          type="url"
          placeholder="https://..."
          :class="errors.bannerImageUrl ? 'error-field' : ''"
          @blur="validateField('bannerImageUrl')"
        />
        <p v-if="errors.bannerImageUrl" class="text-sm text-red-600 mt-1">{{ errors.bannerImageUrl }}</p>
        <p v-else class="text-xs text-gray-500 mt-1">{{ $t('events.hub.bannerImageHelp') }}</p>
      </div>

      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.location') }}</label>
        <USelectMenu
          id="location"
          v-model="state.location"
          :items="[
            { label: $t('events.locationModes.in_person'), value: 'in_person' },
            { label: $t('events.locationModes.online'), value: 'online' },
            { label: $t('events.locationModes.hybrid'), value: 'hybrid' }
          ]"
          value-key="value"
          :class="errors.location ? 'error-field' : ''"
          :placeholder="$t('events.locationModes.in_person')"
        />
        <p v-if="errors.location" class="text-sm text-red-600 mt-1">{{ errors.location }}</p>
      </div>

      <div>
        <label for="speakers" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.speakers') }}</label>
        <div class="flex gap-2 items-start">
          <USelectMenu
            v-model="state.speakerIds"
            :items="speakerOptions"
            multiple
            value-key="value"
            :placeholder="$t('events.hub.selectOrCreate')"
            class="flex-1"
          />
          <UButton variant="outline" size="sm" :to="{ path: '/speakers/new', query: { returnTo: '/events/new' } }">
            {{ $t('events.hub.createNew') }}
          </UButton>
        </div>
      </div>

      <div>
        <label for="sponsors" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.hub.sponsors') }}</label>
        <div class="flex gap-2 items-start">
          <USelectMenu
            v-model="state.sponsorIds"
            :items="sponsorOptions"
            multiple
            value-key="value"
            :placeholder="$t('events.hub.selectOrCreate')"
            class="flex-1"
          />
          <UButton variant="outline" size="sm" :to="{ path: '/sponsors/new', query: { returnTo: '/events/new' } }">
            {{ $t('events.hub.createNew') }}
          </UButton>
        </div>
      </div>

      <div>
        <label for="contractors" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.hub.contractors') }}</label>
        <div class="flex gap-2 items-start">
          <USelectMenu
            v-model="state.contractorIds"
            :items="contractorOptions"
            multiple
            value-key="value"
            :placeholder="$t('events.hub.selectOrCreate')"
            class="flex-1"
          />
          <UButton variant="outline" size="sm" :to="{ path: '/contractors/new', query: { returnTo: '/events/new' } }">
            {{ $t('events.hub.createNew') }}
          </UButton>
        </div>
      </div>

      <div>
        <label for="tools" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.hub.tools') }}</label>
        <div class="flex gap-2 items-start">
          <USelectMenu
            v-model="state.toolIds"
            :items="toolOptions"
            multiple
            value-key="value"
            :placeholder="$t('events.hub.selectOrCreate')"
            class="flex-1"
          />
          <UButton variant="outline" size="sm" :to="{ path: '/tools/new', query: { returnTo: '/events/new' } }">
            {{ $t('events.hub.createNew') }}
          </UButton>
        </div>
      </div>

      <div>
        <label for="venue" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('events.hub.venue') }}</label>
        <div class="flex gap-2 items-start">
          <USelectMenu
            v-model="state.venueId"
            :items="venueOptions"
            value-key="value"
            :placeholder="$t('events.hub.selectOrCreate')"
            class="flex-1"
          />
          <UButton variant="outline" size="sm" :to="{ path: '/venues/new', query: { returnTo: '/events/new' } }">
            {{ $t('events.hub.createNew') }}
          </UButton>
        </div>
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