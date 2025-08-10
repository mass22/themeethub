<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const store = useSpeakersStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.speakers') }}</h1>
    <UButton to="/speakers/new" class="mb-4">{{ $t('speakers.create') }}</UButton>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="speaker in store.items" :key="speaker.id" class="p-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <img
            v-if="speaker.avatar"
            :src="speaker.avatar"
            :alt="speaker.name"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div v-else class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span class="text-gray-600 font-semibold">{{ speaker.name.charAt(0) }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ speaker.name }}</h3>
          <p v-if="speaker.title" class="text-sm text-gray-500 truncate">{{ speaker.title }}</p>
          <p v-if="speaker.company" class="text-sm text-gray-500 truncate">{{ speaker.company }}</p>
        </div>
      </div>
      <div v-if="speaker.bio" class="mt-3">
        <p class="text-sm text-gray-600 line-clamp-3">{{ speaker.bio }}</p>
      </div>
    </UCard>
  </div>
</template>
