<script setup lang="ts">
import { z } from 'zod'
import type { LogisticsItemStatus } from '~/types/logisticsItem'

definePageMeta({ layout: 'default' })

const schema = z.object({
  eventId: z.string().min(1, 'Event required'),
  name: z.string().min(1, 'Name required'),
  category: z.string().optional(),
  ownerContactId: z.string().optional(),
  status: z.enum(['todo', 'ready', 'done']).default('todo'),
  notes: z.string().optional()
})

const route = useRoute()
const state = reactive({ eventId: '', name: '', category: '', ownerContactId: '', status: 'todo' as LogisticsItemStatus, notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useLogisticsItemsStore()
const eventsStore = useEventsStore()
const { add: addToast } = useToast()

onMounted(async () => {
  await Promise.all([eventsStore.fetchAll(), store.fetchAll()])
  const eventIdParam = route.query.eventId
  if (typeof eventIdParam === 'string' && eventIdParam) {
    state.eventId = eventIdParam
  }
})

const eventOptions = computed(() =>
  eventsStore.items.map((e) => ({ label: e.title, value: e.id }))
)

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
      eventId: state.eventId,
      name: state.name.trim(),
      category: state.category.trim() || undefined,
      ownerContactId: state.ownerContactId.trim() || undefined,
      status: state.status,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Logistics item created', color: 'success' })
    router.push(`/logistics/${created.id}`)
  } catch {
    addToast({ title: 'Error creating logistics item', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('logistics.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('logistics.form.event') }}</label>
        <USelectMenu
          :model-value="eventOptions.find(o => o.value === state.eventId)"
          :items="eventOptions"
          value-key="value"
          :placeholder="$t('logistics.form.eventPlaceholder')"
          class="w-full"
          @update:model-value="state.eventId = ($event as { value: string })?.value ?? ''"
        />
        <p v-if="errors.eventId" class="text-sm text-red-600 mt-1">{{ errors.eventId }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('logistics.form.name') }}</label>
        <UInput v-model="state.name" required />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('logistics.form.category') }}</label>
        <UInput v-model="state.category" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('logistics.form.status') }}</label>
        <USelect
          v-model="state.status"
          :items="[
            { label: $t('status.logistics.todo'), value: 'todo' },
            { label: $t('status.logistics.ready'), value: 'ready' },
            { label: $t('status.logistics.done'), value: 'done' }
          ]"
          value-key="value"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('logistics.form.notes') }}</label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/logistics">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
