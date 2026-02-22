<script setup lang="ts">
import { z } from 'zod'
import type { SocialPostStatus } from '~/types/socialPost'

definePageMeta({ layout: 'default' })

const schema = z.object({
  eventId: z.string().min(1, 'Event required'),
  platform: z.string().optional(),
  copy: z.string().optional(),
  scheduledAt: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'posted']).default('draft'),
  assetLinks: z.array(z.string()).optional()
})

const route = useRoute()
const state = reactive({ eventId: '', platform: '', copy: '', scheduledAt: '', status: 'draft' as SocialPostStatus })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = useSocialPostsStore()
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
      platform: state.platform.trim() || undefined,
      copy: state.copy.trim() || undefined,
      scheduledAt: state.scheduledAt || undefined,
      status: state.status
    })
    addToast({ title: 'Social post created', color: 'success' })
    router.push(`/social/${created.id}`)
  } catch {
    addToast({ title: 'Error creating social post', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('social.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('social.form.event') }}</label>
        <USelectMenu
          :model-value="eventOptions.find(o => o.value === state.eventId)"
          :items="eventOptions"
          value-key="value"
          :placeholder="$t('social.form.eventPlaceholder')"
          class="w-full"
          @update:model-value="state.eventId = ($event as { value: string })?.value ?? ''"
        />
        <p v-if="errors.eventId" class="text-sm text-red-600 mt-1">{{ errors.eventId }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('social.form.platform') }}</label>
        <UInput v-model="state.platform" placeholder="Twitter, LinkedIn, etc." />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('social.form.copy') }}</label>
        <UTextarea v-model="state.copy" :rows="4" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('social.form.scheduledAt') }}</label>
        <UInput v-model="state.scheduledAt" type="datetime-local" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('social.form.status') }}</label>
        <USelect
          v-model="state.status"
          :items="[
            { label: $t('status.social.draft'), value: 'draft' },
            { label: $t('status.social.scheduled'), value: 'scheduled' },
            { label: $t('status.social.posted'), value: 'posted' }
          ]"
          value-key="value"
        />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/social">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
