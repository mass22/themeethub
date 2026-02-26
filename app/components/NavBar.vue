<script setup lang="ts">
import LangSwitcher from './LangSwitcher.vue'

const { t } = useI18n()
const localePath = useLocalePath()

const navLinks = [
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/events', key: 'nav.events' },
  { to: '/calendar', key: 'nav.calendar' },
  { to: '/contacts', key: 'nav.contacts' },
  { to: '/venues', key: 'nav.venues' },
  { to: '/speakers', key: 'nav.speakers' },
  { to: '/sponsors', key: 'nav.sponsors' },
  { to: '/promo', key: 'nav.promo' },
  { to: '/external-communities', key: 'nav.externalCommunities' },
  { to: '/logistics', key: 'nav.logistics' },
  { to: '/contractors', key: 'nav.contractors' },
  { to: '/tools', key: 'nav.tools' },
  { to: '/social', key: 'nav.social' },
  { to: '/requests', key: 'nav.requests' }
]
</script>

<template>
  <nav class="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
    <NuxtLink :to="localePath('/')" class="text-lg font-bold text-gray-900 dark:text-white hover:opacity-80">
      {{ t('app.title') }}
    </NuxtLink>
    <div class="flex items-center gap-2 flex-wrap">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="localePath(link.to)"
        class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {{ t(link.key) }}
      </NuxtLink>
      <ClientOnly>
        <LangSwitcher />
        <template #fallback>
          <span class="text-sm">🌐</span>
        </template>
      </ClientOnly>
    </div>
  </nav>
</template>