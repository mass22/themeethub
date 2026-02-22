<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  address: z.string().optional(),
  capacity: z.number().optional(),
  contactId: z.string().optional(),
  notes: z.string().optional()
})

const state = reactive({ name: '', address: '', capacityStr: '', contactId: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useVenuesStore()
const contactsStore = useContactsStore()
const { add: addToast } = useToast()

onMounted(() => contactsStore.fetchAll())

function validateForm() {
  const cap = state.capacityStr ? parseInt(state.capacityStr, 10) : undefined
  const result = schema.safeParse({
    ...state,
    capacity: Number.isNaN(cap) ? undefined : cap,
    contactId: state.contactId || undefined
  })
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string
      if (field && field in errors) errors[field] = issue.message
    })
    return false
  }
  Object.keys(errors).forEach((k) => { errors[k] = '' })
  return true
}

async function onSubmit() {
  if (!validateForm()) {
    addToast({ title: 'Please fix errors', color: 'error' })
    return
  }
  pending.value = true
  try {
    const cap = state.capacityStr ? parseInt(state.capacityStr, 10) : undefined
    const created = await store.create({
      name: state.name.trim(),
      address: state.address.trim() || undefined,
      capacity: Number.isNaN(cap) ? undefined : cap,
      contactId: state.contactId || undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Venue created', color: 'success' })
    router.push(`/venues/${created.id}`)
  } catch {
    addToast({ title: 'Error creating venue', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('venues.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('venues.form.name') }}</label>
        <UInput v-model="state.name" required />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('venues.form.address') }}</label>
        <UInput v-model="state.address" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('venues.form.capacity') }}</label>
        <UInput v-model="state.capacityStr" type="number" min="0" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('venues.form.notes') }}</label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/venues">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
