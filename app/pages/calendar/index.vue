<script setup lang="ts">
import CalendarView from '../../components/calendar/CalendarView.vue'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
useHead(() => ({ title: `${t('calendar.title')} · ${t('app.title')}` }))
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('calendar.title') }}</h1>
    <CalendarView />
  </div>
</template>
