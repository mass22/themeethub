<script setup lang="ts">
import type { EventTalk, EventTalkSlide } from '~~/types/event'

const props = defineProps<{
  modelValue: EventTalk[]
  eventId: string
  speakerOptions: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EventTalk[]): void
  (e: 'change'): void
}>()

const { add: addToast } = useToast()

const talks = ref<EventTalk[]>([])
const uploadProgress = ref<Record<string, number>>({})
const isUploading = ref<Record<string, boolean>>({})
const fileInputs = ref<Record<string, HTMLInputElement | null>>({})

// Sync initial value
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      talks.value = []
      return
    }
    // Assurer que chaque talk a une structure slides valide
    talks.value = val.map((t) => ({
      ...t,
      slides: t.slides || { type: 'file' }
    }))
  },
  { immediate: true, deep: true }
)

function updateTalks() {
  emit('update:modelValue', talks.value)
  emit('change')
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function addTalk() {
  const newTalk: EventTalk = {
    id: `talk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    slug: '',
    speakerId: null,
    description: '',
    slides: {
      type: 'file',
      fileUrl: null,
      fileName: null,
      fileSize: null,
      linkUrl: ''
    }
  }
  talks.value.push(newTalk)
  updateTalks()
}

function removeTalk(index: number) {
  talks.value.splice(index, 1)
  updateTalks()
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '0 Mo'
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function triggerFileInput(talkId: string) {
  const input = fileInputs.value[talkId]
  if (input) {
    input.value = ''
    input.click()
  }
}

function handleFileSelect(talk: EventTalk, event: Event) {
  const target = event.target as HTMLInputElement
  if (target?.files && target.files[0]) {
    uploadSlideFile(talk, target.files[0])
  }
}

function handleDrop(talk: EventTalk, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadSlideFile(talk, event.dataTransfer.files[0])
  }
}

function uploadSlideFile(talk: EventTalk, file: File) {
  const allowed = ['.pdf', '.pptx', '.ppt', '.key']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowed.includes(ext)) {
    addToast({
      title: 'Format non supporté',
      description: 'Veuillez glisser un fichier PDF ou PPTX.',
      color: 'error'
    })
    return
  }

  isUploading.value[talk.id] = true
  uploadProgress.value[talk.id] = 0

  const talkSlug = talk.slug || slugify(talk.title || 'talk') || 'talk'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('talkSlug', talkSlug)
  formData.append('talkTitle', talk.title || '')

  const xhr = new XMLHttpRequest()
  xhr.open('POST', `/api/events/${props.eventId}/slides`)

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      uploadProgress.value[talk.id] = Math.round((e.loaded / e.total) * 100)
    }
  }

  xhr.onload = () => {
    isUploading.value[talk.id] = false
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const res = JSON.parse(xhr.responseText)
        if (!talk.slides) talk.slides = { type: 'file' }
        talk.slides.type = 'file'
        talk.slides.fileUrl = res.url
        talk.slides.fileName = res.fileName
        talk.slides.fileSize = res.fileSize
        talk.slug = talkSlug
        updateTalks()
        addToast({
          title: 'Support uploadé',
          description: `${res.fileName} a été envoyé sur R2`,
          color: 'success'
        })
      } catch (e) {
        addToast({ title: 'Erreur lors de l\'upload', color: 'error' })
      }
    } else {
      addToast({ title: 'Erreur serveur lors de l\'upload', color: 'error' })
    }
  }

  xhr.onerror = () => {
    isUploading.value[talk.id] = false
    addToast({ title: 'Erreur réseau lors de l\'upload', color: 'error' })
  }

  xhr.send(formData)
}

async function deleteSlideFile(talk: EventTalk) {
  if (!talk.slides?.fileUrl) return
  const urlToDelete = talk.slides.fileUrl

  try {
    await $fetch(`/api/events/${props.eventId}/slides`, {
      method: 'DELETE',
      query: { url: urlToDelete }
    })
    talk.slides.fileUrl = null
    talk.slides.fileName = null
    talk.slides.fileSize = null
    updateTalks()
    addToast({ title: 'Fichier supprimé', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de la suppression du fichier', color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="talks.length === 0" class="text-center py-6 border border-dashed rounded-lg bg-gray-50/50 dark:bg-gray-800/20">
      <UIcon name="i-heroicons-presentation-chart-bar" class="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-500 mb-3">Aucun talk / présentation configuré pour cet événement.</p>
      <UButton size="sm" icon="i-heroicons-plus" @click="addTalk">
        Ajouter un talk / présentation
      </UButton>
    </div>

    <div
      v-for="(talk, index) in talks"
      :key="talk.id || index"
      class="border rounded-lg p-5 bg-white dark:bg-gray-900 shadow-sm space-y-4"
    >
      <!-- En-tête du talk -->
      <div class="flex items-center justify-between pb-3 border-b">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
            {{ index + 1 }}
          </span>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100">
            {{ talk.title ? talk.title : `Talk #${index + 1}` }}
          </h4>
        </div>
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-heroicons-trash"
          @click="removeTalk(index)"
        >
          Supprimer ce talk
        </UButton>
      </div>

      <!-- Champs habituels : Titre, Speaker, Description -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre du talk
          </label>
          <UInput
            v-model="talk.title"
            placeholder="Ex. Scaler Vue 3 en entreprise"
            class="w-full"
            @update:model-value="updateTalks"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Speaker
          </label>
          <USelectMenu
            :model-value="talk.speakerId ?? undefined"
            :items="props.speakerOptions"
            value-key="value"
            placeholder="Sélectionner un speaker"
            class="w-full"
            @update:model-value="talk.speakerId = typeof $event === 'string' ? $event : ($event as { value?: string } | null)?.value ?? null; updateTalks()"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <UTextarea
          v-model="talk.description"
          placeholder="Résumé de la présentation, sujets abordés..."
          class="w-full"
          :rows="2"
          @update:model-value="updateTalks"
        />
      </div>

      <!-- Bloc Supports de présentation -->
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Supports de présentation
          </label>
          <!-- Sélecteur d'options : 2 onglets / switch -->
          <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800">
            <button
              type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="(!talk.slides || talk.slides.type === 'file') ? 'bg-white dark:bg-gray-700 text-primary shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-700'"
              @click="talk.slides = talk.slides || { type: 'file' }; talk.slides.type = 'file'; updateTalks()"
            >
              📄 Fichier (R2)
            </button>
            <button
              type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="talk.slides?.type === 'link' ? 'bg-white dark:bg-gray-700 text-primary shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-700'"
              @click="talk.slides = talk.slides || { type: 'link' }; talk.slides.type = 'link'; updateTalks()"
            >
              🔗 Lien externe
            </button>
          </div>
        </div>

        <!-- Onglet 1 : Fichier (Upload direct R2) -->
        <div v-if="!talk.slides || talk.slides.type === 'file'" class="mt-3">
          <input
            :ref="(el) => { fileInputs[talk.id] = el as HTMLInputElement }"
            type="file"
            accept=".pdf,.pptx,.ppt,.key"
            class="hidden"
            @change="handleFileSelect(talk, $event)"
          />

          <!-- État 1 : Fichier déjà uploadé (Badge vert + boutons Supprimer / Remplacer) -->
          <div
            v-if="talk.slides?.fileUrl && !isUploading[talk.id]"
            class="flex items-center justify-between p-3 rounded-lg bg-green-50/80 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xl">📄</span>
              <div class="truncate">
                <span class="font-medium text-green-900 dark:text-green-100 text-sm">
                  {{ talk.slides.fileName || 'support-presentation.pdf' }}
                </span>
                <span class="text-xs text-green-700 dark:text-green-300 ml-2">
                  ({{ formatFileSize(talk.slides.fileSize) }})
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <UButton
                size="xs"
                variant="outline"
                color="neutral"
                icon="i-heroicons-arrow-path"
                @click="triggerFileInput(talk.id)"
              >
                🔄 Remplacer
              </UButton>
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="deleteSlideFile(talk)"
              >
                🗑️ Supprimer
              </UButton>
            </div>
          </div>

          <!-- État 2 : En cours d'upload avec barre de progression -->
          <div
            v-else-if="isUploading[talk.id]"
            class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2"
          >
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span class="flex items-center gap-1.5">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin h-3.5 w-3.5 text-primary" />
                Upload vers R2 en cours...
              </span>
              <span class="font-bold">{{ uploadProgress[talk.id] }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-200"
                :style="{ width: `${uploadProgress[talk.id]}%` }"
              />
            </div>
          </div>

          <!-- État 3 : Dropzone vide -->
          <div
            v-else
            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors bg-gray-50/40 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            @dragover.prevent
            @dragenter.prevent
            @drop="handleDrop(talk, $event)"
            @click="triggerFileInput(talk.id)"
          >
            <UIcon name="i-heroicons-arrow-up-tray" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
              Glisser le PDF ou PPTX ici
            </p>
            <p class="text-xs text-gray-400 mt-1">
              ou cliquer pour parcourir (R2: events/{{ eventId }}/slides/...)
            </p>
          </div>
        </div>

        <!-- Onglet 2 : Lien externe -->
        <div v-else class="mt-3">
          <UInput
            v-model="talk.slides.linkUrl"
            type="url"
            placeholder="https://speakerdeck.com/... ou https://slides.domain.com/..."
            icon="i-heroicons-link"
            class="w-full"
            @update:model-value="updateTalks"
          />
          <p class="text-xs text-gray-400 mt-1">
            Idéal pour Slidev hébergé, Speaker Deck, Google Slides, Notion, etc.
          </p>
        </div>
      </div>
    </div>

    <div v-if="talks.length > 0" class="pt-2">
      <UButton
        size="sm"
        variant="outline"
        icon="i-heroicons-plus"
        @click="addTalk"
      >
        Ajouter un autre talk
      </UButton>
    </div>
  </div>
</template>
