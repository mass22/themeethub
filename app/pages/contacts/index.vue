<script setup lang="ts">
definePageMeta({ layout: 'default' })

const store = useContactsStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.contacts') }}</h1>
    <UButton to="/contacts/new">{{ $t('common.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="c in store.items" :key="c.id" :to="`/contacts/${c.id}`" class="block">
      <UCard class="p-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold">{{ c.name }}</h3>
        <p class="text-sm text-gray-600">{{ c.email }}</p>
        <p v-if="c.phone" class="text-sm text-gray-500">{{ c.phone }}</p>
      </UCard>
    </NuxtLink>
  </div>
</template>
