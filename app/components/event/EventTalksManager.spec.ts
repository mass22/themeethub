import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import EventTalksManager from './EventTalksManager.vue'

vi.stubGlobal('useToast', () => ({
  add: vi.fn()
}))

describe('EventTalksManager', () => {
  const speakerOptions = [
    { label: 'Evan You', value: 'spk_001' },
    { label: 'Sarah Drasner', value: 'spk_002' }
  ]

  it('renders dropzone when talk has no file attached', () => {
    const wrapper = mount(EventTalksManager, {
      props: {
        eventId: 'evt_001',
        modelValue: [
          {
            id: 'talk_1',
            title: 'Intro to Nuxt',
            speakerId: 'spk_001',
            description: 'Getting started',
            slides: { type: 'file' }
          }
        ],
        speakerOptions
      },
      global: {
        components: {
          UInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          UTextarea: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          USelectMenu: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
            props: ['modelValue', 'items']
          },
          UButton: {
            template: '<button><slot /></button>',
            props: ['icon', 'size', 'color', 'variant']
          },
          UIcon: {
            template: '<i></i>',
            props: ['name']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Intro to Nuxt')
    expect(wrapper.text()).toContain('Glisser le PDF ou PPTX ici')
  })

  it('renders green badge when slide file is attached', () => {
    const wrapper = mount(EventTalksManager, {
      props: {
        eventId: 'evt_001',
        modelValue: [
          {
            id: 'talk_1',
            title: 'Architecture Vue',
            speakerId: 'spk_001',
            description: 'Architecture talk',
            slides: {
              type: 'file',
              fileUrl: 'https://media.themeethub.test/events/evt_001/slides/architecture-vue.pdf',
              fileName: 'architecture-vue.pdf',
              fileSize: 4404019
            }
          }
        ],
        speakerOptions
      },
      global: {
        components: {
          UInput: {
            template: '<input :value="modelValue" />',
            props: ['modelValue']
          },
          UTextarea: {
            template: '<textarea :value="modelValue" />',
            props: ['modelValue']
          },
          USelectMenu: {
            template: '<select><slot /></select>',
            props: ['modelValue', 'items']
          },
          UButton: {
            template: '<button><slot /></button>',
            props: ['icon', 'size', 'color', 'variant']
          },
          UIcon: {
            template: '<i></i>',
            props: ['name']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('architecture-vue.pdf')
    expect(wrapper.text()).toContain('4.2 Mo')
    expect(wrapper.text()).toContain('Remplacer')
    expect(wrapper.text()).toContain('Supprimer')
  })
})
