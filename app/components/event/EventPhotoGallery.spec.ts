import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import EventPhotoGallery from './EventPhotoGallery.vue'

vi.stubGlobal('useToast', () => ({
  add: vi.fn()
}))

vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([]))

describe('EventPhotoGallery', () => {
  it('renders gallery header, dropzone and import button', () => {
    const wrapper = mount(EventPhotoGallery, {
      props: {
        eventId: 'evt_001',
        initialPhotos: [
          {
            id: 'pho_1',
            thumbUrl: 'https://media.themeethub.test/events/evt_001/photos/thumb/photo1.webp',
            fullUrl: 'https://media.themeethub.test/events/evt_001/photos/full/photo1.webp',
            caption: 'Salle comble',
            order: 0,
            isCover: true
          },
          {
            id: 'pho_2',
            thumbUrl: 'https://media.themeethub.test/events/evt_001/photos/thumb/photo2.webp',
            fullUrl: 'https://media.themeethub.test/events/evt_001/photos/full/photo2.webp',
            caption: 'Networking',
            order: 1,
            isCover: false
          }
        ]
      },
      global: {
        components: {
          UButton: {
            template: '<button><slot /></button>',
            props: ['icon', 'size', 'color', 'variant', 'loading', 'disabled']
          },
          UBadge: {
            template: '<span><slot /></span>',
            props: ['color', 'variant', 'size']
          },
          UIcon: {
            template: '<i></i>',
            props: ['name']
          },
          UInput: {
            template: '<input :value="modelValue" />',
            props: ['modelValue', 'placeholder']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Galerie Photos')
    expect(wrapper.text()).toContain('2 photos')
    expect(wrapper.text()).toContain('Glisser-déposer vos photos ici')
    expect(wrapper.text()).toContain('Importer depuis R2')
    expect(wrapper.text()).toContain('⭐ Couverture')
    expect(wrapper.text()).toContain('#1')
    expect(wrapper.text()).toContain('#2')
  })
})
