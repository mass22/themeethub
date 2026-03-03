<script setup lang="ts">
import type { Sponsor } from '~/types/sponsor'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const sponsorsStore = useSponsorsStore()
const { add: addToast } = useToast()

const sponsorId = computed(() => route.params.id as string)

const { data: sponsor, pending: loading, error: fetchError } = await useAsyncData(
  () => `sponsor-edit-${sponsorId.value}`,
  async () => {
    const id = sponsorId.value
    if (!id || id === 'edit') return null
    const s = await sponsorsStore.fetchById(id)
    if (s) return s
    if (!sponsorsStore.loaded) await sponsorsStore.fetchAll()
    return sponsorsStore.byId(id) ?? null
  },
  { watch: [sponsorId] }
)

const error = computed(() => {
  if (fetchError.value) return 'Sponsor non trouvé'
  if (!loading.value && !sponsor.value) return 'Sponsor non trouvé'
  return null
})

const state = reactive({
  companyName: '',
  contactName: '',
  contactEmail: '',
  logoUrl: '',
  websiteUrl: '',
  tier: '',
  notes: ''
})

watch(sponsor, (s) => {
  if (s) {
    state.companyName = s.companyName ?? ''
    state.contactName = s.contactName ?? ''
    state.contactEmail = s.contactEmail ?? ''
    state.logoUrl = s.logoUrl ?? ''
    state.websiteUrl = s.websiteUrl ?? ''
    state.tier = s.tier ?? ''
    state.notes = s.notes ?? ''
  }
}, { immediate: true })

const pending = ref(false)

async function onSubmit() {
  if (!state.companyName.trim() || !state.contactName.trim() || !state.contactEmail.trim()) {
    addToast({ title: 'Entreprise, contact et email sont requis', color: 'error' })
    return
  }

  pending.value = true
  try {
    await sponsorsStore.update(sponsorId.value, {
      companyName: state.companyName.trim(),
      contactName: state.contactName.trim(),
      contactEmail: state.contactEmail.trim(),
      logoUrl: state.logoUrl.trim() || undefined,
      websiteUrl: state.websiteUrl.trim() || undefined,
      tier: state.tier.trim() || undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Sponsor mis à jour', color: 'success' })
    router.push(`/sponsors/${sponsorId.value}`)
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
      <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" :to="`/sponsors/${sponsorId}`">
        {{ $t('sponsors.back') }}
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

    <UCard v-else>
      <h1 class="text-xl font-semibold mb-4">{{ $t('sponsors.edit') }}</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.companyName') }}</label>
          <UInput
            id="companyName"
            v-model="state.companyName"
            required
            :placeholder="$t('sponsors.form.companyNamePlaceholder')"
          />
        </div>

        <div>
          <label for="contactName" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.contactName') }}</label>
          <UInput
            id="contactName"
            v-model="state.contactName"
            required
            :placeholder="$t('sponsors.form.contactNamePlaceholder')"
          />
        </div>

        <div>
          <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.contactEmail') }}</label>
          <UInput
            id="contactEmail"
            v-model="state.contactEmail"
            type="email"
            required
            :placeholder="$t('sponsors.form.contactEmailPlaceholder')"
          />
        </div>

        <div>
          <label for="logoUrl" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.logoUrl') }}</label>
          <UInput
            id="logoUrl"
            v-model="state.logoUrl"
            type="url"
            :placeholder="$t('sponsors.form.logoUrlPlaceholder')"
          />
        </div>

        <div>
          <label for="websiteUrl" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.websiteUrl') }}</label>
          <UInput
            id="websiteUrl"
            v-model="state.websiteUrl"
            type="url"
            :placeholder="$t('sponsors.form.websiteUrlPlaceholder')"
          />
        </div>

        <div>
          <label for="tier" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.tier') }}</label>
          <UInput
            id="tier"
            v-model="state.tier"
            :placeholder="$t('sponsors.form.tierPlaceholder')"
          />
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('sponsors.form.notes') }}</label>
          <UTextarea
            id="notes"
            v-model="state.notes"
            :rows="3"
            :placeholder="$t('sponsors.form.notesPlaceholder')"
          />
        </div>

        <div class="flex gap-2">
          <UButton :loading="pending" type="submit">{{ $t('sponsors.form.submitEdit') }}</UButton>
          <UButton variant="ghost" :to="`/sponsors/${sponsorId}`">{{ $t('sponsors.form.cancel') }}</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
