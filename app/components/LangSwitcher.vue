<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

const switchLanguage = () => {
  const currentIndex = locales.value.findIndex(l => l.code === locale.value)
  const nextIndex = (currentIndex + 1) % locales.value.length
  const nextLocale = locales.value[nextIndex]
  setLocale(nextLocale.code)
}
</script>

<template>
  <button
    @click="switchLanguage"
    class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
  >
    <span class="text-lg">🌐</span>
    <span>{{ currentLocale?.name || locale }}</span>
  </button>
</template>
