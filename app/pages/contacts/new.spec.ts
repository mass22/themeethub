// @vitest-environment jsdom
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NewContact from './new.vue'

const mockRouter = { push: vi.fn() }
const mockStore = { create: vi.fn(() => Promise.resolve({ id: 'ctc_test' })) }
const mockToast = { add: vi.fn() }

vi.mock('#app', () => ({
  useRouter: () => mockRouter,
  useToast: () => mockToast
}))

vi.mock('~/store/contacts', () => ({
  useContactsStore: () => mockStore
}))

describe('NewContact page', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(NewContact, {
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

  it('displays create form', () => {
    expect(wrapper.text()).toContain('contacts.create')
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has submit button', () => {
    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.exists()).toBe(true)
  })
})
