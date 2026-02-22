<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useContractorsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.contractors') }}</h1>
    <UButton to="/contractors/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="c in store.items" :key="c.id" :to="`/contractors/${c.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ c.name }}</h3>
        <p v-if="c.role" class="text-sm text-gray-600">{{ c.role }}</p>
        <p v-if="c.rate" class="text-sm text-gray-500">{{ $t('contractors.rate') }}: {{ c.rate }}</p>
      </UCard>
    </NuxtLink>
  </div>
</template>
