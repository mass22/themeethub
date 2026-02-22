<script setup lang="ts">
const { t } = useI18n()

const navLinks = [
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/events', key: 'nav.events' },
  { to: '/contacts', key: 'nav.contacts' },
  { to: '/venues', key: 'nav.venues' },
  { to: '/speakers', key: 'nav.speakers' },
  { to: '/sponsors', key: 'nav.sponsors' },
  { to: '/promo', key: 'nav.promo' },
  { to: '/logistics', key: 'nav.logistics' },
  { to: '/contractors', key: 'nav.contractors' },
  { to: '/tools', key: 'nav.tools' },
  { to: '/social', key: 'nav.social' },
  { to: '/requests', key: 'nav.requests' }
]
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center flex-wrap gap-2">
      <NuxtLink to="/" class="text-white text-2xl font-bold">
        {{ t('app.title') }}
      </NuxtLink>
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-white hover:text-gray-300 px-2 py-1 text-sm"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>