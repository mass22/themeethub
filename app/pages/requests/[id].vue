<script setup lang="ts">
import type { Request, RequestStatus } from '~/types/request'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const requestsStore = useRequestsStore()

const requestId = route.params.id as string
const request = ref<Request | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const updating = ref(false)
const converting = ref(false)
const sponsorsStore = useSponsorsStore()
const speakersStore = useSpeakersStore()
const { add: addToast } = useToast()

const canConvertToSpeaker = computed(() => {
  if (!request.value || request.value.type !== 'speaker') return false
  return ['validated', 'in_progress', 'closed'].includes(request.value.status)
})

const NEXT_STATUS: Partial<Record<RequestStatus, RequestStatus>> = {
  new: 'exploring_call',
  exploring_call: 'validated',
  validated: 'in_progress',
  in_progress: 'closed'
}

const canReject = computed(() => {
  if (!request.value) return false
  return !['closed', 'rejected'].includes(request.value.status)
})

const nextStatus = computed(() => (request.value ? NEXT_STATUS[request.value.status] : null))

useHead(() => ({ title: `${request.value?.name ?? t('requests.title')} · ${t('app.title')}` }))

onMounted(async () => {
  try {
    if (!requestsStore.loaded) await requestsStore.fetchAll()
    const found = requestsStore.byId(requestId)
    if (!found) {
      error.value = t('requests.notFound')
      return
    }
    request.value = found
  } catch (err) {
    error.value = t('requests.errorLoad')
    console.error(err)
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/requests')

const updateStatus = async (status: RequestStatus) => {
  if (!request.value || updating.value) return
  try {
    updating.value = true
    const updated = await requestsStore.patchStatus(request.value.id, status)
    request.value = updated
  } catch (err) {
    console.error(err)
  } finally {
    updating.value = false
  }
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const convertToSpeaker = async () => {
  if (!request.value || request.value.type !== 'speaker' || converting.value) return
  try {
    converting.value = true
    const speaker = await speakersStore.create({
      name: request.value.name,
      role: request.value.role ?? undefined
    })
    addToast({ title: 'Intervenant créé', color: 'success' })
    router.push(`/speakers/${speaker.id}`)
  } catch (e: unknown) {
    const err = e as { statusCode?: number; data?: { speakerId?: string } }
    if (err.statusCode === 409 && err.data?.speakerId) {
      addToast({ title: 'Un intervenant existe déjà avec ce nom et ce rôle', color: 'error' })
      router.push(`/speakers/${err.data.speakerId}`)
    } else {
      addToast({ title: t('requests.error'), color: 'error' })
    }
  } finally {
    converting.value = false
  }
}

const convertToSponsor = async () => {
  if (!request.value || request.value.type !== 'sponsor' || converting.value) return
  const companyName = request.value.companyName?.trim() || request.value.name
  if (!companyName) {
    addToast({ title: t('requests.error'), color: 'error' })
    return
  }
  try {
    converting.value = true
    const sponsor = await sponsorsStore.create({
      companyName,
      contactName: request.value.name,
      contactEmail: request.value.email
    })
    addToast({ title: 'Sponsor créé', color: 'success' })
    router.push(`/sponsors/${sponsor.id}`)
  } catch (e: unknown) {
    const err = e as { statusCode?: number }
    if (err.statusCode === 409) {
      addToast({ title: 'Un sponsor existe déjà avec cette entreprise et cet email', color: 'error' })
    } else {
      addToast({ title: t('requests.error'), color: 'error' })
    }
  } finally {
    converting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
        {{ t('requests.back') }}
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ t('requests.error') }}</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <div v-else-if="request" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div class="flex items-center gap-3 mb-3">
          <UBadge
            :label="t(request.type === 'sponsor' ? 'requests.badge.sponsor' : 'requests.badge.speaker')"
            :color="request.type === 'sponsor' ? 'primary' : 'info'"
            size="md"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ request.name }}</h1>

        <div class="space-y-4 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('requests.email') }}</h3>
            <p class="text-gray-900">{{ request.email }}</p>
          </div>
          <div v-if="request.type === 'sponsor' && request.companyName">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('requests.companyLabel') }}</h3>
            <p class="text-gray-900">{{ request.companyName }}</p>
          </div>
          <div v-else-if="request.type === 'speaker' && request.role">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('requests.roleLabel') }}</h3>
            <p class="text-gray-900">{{ request.role }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('requests.statusLabel') }}</h3>
            <p class="text-gray-900">{{ t(`requests.status.${request.status}`) }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('requests.createdAt') }}</h3>
            <p class="text-gray-900">{{ formatDate(request.createdAt) }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton
            v-if="canConvertToSpeaker"
            :loading="converting"
            variant="soft"
            color="info"
            @click="convertToSpeaker"
          >
            {{ t('requests.convertToSpeaker') }}
          </UButton>
          <UButton
            v-if="request.type === 'sponsor'"
            :loading="converting"
            variant="soft"
            color="success"
            @click="convertToSponsor"
          >
            {{ t('requests.convertToSponsor') }}
          </UButton>
          <UButton
            v-if="nextStatus"
            :loading="updating"
            color="primary"
            @click="updateStatus(nextStatus!)"
          >
            {{ t('requests.nextStatus', { status: t(`requests.status.${nextStatus}`) }) }}
          </UButton>
          <UButton
            v-if="canReject"
            :loading="updating"
            color="error"
            variant="soft"
            @click="updateStatus('rejected')"
          >
            {{ t('requests.reject') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
