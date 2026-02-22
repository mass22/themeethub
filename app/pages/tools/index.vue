<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useToolsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.tools') }}</h1>
    <UButton to="/tools/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="t in store.items" :key="t.id" :to="`/tools/${t.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ t.name }}</h3>
        <p v-if="t.type" class="text-sm text-gray-600">{{ t.type }}</p>
        <a v-if="t.url" :href="t.url" target="_blank" class="text-sm text-primary hover:underline">{{ t.url }}</a>
      </UCard>
    </NuxtLink>
  </div>
</template>
