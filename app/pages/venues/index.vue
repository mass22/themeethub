<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useVenuesStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.venues') }}</h1>
    <UButton to="/venues/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="v in store.items" :key="v.id" :to="`/venues/${v.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ v.name }}</h3>
        <p v-if="v.address" class="text-sm text-gray-600">{{ v.address }}</p>
        <p v-if="v.capacity" class="text-sm text-gray-500">{{ $t('venues.capacity') }}: {{ v.capacity }}</p>
      </UCard>
    </NuxtLink>
  </div>
</template>
