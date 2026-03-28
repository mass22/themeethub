<script setup lang="ts">
import LangSwitcher from './LangSwitcher.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const isOpen = defineModel<boolean>('open', { default: false })

const mainNav = [
  { label: t('nav.dashboard'), to: localePath('/dashboard'), icon: 'i-heroicons-squares-2x2' },
  { label: t('nav.events'), to: localePath('/events'), icon: 'i-heroicons-calendar-days' },
  { label: t('nav.calendar'), to: localePath('/calendar'), icon: 'i-heroicons-calendar' }
]

const orgNav = [
  { label: t('nav.contacts'), to: localePath('/contacts'), icon: 'i-heroicons-user-group' },
  { label: t('nav.venues'), to: localePath('/venues'), icon: 'i-heroicons-building-office-2' },
  { label: t('nav.speakers'), to: localePath('/speakers'), icon: 'i-heroicons-microphone' },
  { label: t('nav.sponsors'), to: localePath('/sponsors'), icon: 'i-heroicons-banknotes' }
]

const opsNav = [
  { label: t('nav.promo'), to: localePath('/promo'), icon: 'i-heroicons-megaphone' },
  { label: t('nav.logistics'), to: localePath('/logistics'), icon: 'i-heroicons-clipboard-document-list' },
  { label: t('nav.contractors'), to: localePath('/contractors'), icon: 'i-heroicons-briefcase' },
  { label: t('nav.tools'), to: localePath('/tools'), icon: 'i-heroicons-wrench-screwdriver' },
  { label: t('nav.social'), to: localePath('/social'), icon: 'i-heroicons-share' }
]

const otherNav = [
  { label: t('nav.externalCommunities'), to: localePath('/external-communities'), icon: 'i-heroicons-globe-alt' },
  { label: t('nav.requests'), to: localePath('/requests'), icon: 'i-heroicons-inbox' }
]

const navGroups = [
  { items: mainNav },
  { title: t('nav.organization'), items: orgNav },
  { title: t('home.modules'), items: opsNav },
  { items: otherNav }
]
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xl transition-transform duration-300 -translate-x-full lg:translate-x-0"
    :class="isOpen && 'translate-x-0'"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-14 px-4 border-b border-slate-200/80 dark:border-slate-700/80 shrink-0">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
        <span class="flex w-8 h-8 items-center justify-center rounded-lg bg-primary-500/15 text-primary-600 dark:text-primary-400">
          <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
        </span>
        {{ t('app.title') }}
      </NuxtLink>
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="xs"
        class="lg:hidden"
        @click="isOpen = false"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <div v-for="(group, gIdx) in navGroups" :key="gIdx" class="space-y-1">
        <h3
          v-if="group.title"
          class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {{ group.title }}
        </h3>
        <div class="space-y-0.5">
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
            @click="isOpen = false"
          >
            <UIcon :name="item.icon" class="w-5 h-5 shrink-0 opacity-70" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Footer: lang + actions -->
    <div class="shrink-0 p-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
      <div class="flex gap-2">
        <UButton :to="localePath('/events/new')" color="primary" size="sm" block class="flex-1">
          {{ t('home.createEvent') }}
        </UButton>
      </div>
      <LangSwitcher />
    </div>
  </aside>
</template>
