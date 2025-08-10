// vitest.setup.ts - Setup global pour tous les tests
import { createHash } from 'node:crypto'
import { vi } from 'vitest'

// POLYFILL IMMÉDIAT - pas dans beforeAll
console.log('🔧 Application du polyfill crypto.hash...')

// Forcer la création de l'objet crypto si nécessaire
try {
  if (!globalThis.crypto) {
    globalThis.crypto = {} as any
  }

  // Forcer l'ajout de crypto.hash
  if (!(globalThis.crypto as any).hash) {
    (globalThis.crypto as any).hash = (algorithm: string) => createHash(algorithm)
  }

  // Forcer l'ajout de crypto.randomUUID
  if (!globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = () => `test-uuid-${Math.random().toString(36).substr(2, 9)}` as any
  }

  console.log('✅ Polyfill crypto.hash appliqué avec succès')
} catch (error) {
  console.error('❌ Erreur lors de l\'application du polyfill:', error)
}

// Mocks pour les fonctions Nuxt dans les tests API
if (!globalThis.defineEventHandler) {
  globalThis.defineEventHandler = vi.fn((handler) => handler)
}

if (!globalThis.useDataSource) {
  globalThis.useDataSource = vi.fn(() => ({
    listEvents: vi.fn(() => []),
    getEventById: vi.fn(() => null),
    createEvent: vi.fn(() => ({ id: 'evt_test' }))
  }))
}

// Auto-imports pour les composables Nuxt
if (!globalThis.useRouter) {
  globalThis.useRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn()
  })
}

if (!globalThis.useToast) {
  globalThis.useToast = () => ({
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn()
  })
}

if (!globalThis.useEventsStore) {
  globalThis.useEventsStore = () => ({
    events: [],
    create: vi.fn(() => Promise.resolve({ id: 'test-event-id' })),
    fetch: vi.fn(),
    fetchById: vi.fn()
  })
}

// Auto-imports pour Vue (reactive, ref, etc.)
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue'

if (!globalThis.reactive) {
  globalThis.reactive = reactive
}

if (!globalThis.ref) {
  globalThis.ref = ref
}

if (!globalThis.computed) {
  globalThis.computed = computed
}

if (!globalThis.watch) {
  globalThis.watch = watch
}

if (!globalThis.watchEffect) {
  globalThis.watchEffect = watchEffect
}

if (!globalThis.onMounted) {
  globalThis.onMounted = onMounted
}

if (!globalThis.onUnmounted) {
  globalThis.onUnmounted = onUnmounted
}
