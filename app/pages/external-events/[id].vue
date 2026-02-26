<script setup lang="ts">
import type { ExternalEvent } from '~/types/externalEvent'
import type { Participation, ParticipationIntent, ParticipationStatus } from '~/types/participation'

definePageMeta({ layout: 'default' })

const route = useRoute()
const eventsStore = useExternalEventsStore()
const communitiesStore = useExternalCommunitiesStore()
const participationsStore = useParticipationsStore()
const { add: addToast } = useToast()

const id = route.params.id as string
const event = ref<ExternalEvent | null>(null)
const participations = ref<Participation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const statusPatching = ref(false)
const showPlanForm = ref(false)
const planForm = reactive({
  intent: 'attend' as ParticipationIntent,
  followUpDueAt: '',
  notes: '',
  status: 'planned' as ParticipationStatus
})
const planPending = ref(false)

const communityName = computed(() => {
  if (!event.value) return null
  return communitiesStore.byId(event.value.communityId)?.name ?? event.value.communityId
})

onMounted(async () => {
  try {
    if (!eventsStore.loaded) await eventsStore.fetchAll()
    if (!communitiesStore.loaded) await communitiesStore.fetchAll()
    event.value = eventsStore.byId(id) ?? await eventsStore.fetchById(id)
    if (!event.value) {
      error.value = 'Event not found'
    } else {
      participations.value = await $fetch<Participation[]>(`/api/participations?externalEventId=${id}`)
    }
  } catch {
    error.value = 'Event not found'
  } finally {
    loading.value = false
  }
})

async function changeParticipationStatus(p: Participation, newStatus: ParticipationStatus) {
  if (p.status === newStatus) return
  statusPatching.value = true
  try {
    const updated = await participationsStore.patch(p.id, { status: newStatus })
    const idx = participations.value.findIndex((x) => x.id === p.id)
    if (idx >= 0) participations.value[idx] = updated
    addToast({ title: 'Status updated', color: 'success' })
  } catch {
    addToast({ title: 'Error updating status', color: 'error' })
  } finally {
    statusPatching.value = false
  }
}

async function onSubmitPlan() {
  planPending.value = true
  try {
    const created = await participationsStore.create({
      externalEventId: id,
      intent: planForm.intent,
      followUpDueAt: planForm.followUpDueAt ? new Date(planForm.followUpDueAt).toISOString() : undefined,
      notes: planForm.notes.trim() || undefined,
      status: planForm.status
    })
    participations.value.push(created)
    showPlanForm.value = false
    planForm.intent = 'attend'
    planForm.followUpDueAt = ''
    planForm.notes = ''
    addToast({ title: 'Participation planned', color: 'success' })
  } catch {
    addToast({ title: 'Error creating participation', color: 'error' })
  } finally {
    planPending.value = false
  }
}

const goBack = () => useRouter().push('/external-events')
const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('externalEvents.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="event" class="space-y-6">
      <UCard class="max-w-2xl">
        <h1 class="text-2xl font-bold mb-4">{{ event.title }}</h1>
        <dl class="space-y-3">
          <div v-if="communityName">
            <dt class="text-sm text-gray-500">{{ $t('externalEvents.form.community') }}</dt>
            <dd>
              <NuxtLink :to="`/external-communities/${event.communityId}`" class="text-primary hover:underline">{{ communityName }}</NuxtLink>
            </dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">{{ $t('externalEvents.form.startAt') }}</dt>
            <dd>{{ formatDate(event.startAt) }}</dd>
          </div>
          <div v-if="event.location">
            <dt class="text-sm text-gray-500">{{ $t('externalEvents.form.location') }}</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div v-if="event.url">
            <dt class="text-sm text-gray-500">{{ $t('externalEvents.form.url') }}</dt>
            <dd>
              <a :href="event.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ event.url }}</a>
            </dd>
          </div>
          <div v-if="event.notes">
            <dt class="text-sm text-gray-500">{{ $t('externalEvents.form.notes') }}</dt>
            <dd class="whitespace-pre-wrap">{{ event.notes }}</dd>
          </div>
        </dl>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">{{ $t('externalEvents.participations') }}</h2>
          <UButton v-if="!showPlanForm" size="sm" @click="showPlanForm = true">
            {{ $t('promo.planParticipation') }}
          </UButton>
        </div>

        <form v-if="showPlanForm" class="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" @submit.prevent="onSubmitPlan">
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('participations.form.intent') }}</label>
            <USelect
              v-model="planForm.intent"
              :items="[
                { label: $t('participations.intent.attend'), value: 'attend' },
                { label: $t('participations.intent.network'), value: 'network' },
                { label: $t('participations.intent.ask_promo'), value: 'ask_promo' },
                { label: $t('participations.intent.propose_talk'), value: 'propose_talk' },
                { label: $t('participations.intent.sponsor'), value: 'sponsor' }
              ]"
              value-key="value"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('participations.form.followUpDueAt') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
            <UInput v-model="planForm.followUpDueAt" type="datetime-local" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('participations.form.notes') }} <span class="text-gray-400">({{ $t('common.optional') }})</span></label>
            <UTextarea v-model="planForm.notes" :rows="2" />
          </div>
          <div class="flex gap-2">
            <UButton :loading="planPending" type="submit" size="sm">{{ $t('common.submit') }}</UButton>
            <UButton variant="ghost" size="sm" @click="showPlanForm = false">{{ $t('common.cancel') }}</UButton>
          </div>
        </form>

        <div v-if="participations.length === 0 && !showPlanForm" class="text-sm text-gray-500 py-4">
          {{ $t('externalEvents.noParticipations') }}
        </div>
        <ul v-else class="space-y-2">
          <li v-for="p in participations" :key="p.id" class="flex flex-wrap items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <UBadge :label="$t(`participations.intent.${p.intent}`)" color="neutral" size="xs" />
            <UBadge :label="$t(`participations.status.${p.status}`)" :color="p.status === 'done' ? 'green' : 'gray'" size="xs" />
            <span v-if="p.followUpDueAt" class="text-sm text-gray-600">{{ formatDate(p.followUpDueAt) }}</span>
            <span v-if="p.notes" class="text-sm truncate">{{ p.notes }}</span>
            <USelectMenu
              :model-value="{ label: $t(`participations.status.${p.status}`), value: p.status }"
              :items="[
                { label: $t('participations.status.planned'), value: 'planned' },
                { label: $t('participations.status.done'), value: 'done' }
              ]"
              value-key="value"
              :disabled="statusPatching"
              size="xs"
              @update:model-value="changeParticipationStatus(p, ($event as { value: ParticipationStatus })?.value ?? p.status)"
            />
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
