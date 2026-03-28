// Configuration Nuxt spéciale pour les tests E2E
import { createHash } from 'node:crypto'

// Polyfill pour crypto.hash avant d'importer Nuxt
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {},
    writable: true
  })
}

if (!globalThis.crypto.hash) {
  Object.defineProperty(globalThis.crypto, 'hash', {
    value: (algorithm: string) => createHash(algorithm),
    writable: true
  })
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }, // Désactivé pour les tests
  srcDir: 'app',
  /** Même mode que la config principale : le bundle local manque parfois certains noms heroicons en dev. */
  icon: { serverBundle: 'remote' },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt'],
  components: [
    {
      path: 'components',
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: ['store']
  },
  ssr: false,

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
    public: {
      appName: 'TheMeetHub',
      /** Désactive la redirection login pour les tests Playwright (nuxt dev --config-file nuxt.config.e2e.ts). */
      e2eBypassAuth: true,
    },
  },

  // Aligné sur nuxt.config.ts : évite re-optimisation + reload pendant les e2e (fetch annulés → createFetchError).
  vite: {
    define: {
      'crypto.hash': 'globalThis.crypto.hash'
    },
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
  }
})
