// https://nuxt.com/docs/api/configuration/nuxt-config
const mainConfig = defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  srcDir: 'app',
  icon: { serverBundle: 'remote' },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt'],
  components: [
    { path: 'components', pathPrefix: false }
  ],
  imports: { dirs: ['store'] },
  ssr: false,

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000
      }
    },
    // Doc Nuxt UI Editor : évite les erreurs ProseMirror « keyed plugin » en dev
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
        '@fullcalendar/core',
        'better-auth/vue',
        'better-auth/client/plugins',
        'zod'
      ]
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
    useMocks: false,
    luma: { apiKey: '' },
    youtube: { apiKey: '' },
    calSponsorLink: '',
    calSpeakerLink: '',
    fromEmail: '',
    public: {
      appName: 'TheMeetHub',
      /** Affiche « Continuer avec GitHub » (définir NUXT_PUBLIC_GITHUB_AUTH=true + clés serveur) */
      githubAuth: false,
      /** Activé uniquement par nuxt.config.e2e.ts pour les tests Playwright. */
      e2eBypassAuth: false,
    }
  }
})

export default process.env.NUXT_E2E === '1'
  ? (await import('./nuxt.config.e2e')).default
  : mainConfig