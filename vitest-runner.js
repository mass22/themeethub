#!/usr/bin/env node

// vitest-runner.js - Script pour forcer le polyfill crypto.hash
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'

// Forcer le polyfill crypto.hash AVANT de lancer vitest
if (!globalThis.crypto) {
  globalThis.crypto = {}
}

if (!globalThis.crypto.hash) {
  globalThis.crypto.hash = (algorithm) => createHash(algorithm)
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
}

console.log('🔧 Polyfill crypto.hash appliqué')

// Lancer vitest
const vitestProcess = spawn('npx', ['vitest', 'run'], {
  stdio: 'inherit'
})

vitestProcess.on('exit', (code) => {
  process.exit(code)
})
