<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useExternalCommunitiesStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-4">
      <h1 class="text-2xl font-bold">{{ $t('externalCommunities.title') }}</h1>
      <UButton to="/external-communities/new">{{ $t('common.create') }}</UButton>
    </div>
    <div v-if="store.items.length === 0" class="py-8 text-center text-gray-500">
      {{ $t('externalCommunities.empty') }}
    </div>
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="c in store.items" :key="c.id" :to="`/external-communities/${c.id}`" class="block">
        <UCard class="p-4 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-semibold">{{ c.name }}</h3>
          <p v-if="c.url" class="text-sm text-gray-600 truncate">{{ c.url }}</p>
          <p v-if="c.notes" class="text-sm text-gray-700 line-clamp-2 mt-1">{{ c.notes }}</p>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
