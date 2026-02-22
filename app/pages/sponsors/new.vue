<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const state = reactive({
  companyName: '',
  contactName: '',
  contactEmail: ''
})

const pending = ref(false)
const router = useRouter()
const sponsorsStore = useSponsorsStore()
const { add: addToast } = useToast()

async function onSubmit() {
  if (!state.companyName.trim() || !state.contactName.trim() || !state.contactEmail.trim()) {
    addToast({ title: 'Tous les champs sont requis', color: 'error' })
    return
  }

  pending.value = true
  try {
    await sponsorsStore.create({
      companyName: state.companyName.trim(),
      contactName: state.contactName.trim(),
      contactEmail: state.contactEmail.trim()
    })
    addToast({ title: 'Sponsor créé avec succès', color: 'success' })
    router.push('/sponsors')
  } catch (e: unknown) {
    const err = e as { statusCode?: number; statusMessage?: string }
    if (err.statusCode === 409) {
      addToast({ title: 'Un sponsor existe déjà avec cette entreprise et cet email', color: 'error' })
    } else {
      addToast({ title: 'Erreur lors de la création', color: 'error' })
    }
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('sponsors.create') }}</h1>
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

      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('sponsors.form.submit') }}</UButton>
        <UButton variant="ghost" to="/sponsors">{{ $t('sponsors.form.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
