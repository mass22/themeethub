<script setup lang="ts">
import { z } from 'zod'
import type { PromoItemStatus } from '~/types/promoItem'

definePageMeta({ layout: 'default' })

const schema = z.object({
  eventId: z.string().optional(),
  title: z.string().min(1, 'Title required'),
  channel: z.string().optional(),
  dueAt: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  copy: z.string().optional(),
  assetLinks: z.array(z.string()).optional(),
  notes: z.string().optional()
})

const route = useRoute()
const state = reactive({ eventId: '', title: '', channel: '', dueAt: '', status: 'todo' as PromoItemStatus, copy: '', assetLinksStr: '', notes: '' })
const errors = reactive<Record<string, string>>({})
const pending = ref(false)
const router = useRouter()
const store = usePromoItemsStore()
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
  const payload = {
    ...state,
    eventId: state.eventId.trim() || undefined,
    assetLinks: state.assetLinksStr ? state.assetLinksStr.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : undefined
  }
  const result = schema.safeParse(payload)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = (issue.path[0] === 'assetLinks' ? 'assetLinksStr' : issue.path[0]) as string
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
      eventId: state.eventId.trim() || undefined,
      title: state.title.trim(),
      channel: state.channel.trim() || undefined,
      dueAt: state.dueAt || undefined,
      status: state.status,
      copy: state.copy.trim() || undefined,
      assetLinks: state.assetLinksStr ? state.assetLinksStr.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : undefined,
      notes: state.notes.trim() || undefined
    })
    addToast({ title: 'Promo item created', color: 'success' })
    router.push(`/promo/${created.id}`)
  } catch {
    addToast({ title: 'Error creating promo item', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold mb-4">{{ $t('promo.create') }}</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.event') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
        <USelectMenu
          :model-value="eventOptions.find(o => o.value === state.eventId)"
          :items="eventOptions"
          value-key="value"
          :placeholder="$t('promo.form.eventPlaceholder')"
          class="w-full"
          @update:model-value="state.eventId = ($event as { value: string })?.value ?? ''"
        />
        <p v-if="errors.eventId" class="text-sm text-red-600 mt-1">{{ errors.eventId }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.title') }}</label>
        <UInput v-model="state.title" required />
        <p v-if="errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.channel') }}</label>
        <UInput v-model="state.channel" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.copy') }}</label>
        <UTextarea v-model="state.copy" :rows="3" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.assetLinks') }}</label>
        <UTextarea v-model="state.assetLinksStr" :rows="2" :placeholder="$t('promo.form.assetLinksPlaceholder')" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.dueAt') }}</label>
        <UInput v-model="state.dueAt" type="datetime-local" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.status') }}</label>
        <USelect
          v-model="state.status"
          :items="[
            { label: $t('status.promo.todo'), value: 'todo' },
            { label: $t('status.promo.in_progress'), value: 'in_progress' },
            { label: $t('status.promo.done'), value: 'done' }
          ]"
          value-key="value"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('promo.form.notes') }}</label>
        <UTextarea v-model="state.notes" :rows="3" />
      </div>
      <div class="flex gap-2">
        <UButton :loading="pending" type="submit">{{ $t('common.submit') }}</UButton>
        <UButton variant="ghost" to="/promo">{{ $t('common.cancel') }}</UButton>
      </div>
    </form>
  </UCard>
</template>
