<script setup lang="ts">
import NavBar from '../components/NavBar.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <NavBar />
    </header>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>