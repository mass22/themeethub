<script setup lang="ts">
import AppSidebar from '../components/AppSidebar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex app-bg">
    <AppSidebar v-model:open="sidebarOpen" />

    <!-- Overlay mobile -->
    <div
      class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
      :class="sidebarOpen ? 'block' : 'hidden'"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar : hamburger (mobile) + page context -->
      <header class="sticky top-0 z-30 h-14 flex items-center gap-4 px-4 lg:px-6 pl-6 lg:pl-10 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          size="sm"
          class="lg:hidden"
          @click="sidebarOpen = true"
        />
        <div class="flex-1 min-w-0" />
      </header>

      <main class="flex-1 p-4 lg:p-6 pl-6 lg:pl-10 max-w-7xl mx-auto w-full">
        <slot />
      </main>
    </div>
  </div>
</template>
