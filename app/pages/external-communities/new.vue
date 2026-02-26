<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  url: z.string().optional(),
  notes: z.string().optional()
})

const state = reactive({ name: '', url: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useExternalCommunitiesStore()
const { add: addToast } = useToast()

function validateForm() {
  const result = schema.safeParse(state)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string
      if (field && field in state) (errors as Record<string, string>)[field] = issue.message
    })
    return false
  }
  Object.keys(errors).forEach((k) => { (errors as Record<string, string>)[k] = '' })
  return true
}

async function onSubmit() {
  if (!validateForm()) {
    addToast({ title: 'Please fix errors', color: 'error' })
    return
  }
  pending.value = true
  try {
    const created = await store.create({
      name: state.name.trim(),
      url: state.url.trim() || undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'External community created', color: 'success' })
    router.push(`/external-communities/${created.id}`)
  } catch {
    addToast({ title: 'Error creating community', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('externalCommunities.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalCommunities.form.name') }}</label>
        <UInput v-model="state.name" required />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalCommunities.form.url') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <UInput v-model="state.url" type="url" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalCommunities.form.notes') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/external-communities">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
