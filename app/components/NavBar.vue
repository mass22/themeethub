<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-white text-2xl font-bold">
        {{ t('app.title') }}
      </NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="text-white hover:text-gray-300">
          {{ t('nav.dashboard') }}
        </NuxtLink>
        <NuxtLink to="/events" class="text-white hover:text-gray-300">
          {{ t('nav.events') }}
        </NuxtLink>
        <NuxtLink to="/speakers" class="text-white hover:text-gray-300">
          {{ t('nav.speakers') }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>