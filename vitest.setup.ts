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

if (!globalThis.definePageMeta) {
  globalThis.definePageMeta = vi.fn()
}

// Only mock useDataSource when NUXT_USE_MOCKS is true (default for tests).
// integration-db tests set NUXT_USE_MOCKS=false and use real dataSource.
if (!globalThis.useDataSource && process.env.NUXT_USE_MOCKS !== 'false') {
  globalThis.useDataSource = vi.fn(() => ({
    listEvents: vi.fn(() => []),
    getEvent: vi.fn(() => null),
    createEvent: vi.fn(() => ({ id: 'evt_test' })),
    listSpeakers: vi.fn(() => []),
    getSpeaker: vi.fn(() => null),
    createSpeaker: vi.fn((data: any) => Promise.resolve({
      id: 'spk_test',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    findSpeakerByNameAndRole: vi.fn(() => null),
    listRequests: vi.fn(() => []),
    getRequest: vi.fn(() => null),
    createRequest: vi.fn((data: any) => Promise.resolve({ id: 'req_test', ...data })),
    patchRequestStatus: vi.fn(() => null),
    listSponsors: vi.fn(() => []),
    getSponsor: vi.fn(() => null),
    createSponsor: vi.fn((data: any) => Promise.resolve({
      id: 'spo_test',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    findSponsorByCompanyAndEmail: vi.fn(() => null),
    updateSpeaker: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    updateSponsor: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listContacts: vi.fn(() => []),
    getContact: vi.fn(() => null),
    createContact: vi.fn((data: any) => Promise.resolve({ id: 'ctc_test', ...data, createdAt: '', updatedAt: '' })),
    updateContact: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listVenues: vi.fn(() => []),
    getVenue: vi.fn(() => null),
    createVenue: vi.fn((data: any) => Promise.resolve({ id: 'ven_test', ...data, createdAt: '', updatedAt: '' })),
    updateVenue: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listContractors: vi.fn(() => []),
    getContractor: vi.fn(() => null),
    createContractor: vi.fn((data: any) => Promise.resolve({ id: 'cns_test', ...data, createdAt: '', updatedAt: '' })),
    updateContractor: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listTools: vi.fn(() => []),
    getTool: vi.fn(() => null),
    createTool: vi.fn((data: any) => Promise.resolve({ id: 'tls_test', ...data, createdAt: '', updatedAt: '' })),
    updateTool: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listPromoItems: vi.fn(() => []),
    getPromoItem: vi.fn(() => null),
    createPromoItem: vi.fn((data: any) => Promise.resolve({ id: 'prm_test', ...data, createdAt: '', updatedAt: '' })),
    updatePromoItem: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listLogisticsItems: vi.fn(() => []),
    getLogisticsItem: vi.fn(() => null),
    createLogisticsItem: vi.fn((data: any) => Promise.resolve({ id: 'lgs_test', ...data, createdAt: '', updatedAt: '' })),
    updateLogisticsItem: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listSocialPosts: vi.fn(() => []),
    getSocialPost: vi.fn(() => null),
    createSocialPost: vi.fn((data: any) => Promise.resolve({ id: 'soc_test', ...data, createdAt: '', updatedAt: '' })),
    updateSocialPost: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listExternalCommunities: vi.fn(() => []),
    getExternalCommunity: vi.fn(() => null),
    createExternalCommunity: vi.fn((data: any) => Promise.resolve({ id: 'ext_test', ...data, createdAt: '', updatedAt: '' })),
    updateExternalCommunity: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listExternalEvents: vi.fn(() => []),
    getExternalEvent: vi.fn(() => null),
    createExternalEvent: vi.fn((data: any) => Promise.resolve({ id: 'exe_test', ...data, createdAt: '', updatedAt: '' })),
    updateExternalEvent: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    listParticipations: vi.fn(() => []),
    getParticipation: vi.fn(() => null),
    createParticipation: vi.fn((data: any) => Promise.resolve({ id: 'par_test', ...data, createdAt: '', updatedAt: '' })),
    updateParticipation: vi.fn((id: string, data: any) => Promise.resolve({ id, ...data }))
  }))
}

// Auto-imports pour les composables Nuxt
if (!globalThis.useLocalePath) {
  globalThis.useLocalePath = () => (path: string) => path
}

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

if (!globalThis.useSpeakersStore) {
  globalThis.useSpeakersStore = () => ({
    items: [],
    create: vi.fn(() => Promise.resolve({ id: 'spk_test', name: 'Test' })),
    fetchAll: vi.fn(),
    byId: vi.fn()
  })
}

if (!globalThis.useSponsorsStore) {
  globalThis.useSponsorsStore = () => ({
    items: [],
    create: vi.fn(() => Promise.resolve({ id: 'spo_test', companyName: 'Test Corp', contactName: 'Test', contactEmail: 'test@example.com', createdAt: '', updatedAt: '' })),
    fetchAll: vi.fn(),
    fetchById: vi.fn(),
    byId: vi.fn()
  })
}

const createStoreMock = (idPrefix: string) => ({
  items: [],
  loaded: false,
  fetchAll: vi.fn(),
  fetchById: vi.fn((id: string) => Promise.resolve({ id, name: 'test' })),
  create: vi.fn((data: any) => Promise.resolve({ id: `${idPrefix}_test`, ...data, createdAt: '', updatedAt: '' })),
  byId: vi.fn(() => null)
})

if (!globalThis.useContactsStore) globalThis.useContactsStore = () => createStoreMock('ctc')
if (!globalThis.useVenuesStore) globalThis.useVenuesStore = () => createStoreMock('ven')
if (!globalThis.useContractorsStore) globalThis.useContractorsStore = () => createStoreMock('cns')
if (!globalThis.useToolsStore) globalThis.useToolsStore = () => createStoreMock('tls')
if (!globalThis.usePromoItemsStore) globalThis.usePromoItemsStore = () => createStoreMock('prm')
if (!globalThis.useLogisticsItemsStore) globalThis.useLogisticsItemsStore = () => createStoreMock('lgs')
if (!globalThis.useSocialPostsStore) globalThis.useSocialPostsStore = () => createStoreMock('soc')

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
