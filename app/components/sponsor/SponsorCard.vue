<script setup lang="ts">
import type { Sponsor } from '~/types/sponsor'

defineProps<{ sponsor: Sponsor }>()
</script>

<template>
  <UCard variant="subtle" class="overflow-hidden">
    <template #header>
      <div class="p-4 pb-0">
        <h3 class="text-lg font-semibold">{{ sponsor.companyName }}</h3>
      </div>
    </template>
    <div class="px-4">
      <p class="text-sm opacity-70">{{ sponsor.contactName }}</p>
      <p class="text-sm opacity-70">{{ sponsor.contactEmail }}</p>
    </div>
    <template #footer>
      <div class="p-4 pt-2">
        <UButton :to="`/sponsors/${sponsor.id}`" variant="soft">{{ $t('sponsors.open') }}</UButton>
      </div>
    </template>
  </UCard>
</template>
