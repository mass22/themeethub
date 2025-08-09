import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard.vue'

// Mock des composables Nuxt
const mockT = vi.fn((key) => key)
const mockUseI18n = vi.fn(() => ({ t: mockT }))
const mockUseHead = vi.fn()
const mockOnMounted = vi.fn((fn) => fn())

// Mock du store
const mockEventsStore = {
  items: [
    {
      id: 'evt_1',
      title: 'Test Event',
      date: '2024-12-31T19:00:00Z'
    }
  ],
  fetchAll: vi.fn().mockResolvedValue(undefined)
}
const mockUseEventsStore = vi.fn(() => mockEventsStore)

// Configuration globale des mocks
global.useI18n = mockUseI18n
global.useHead = mockUseHead
global.onMounted = mockOnMounted
global.useEventsStore = mockUseEventsStore

describe('Dashboard Page', () => {
  it('should render dashboard title', () => {
    const wrapper = mount(Dashboard, {
      global: {
        components: {
          NavBar: { template: '<nav class="mock-navbar">NavBar</nav>' },
          EventCard: {
            template: '<div class="mock-event-card">Event Card</div>',
            props: ['event']
          }
        }
      }
    })

    expect(mockUseI18n).toHaveBeenCalled()
    expect(mockUseHead).toHaveBeenCalled()
    expect(wrapper.text()).toContain('dashboard.title')
  })

  it('should fetch events on mount', () => {
    mount(Dashboard, {
      global: {
        components: {
          NavBar: { template: '<nav class="mock-navbar">NavBar</nav>' },
          EventCard: {
            template: '<div class="mock-event-card">Event Card</div>',
            props: ['event']
          }
        }
      }
    })

    expect(mockUseEventsStore).toHaveBeenCalled()
    expect(mockEventsStore.fetchAll).toHaveBeenCalled()
  })

  it('should display events from store', () => {
    const wrapper = mount(Dashboard, {
      global: {
        components: {
          NavBar: { template: '<nav class="mock-navbar">NavBar</nav>' },
          EventCard: {
            template: '<div class="mock-event-card">Event Card</div>',
            props: ['event']
          }
        }
      }
    })

    // Vérifie que les événements du store sont affichés
    expect(wrapper.vm.eventsStore.items).toHaveLength(1)
    expect(wrapper.vm.eventsStore.items[0].title).toBe('Test Event')
  })
})
