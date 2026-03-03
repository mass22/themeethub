<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// /speakers/edit sans id -> redirection vers la liste
await navigateTo('/speakers', { replace: true })
</script>

<template>
  <div />
</template>
