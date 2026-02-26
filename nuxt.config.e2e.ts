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
  css: ['~/app/assets/css/main.css'],
  alias: {
    '@': '.',
    '~': '.',
    '@@': '.',
    '~~': '.'
  },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt'],
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    }
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
    public: { appName: 'TheMeetHub' }
  },

  // Configuration Vite pour résoudre crypto.hash
  vite: {
    define: {
      'crypto.hash': 'globalThis.crypto.hash'
    }
  }
})
