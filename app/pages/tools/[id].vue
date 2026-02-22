<script setup lang="ts">
import type { Tool } from '~/types/tool'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = useToolsStore()

const id = route.params.id as string
const tool = ref<Tool | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (!store.loaded) await store.fetchAll()
    tool.value = store.byId(id) ?? await store.fetchById(id)
    if (!tool.value) error.value = 'Tool not found'
  } catch {
    error.value = 'Tool not found'
  } finally {
    loading.value = false
  }
})

const goBack = () => useRouter().push('/tools')

const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UButton variant="soft" icon="i-heroicons-arrow-left" class="mb-4" @click="goBack">
      {{ $t('tools.back') }}
    </UButton>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <UCard v-else-if="tool" class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-4">{{ tool.name }}</h1>
      <dl class="space-y-3">
        <div v-if="tool.type">
          <dt class="text-sm text-gray-500">{{ $t('tools.form.type') }}</dt>
          <dd>{{ tool.type }}</dd>
        </div>
        <div v-if="tool.url">
          <dt class="text-sm text-gray-500">{{ $t('tools.form.url') }}</dt>
          <dd><a :href="tool.url" target="_blank" class="text-primary hover:underline">{{ tool.url }}</a></dd>
        </div>
        <div v-if="tool.notes">
          <dt class="text-sm text-gray-500">{{ $t('tools.form.notes') }}</dt>
          <dd class="whitespace-pre-wrap">{{ tool.notes }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">{{ $t('common.updatedAt') }}</dt>
          <dd>{{ formatDate(tool.updatedAt) }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
