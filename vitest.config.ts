// vitest.config.ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'pathe'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    // Forcer le rechargement des modules à chaque test
    pool: 'forks',
    // Inclure seulement nos fichiers de test unitaires
    include: [
      'app/**/*.{spec,test}.ts',
      'server/**/*.{spec,test}.ts',
      'tests/unit/**/*.{spec,test}.ts',
      'tests/nuxt/**/*.{spec,test}.ts',
      'tests/integration/**/*.{spec,test}.ts',
      'tests/integration-db/**/*.{spec,test}.ts'
    ],
    // Exclure node_modules, tests E2E et autres répertoires non pertinents
    exclude: [
      'node_modules/**',
      'dist/**',
      '.output/**',
      '.nuxt/**',
      'tests/e2e/**'
    ]
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '#app': resolve(__dirname, 'node_modules/nuxt/dist/app'),
      '#ui': resolve(__dirname, 'node_modules/@nuxt/ui/dist/runtime/components')
    }
  }
})
