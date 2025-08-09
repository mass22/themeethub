import { mount } from '@vue/test-utils'
import EventCard from './EventCard.vue'

describe('EventCard', () => {
  it('affiche le titre et la date', () => {
    const wrapper = mount(EventCard, {
      props: {
        event: {
          id: 'e1',
          slug: 'test-event',
          title: 'Test Event',
          date: '2025-01-01T00:00:00Z',
          speakers: []
        }
      },
      global: {
        // Mock des composants Nuxt UI
        components: {
          UCard: {
            template: `
              <div class="mock-card">
                <div class="header"><slot name="header" /></div>
                <div class="body"><slot /></div>
                <div class="footer"><slot name="footer" /></div>
              </div>
            `,
            props: ['variant', 'class']
          },
          UButton: {
            template: '<button class="mock-button"><slot /></button>',
            props: ['to', 'variant']
          }
        },
        // Mock de la fonction d'internationalisation
        mocks: {
          $t: (key: string) => key
        }
      }
    })
    expect(wrapper.text()).toContain('Test Event')
    expect(wrapper.text()).toMatch(/2024|2025/)
  })
})
