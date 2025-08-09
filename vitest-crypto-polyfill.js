// vitest-crypto-polyfill.js - Plugin Vite pour corriger crypto.hash
import { createHash } from 'node:crypto'

export function cryptoPolyfillPlugin() {
  return {
    name: 'crypto-polyfill',
    configResolved() {
      // Polyfill crypto.hash au moment de la résolution de la config
      if (!globalThis.crypto) {
        globalThis.crypto = {}
      }

      if (!globalThis.crypto.hash) {
        globalThis.crypto.hash = (algorithm) => createHash(algorithm)
      }

      if (!globalThis.crypto.randomUUID) {
        globalThis.crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
      }
    },
    buildStart() {
      // Double vérification au début du build
      if (!globalThis.crypto) {
        globalThis.crypto = {}
      }

      if (!globalThis.crypto.hash) {
        globalThis.crypto.hash = (algorithm) => createHash(algorithm)
      }
    }
  }
}
