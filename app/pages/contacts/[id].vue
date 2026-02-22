<script setup lang="ts">
import type { Contact } from '~/types/contact'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const store = useContactsStore()

const id = route.params.id as string
const contact = ref<Contact | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    contact.value = store.byId(id) ?? await store.fetchById(id)
    if (!contact.value) error.value = 'Contact not found'
  } catch {
    error.value = 'Contact not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => router.push('/contacts')

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('contacts.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="contact" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ contact.name }}</h1>
      <dl class="space-y-3">
        <div>
          <dt class="text-sm text-gray-500">{{ $t('contacts.form.email') }}</dt>
          <dd><a :href="`mailto:${contact.email}`" class="text-primary hover:underline">{{ contact.email }}</a></dd>
        </div>
        <div v-if="contact.phone">
          <dt class="text-sm text-gray-500">{{ $t('contacts.form.phone') }}</dt>
          <dd>{{ contact.phone }}</dd>
        </div>
        <div v-if="contact.notes">
          <dt class="text-sm text-gray-500">{{ $t('contacts.form.notes') }}</dt>
          <dd class="whitespace-pre-wrap">{{ contact.notes }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(contact.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
