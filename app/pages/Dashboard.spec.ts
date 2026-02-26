import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard.vue'

const mockT = vi.fn((key: string) => key)
const mockUseI18n = vi.fn(() => ({ t: mockT }))
const mockUseHead = vi.fn()
const mockLocalePath = (path: string) => path

global.useI18n = mockUseI18n
global.useHead = mockUseHead
global.useLocalePath = vi.fn(() => mockLocalePath)
global.useEventsStore = vi.fn(() => ({ items: [], fetchAll: vi.fn() }))
global.useRequestsStore = vi.fn(() => ({ byStatus: new Map(), fetchAll: vi.fn() }))
global.usePromoItemsStore = vi.fn(() => ({ items: [], fetchAll: vi.fn() }))
global.useLogisticsItemsStore = vi.fn(() => ({ items: [], fetchAll: vi.fn() }))

const mountOptions = {
  global: { stubs: ['UButton', 'UBadge', 'NuxtLink'] }
}

describe('Dashboard Page', () => {
  it('should render page with dashboard title', () => {
    const wrapper = mount(Dashboard, mountOptions)

    expect(mockUseI18n).toHaveBeenCalled()
    expect(mockUseHead).toHaveBeenCalled()
    expect(wrapper.text()).toContain('dashboard.title')
  })
})
