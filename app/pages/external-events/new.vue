<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const schema = z.object({
  communityId: z.string().min(1, 'Community required'),
  title: z.string().min(1, 'Title required'),
  startAt: z.string().min(1, 'Start date required'),
  location: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

const route = useRoute()
const state = reactive({ communityId: '', title: '', startAt: '', location: '', url: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const eventsStore = useExternalEventsStore()
const communitiesStore = useExternalCommunitiesStore()
const { add: addToast } = useToast()

onMounted(async () => {
  await Promise.all([communitiesStore.fetchAll(), eventsStore.fetchAll()])
  const communityIdParam = route.query.communityId
  if (typeof communityIdParam === 'string' && communityIdParam) {
    state.communityId = communityIdParam
  }
})

const communityOptions = computed(() =>
  communitiesStore.items.map((c) => ({ label: c.name, value: c.id }))
)

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
    const created = await eventsStore.create({
      communityId: state.communityId,
      title: state.title.trim(),
      startAt: state.startAt ? new Date(state.startAt).toISOString() : '',
      location: state.location.trim() || undefined,
      url: state.url.trim() || undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'External event created', color: 'success' })
    router.push(`/external-events/${created.id}`)
  } catch {
    addToast({ title: 'Error creating event', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('externalEvents.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.community') }}</label>
        <USelectMenu
          :model-value="communityOptions.find(o => o.value === state.communityId)"
          :items="communityOptions"
          value-key="value"
          :placeholder="$t('externalEvents.form.communityPlaceholder')"
          class="w-full"
          @update:model-value="state.communityId = ($event as { value: string })?.value ?? ''"
        />
        <p v-if="errors.communityId" class="text-sm text-red-600 mt-1">{{ errors.communityId }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.title') }}</label>
        <UInput v-model="state.title" required />
        <p v-if="errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.startAt') }}</label>
        <UInput v-model="state.startAt" type="datetime-local" required />
        <p v-if="errors.startAt" class="text-sm text-red-600 mt-1">{{ errors.startAt }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.location') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <UInput v-model="state.location" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.url') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <UInput v-model="state.url" type="url" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('externalEvents.form.notes') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/external-events">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
