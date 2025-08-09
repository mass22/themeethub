// vitest.setup.ts - Setup global pour tous les tests
import { createHash } from 'node:crypto'

// POLYFILL IMMÉDIAT - pas dans beforeAll
console.log('🔧 Application du polyfill crypto.hash...')

// Forcer la création de l'objet crypto si nécessaire
try {
  if (!globalThis.crypto) {
    globalThis.crypto = {}
  }

  // Forcer l'ajout de crypto.hash
  if (!globalThis.crypto.hash) {
    globalThis.crypto.hash = (algorithm) => createHash(algorithm)
  }

  // Forcer l'ajout de crypto.randomUUID
  if (!globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  }

  console.log('✅ Polyfill crypto.hash appliqué avec succès')
} catch (error) {
  console.error('❌ Erreur lors de l\'application du polyfill:', error)
}
