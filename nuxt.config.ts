// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@': '.',
    '~': '.',
    '@@': '.',
    '~~': '.'
  },
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxt/image', '@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', iso: 'fr-CA', name: 'Français', file: 'fr.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_redirected', redirectOn: 'root' }
  },
  runtimeConfig: {
    useMocks: true,
    luma: { apiKey: '' },
    youtube: { apiKey: '' },
    public: { appName: 'TheMeetHub' }
  }
})