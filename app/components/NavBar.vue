<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import LangSwitcher from './LangSwitcher.vue'

const { t } = useI18n()
const localePath = useLocalePath()

const orgMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: t('nav.events'), to: localePath('/events'), icon: 'i-heroicons-calendar-days' },
    { label: t('nav.calendar'), to: localePath('/calendar'), icon: 'i-heroicons-calendar' }
  ],
  [
    { type: 'separator' }
  ],
  [
    { label: t('nav.contacts'), to: localePath('/contacts'), icon: 'i-heroicons-user-group' },
    { label: t('nav.venues'), to: localePath('/venues'), icon: 'i-heroicons-building-office-2' },
    { label: t('nav.speakers'), to: localePath('/speakers'), icon: 'i-heroicons-microphone' },
    { label: t('nav.sponsors'), to: localePath('/sponsors'), icon: 'i-heroicons-banknotes' }
  ],
  [
    { type: 'separator' }
  ],
  [
    { label: t('nav.promo'), to: localePath('/promo'), icon: 'i-heroicons-megaphone' },
    { label: t('nav.logistics'), to: localePath('/logistics'), icon: 'i-heroicons-clipboard-document-list' },
    { label: t('nav.contractors'), to: localePath('/contractors'), icon: 'i-heroicons-briefcase' },
    { label: t('nav.tools'), to: localePath('/tools'), icon: 'i-heroicons-wrench-screwdriver' },
    { label: t('nav.social'), to: localePath('/social'), icon: 'i-heroicons-share-social' }
  ],
  [
    { type: 'separator' }
  ],
  [
    { label: t('nav.externalCommunities'), to: localePath('/external-communities'), icon: 'i-heroicons-globe-alt' },
    { label: t('nav.requests'), to: localePath('/requests'), icon: 'i-heroicons-inbox' }
  ]
])
</script>

<template>
  <nav class="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
    <NuxtLink :to="localePath('/')" class="text-lg font-bold text-gray-900 dark:text-white hover:opacity-80">
      {{ t('app.title') }}
    </NuxtLink>
    <div class="flex items-center gap-2 flex-wrap">
      <NuxtLink
        :to="localePath('/dashboard')"
        class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {{ t('nav.dashboard') }}
      </NuxtLink>
      <UDropdownMenu :items="orgMenuItems">
        <UButton
          variant="soft"
          color="neutral"
          :label="t('nav.organization')"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
      </UDropdownMenu>
      <ClientOnly>
        <LangSwitcher />
        <template #fallback>
          <span class="text-sm">🌐</span>
        </template>
      </ClientOnly>
    </div>
  </nav>
</template>