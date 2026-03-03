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
    class="flex items-center gap-2 px-3 py-2 w-full text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
  >
    <UIcon name="i-heroicons-language" class="w-4 h-4" />
    <span>{{ currentLocale?.name || locale }}</span>
  </button>
</template>
