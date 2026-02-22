<script setup lang="ts">
import type { Request } from '~/types/request'

defineProps<{ request: Request }>()

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
</script>

<template>
  <UCard variant="subtle" class="overflow-hidden">
    <template #header>
      <div class="p-4 pb-0">
        <div class="flex items-center gap-2 mb-1">
          <UBadge
            :label="$t(request.type === 'sponsor' ? 'requests.badge.sponsor' : 'requests.badge.speaker')"
            :color="request.type === 'sponsor' ? 'primary' : 'info'"
            size="xs"
          />
        </div>
        <h3 class="text-lg font-semibold">{{ request.name }}</h3>
        <p class="text-sm text-gray-500">{{ request.email }}</p>
      </div>
    </template>
    <div class="px-4 space-y-1">
      <p v-if="request.type === 'sponsor' && request.companyName" class="text-sm">
        <span class="text-gray-500">{{ $t('requests.companyLabel') }}:</span> {{ request.companyName }}
      </p>
      <p v-else-if="request.type === 'speaker' && request.role" class="text-sm">
        <span class="text-gray-500">{{ $t('requests.roleLabel') }}:</span> {{ request.role }}
      </p>
      <p class="text-xs text-gray-400">
        {{ $t('requests.createdAt') }}: {{ formatDate(request.createdAt) }}
      </p>
    </div>
    <template #footer>
      <div class="p-4 pt-2">
        <UButton :to="`/requests/${request.id}`" variant="soft">{{ $t('requests.open') }}</UButton>
      </div>
    </template>
  </UCard>
</template>
