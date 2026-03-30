<script setup lang="ts">
import type { Sponsor } from '~~/types/sponsor'

defineProps<{ sponsor: Sponsor }>()
</script>

<template>
  <UCard variant="subtle" class="overflow-hidden">
    <template #header>
      <div class="p-4 pb-0 flex items-center gap-4">
        <img
          v-if="sponsor.logoUrl"
          :src="sponsor.logoUrl"
          :alt="sponsor.companyName"
          class="h-12 w-12 object-contain rounded"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold">{{ sponsor.companyName }}</h3>
            <UBadge size="xs" variant="soft">
              {{ $t(`sponsors.types.${sponsor.type || 'financial'}`) }}
            </UBadge>
          </div>
          <a
            v-if="sponsor.websiteUrl"
            :href="sponsor.websiteUrl"
            target="_blank"
            rel="noopener"
            class="text-sm text-primary hover:underline truncate block"
          >
            {{ sponsor.websiteUrl }}
          </a>
        </div>
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
