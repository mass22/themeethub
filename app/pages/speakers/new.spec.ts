// @vitest-environment jsdom
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NewSpeaker from './new.vue'

const mockRouter = { push: vi.fn() }
const mockSpeakersStore = { create: vi.fn(() => Promise.resolve({ id: 'spk_test' })) }
const mockToast = { add: vi.fn() }

vi.mock('#app', () => ({
  useRouter: () => mockRouter,
  useToast: () => mockToast
}))

vi.mock('~/store/speakers', () => ({
  useSpeakersStore: () => mockSpeakersStore
}))

describe('NewSpeaker page', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(NewSpeaker, {
      global: {
        mocks: { $t: (k: string) => k },
        stubs: {
          UInput: { template: '<input v-bind="$attrs" />', inheritAttrs: false },
          UTextarea: { template: '<textarea v-bind="$attrs" />', inheritAttrs: false },
          UButton: { template: '<button v-bind="$attrs"><slot /></button>', inheritAttrs: false },
          UCard: { template: '<div v-bind="$attrs"><slot /></div>', inheritAttrs: false }
        }
      }
    })
  })

  it('affiche le formulaire de création', () => {
    expect(wrapper.text()).toContain('speakers.create')
    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#role').exists()).toBe(true)
    expect(wrapper.find('#bio').exists()).toBe(true)
  })

  it('le bouton Annuler navigue vers /speakers', () => {
    const cancelBtn = wrapper.find('a[href="/speakers"], [to="/speakers"]')
    expect(cancelBtn.exists()).toBe(true)
  })

  it('a un bouton de soumission', () => {
    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.exists()).toBe(true)
    expect(submitBtn.attributes('loading')).toBeDefined()
  })
})
