import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

// @vitest-environment node
describe('Nuxt server API /api/events', async () => {
  await setup({
    server: true,
    nuxtConfig: {
      runtimeConfig: {
        useMocks: true,
        public: { e2eBypassAuth: true }
      }
    }
  })

  it('GET /api/events retourne un tableau', async () => {
    const data = await $fetch('/api/events')
    expect(Array.isArray(data)).toBe(true)
  })
})
