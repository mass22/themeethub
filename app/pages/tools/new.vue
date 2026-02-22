<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  type: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

const state = reactive({ name: '', type: '', url: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useToolsStore()
const { add: addToast } = useToast()

function validateForm() {
  const result = schema.safeParse(state)
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
    const created = await store.create({
      name: state.name.trim(),
      type: state.type.trim() || undefined,
      url: state.url.trim() || undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Tool created', color: 'success' })
    router.push(`/tools/${created.id}`)
  } catch {
    addToast({ title: 'Error creating tool', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('tools.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('tools.form.name') }}</label>
        <UInput v-model="state.name" required />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('tools.form.type') }}</label>
        <UInput v-model="state.type" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('tools.form.url') }}</label>
        <UInput v-model="state.url" type="url" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('tools.form.notes') }}</label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/tools">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
