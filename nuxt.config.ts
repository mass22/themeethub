// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  srcDir: 'app',
  icon: { serverBundle: 'remote' },
  css: ['~/app/assets/css/main.css'],
  alias: {
    '~': '.',
    '@': '.'
  },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt'],
  plugins: ['~/app/plugins/fullcalendar.client.ts'],
  components: [
    { path: 'app/components', pathPrefix: false }
  ],
  imports: { dirs: ['store'] },
  ssr: false,

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000
      }
    }
  },

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
    calSponsorLink: '',
    calSpeakerLink: '',
    fromEmail: '',
    public: { appName: 'TheMeetHub' }
  }
})