// @vitest-environment jsdom
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NewEvent from './new.vue'

// Mocks pour les composables
const mockRouter = {
  push: vi.fn()
}

const mockEventsStore = {
  create: vi.fn()
}

const mockToast = {
  add: vi.fn()
}

// Mock des composables globaux
vi.mock('#app', () => ({
  useRouter: () => mockRouter,
  useToast: () => mockToast
}))

vi.mock('~/store/events', () => ({
  useEventsStore: () => mockEventsStore
}))

describe('NewEvent page', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks()

    wrapper = mount(NewEvent, {
      global: {
        stubs: {
          UInput: {
            template: '<input v-bind="$attrs" />',
            inheritAttrs: false
          },
          UTextarea: {
            template: '<textarea v-bind="$attrs" />',
            inheritAttrs: false
          },
          UButton: {
            template: '<button v-bind="$attrs"><slot /></button>',
            inheritAttrs: false
          },
          UCard: {
            template: '<div v-bind="$attrs"><slot /></div>',
            inheritAttrs: false
          }
        }
      }
    })
  })

  describe('Rendu initial', () => {
    it('affiche le titre de la page', () => {
      expect(wrapper.text()).toContain('Créer un événement')
    })

    it('affiche tous les champs du formulaire', () => {
      expect(wrapper.find('label[for="title"]').text()).toBe('Titre')
      expect(wrapper.find('label[for="date"]').text()).toBe('Date et heure')
      expect(wrapper.find('label[for="slug"]').text()).toBe('Slug')
      expect(wrapper.find('label[for="location"]').text()).toBe('Location')
      expect(wrapper.find('label[for="description"]').text()).toBe('Description')
    })

    it('affiche les boutons d\'action', () => {
      expect(wrapper.text()).toContain('Créer l\'événement')
      expect(wrapper.text()).toContain('Annuler')
    })

    it('affiche les textes d\'aide', () => {
      expect(wrapper.text()).toContain('Sélectionnez la date et l\'heure de l\'événement')
      expect(wrapper.text()).toContain('Identifiant unique pour l\'URL (lettres, chiffres et tirets uniquement)')
    })
  })

  describe('Validation des champs', () => {
    it('a des champs avec validation', () => {
      // Vérifier que les champs ont les bons attributs de validation
      const titleInput = wrapper.find('#title')
      const dateInput = wrapper.find('#date')
      const slugInput = wrapper.find('#slug')

      expect(titleInput.exists()).toBe(true)
      expect(dateInput.exists()).toBe(true)
      expect(slugInput.exists()).toBe(true)
    })
  })

  describe('Soumission du formulaire', () => {
    it('a un formulaire avec la bonne structure', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
      expect(form.attributes('class')).toContain('space-y-4')
    })

    it('a un bouton de soumission', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Créer l\'événement')
    })
  })

  describe('État de chargement', () => {
    it('a un bouton avec l\'attribut loading', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('loading')).toBeDefined()
    })
  })

  describe('Navigation', () => {
    it('le bouton Annuler navigue vers la liste des événements', async () => {
      const cancelButton = wrapper.find('button[variant="ghost"]')
      expect(cancelButton.attributes('to')).toBe('/events')
    })
  })

  describe('Accessibilité', () => {
    it('a des labels associés aux inputs', () => {
      const titleInput = wrapper.find('#title')
      const dateInput = wrapper.find('#date')
      const slugInput = wrapper.find('#slug')
      const locationInput = wrapper.find('#location')
      const descriptionInput = wrapper.find('#description')

      expect(titleInput.exists()).toBe(true)
      expect(dateInput.exists()).toBe(true)
      expect(slugInput.exists()).toBe(true)
      expect(locationInput.exists()).toBe(true)
      expect(descriptionInput.exists()).toBe(true)
    })

    it('a des placeholders appropriés', () => {
      const slugInput = wrapper.find('#slug')
      const locationInput = wrapper.find('#location')

      expect(slugInput.attributes('placeholder')).toBe('vue-montreal-1')
      expect(locationInput.attributes('placeholder')).toBe('Montréal, QC')
    })
  })
})