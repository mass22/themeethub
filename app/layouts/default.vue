<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UContainer class="py-6">
    <header class="flex items-center justify-between mb-6">
      <p class="text-xl font-semibold">{{ t('app.title') }}</p>

      <ClientOnly>
        <LangSwitcher />
        <template #fallback>
          <div class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
            <span class="text-lg">🌐</span>
            <span>Français</span>
          </div>
        </template>
      </ClientOnly>
    </header>

    <main>
      <slot />
    </main>
  </UContainer>
</template>