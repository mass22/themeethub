<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  role: z.string().optional(),
  contactId: z.string().optional(),
  rate: z.number().optional(),
  notes: z.string().optional()
})

const state = reactive({ name: '', role: '', contactId: '', rateStr: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useContractorsStore()
const { add: addToast } = useToast()


function validateForm() {
  const rate = state.rateStr ? parseFloat(state.rateStr) : undefined
  const result = schema.safeParse({
    ...state,
    rate: rate !== undefined && !Number.isNaN(rate) ? rate : undefined,
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
    const rate = state.rateStr ? parseFloat(state.rateStr) : undefined
    const created = await store.create({
      name: state.name.trim(),
      role: state.role.trim() || undefined,
      contactId: state.contactId || undefined,
      rate: rate !== undefined && !Number.isNaN(rate) ? rate : undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Contractor created', color: 'success' })
    router.push(`/contractors/${created.id}`)
  } catch {
    addToast({ title: 'Error creating contractor', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('contractors.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('contractors.form.name') }}</label>
        <UInput v-model="state.name" required />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('contractors.form.role') }}</label>
        <UInput v-model="state.role" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('contractors.form.rate') }}</label>
        <UInput v-model="state.rateStr" type="number" step="0.01" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('contractors.form.contact') }}</label>
        <UInput v-model="state.contactId" :placeholder="$t('contractors.form.contactPlaceholder')" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('contractors.form.notes') }}</label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/contractors">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
