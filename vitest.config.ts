// vitest.config.ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'pathe'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue({
    // Désactiver la génération de hash pour éviter l'erreur crypto.hash
    template: {
      compilerOptions: {
        // 'tag' n'est pas utilisé, donc on le préfixe avec un underscore pour éviter l'avertissement lint
        isCustomElement: (_tag) => false
      }
    }
  })],
  test: {
    globals: true,
    environment: 'happy-dom',
    // Inclure seulement nos fichiers de test unitaires
    include: [
      'app/**/*.{spec,test}.ts',
      'server/**/*.{spec,test}.ts',
      'tests/unit/**/*.{spec,test}.ts'
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
    alias: { '~': resolve(__dirname, '.'), '@': resolve(__dirname, '.') }
  }
})
