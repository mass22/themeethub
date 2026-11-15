<script setup lang="ts">
import type { EventPhoto, Event } from '~~/types/event'

const props = defineProps<{
  eventId: string
  modelValue?: EventPhoto[]
  initialPhotos?: EventPhoto[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EventPhoto[]): void
  (e: 'change', value: EventPhoto[]): void
  (e: 'coverChange', url: string): void
}>()

const { add: addToast } = useToast()

const photos = ref<EventPhoto[]>([])
const loadingPhotos = ref(false)
const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

interface UploadItem {
  id: string
  fileName: string
  previewUrl: string
  progress: number
  status: 'compressing' | 'uploading' | 'done' | 'error'
}

const uploadingQueue = ref<UploadItem[]>([])

// Import R2 Modal
const isImportModalOpen = ref(false)
const importPrefix = ref('')
const isImporting = ref(false)

// Drag and drop reordering
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

watch(
  () => [props.modelValue, props.initialPhotos],
  ([modelVal, initialVal]) => {
    const source = (modelVal && modelVal.length > 0) ? modelVal : initialVal
    if (source && source.length > 0) {
      photos.value = [...source].sort((a, b) => a.order - b.order)
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  if ((!props.modelValue || props.modelValue.length === 0) && (!props.initialPhotos || props.initialPhotos.length === 0)) {
    await fetchPhotos()
  }
})

async function fetchPhotos() {
  loadingPhotos.value = true
  try {
    const list = await $fetch<EventPhoto[]>(`/api/events/${props.eventId}/photos`)
    photos.value = list.sort((a, b) => a.order - b.order)
    emit('update:modelValue', photos.value)
    emit('change', photos.value)
  } catch (err) {
    console.error('Erreur chargement photos:', err)
  } finally {
    loadingPhotos.value = false
  }
}

async function syncAndSavePhotos(showToast = false) {
  isSaving.value = true
  try {
    const updated = await $fetch<Event>(`/api/events/${props.eventId}`, {
      method: 'PATCH',
      body: { photos: photos.value }
    })
    if (updated?.photos) {
      photos.value = updated.photos.sort((a, b) => a.order - b.order)
    }
    emit('update:modelValue', photos.value)
    emit('change', photos.value)
    if (showToast) {
      addToast({ title: 'Galerie photos enregistrée', color: 'success' })
    }
  } catch (err) {
    console.error('Erreur enregistrement galerie:', err)
    if (showToast) {
      addToast({ title: 'Erreur lors de l\'enregistrement de la galerie', color: 'error' })
    }
  } finally {
    isSaving.value = false
  }
}

function triggerFilePicker() {
  if (fileInput.value) {
    fileInput.value.value = ''
    fileInput.value.click()
  }
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target?.files && target.files.length > 0) {
    handleMultipleFiles(Array.from(target.files))
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    handleMultipleFiles(Array.from(event.dataTransfer.files))
  }
}

// Client-side image compression using Canvas
async function compressImage(file: File, maxDim: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas 2D non supporté'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Erreur de compression'))
          },
          'image/webp',
          quality
        )
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleMultipleFiles(fileList: File[]) {
  const imageFiles = fileList.filter((f) => f.type.startsWith('image/'))
  if (imageFiles.length === 0) {
    addToast({
      title: 'Fichiers invalides',
      description: 'Veuillez glisser des images (JPG, PNG, WebP).',
      color: 'error'
    })
    return
  }

  for (const file of imageFiles) {
    const uploadItem: UploadItem = {
      id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
      progress: 5,
      status: 'compressing'
    }
    uploadingQueue.value.push(uploadItem)

    // Lancer l'upload de chaque photo en parallèle
    processAndUploadPhoto(file, uploadItem).catch((err) => {
      console.error('Erreur upload photo:', err)
      uploadItem.status = 'error'
    })
  }
}

async function processAndUploadPhoto(file: File, item: UploadItem) {
  try {
    // 1. Compression client-side : thumb (max 600px) et full (max 2048px)
    item.progress = 15
    const thumbBlob = await compressImage(file, 600, 0.85)
    item.progress = 30
    const fullBlob = await compressImage(file, 2048, 0.9)
    item.progress = 45

    item.status = 'uploading'

    // 2. Envoi vers R2 via l'API
    const formData = new FormData()
    formData.append('thumb', thumbBlob, `${file.name}.thumb.webp`)
    formData.append('full', fullBlob, `${file.name}.full.webp`)
    formData.append('fileName', file.name)
    formData.append('isCover', photos.value.length === 0 && uploadingQueue.value.length === 1 ? 'true' : 'false')

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `/api/events/${props.eventId}/photos`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          // Progression de 45% à 95%
          item.progress = 45 + Math.round((e.loaded / e.total) * 50)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const created = JSON.parse(xhr.responseText) as EventPhoto
            item.progress = 100
            item.status = 'done'
            photos.value.push(created)
            emit('update:modelValue', photos.value)
            emit('change', photos.value)
            void syncAndSavePhotos(false)
            // Nettoyage après court délai
            setTimeout(() => {
              uploadingQueue.value = uploadingQueue.value.filter((q) => q.id !== item.id)
              URL.revokeObjectURL(item.previewUrl)
            }, 600)
            resolve()
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error(xhr.statusText))
        }
      }

      xhr.onerror = () => reject(new Error('Erreur réseau'))
      xhr.send(formData)
    })
  } catch (err) {
    item.status = 'error'
    addToast({
      title: `Échec d'upload pour ${file.name}`,
      color: 'error'
    })
  }
}

async function setCover(photo: EventPhoto) {
  try {
    await $fetch(`/api/events/${props.eventId}/photos`, {
      method: 'PATCH',
      body: { coverPhotoId: photo.id }
    })
    photos.value.forEach((p) => {
      p.isCover = p.id === photo.id
    })
    emit('coverChange', photo.fullUrl || photo.thumbUrl)
    emit('update:modelValue', photos.value)
    emit('change', photos.value)
    void syncAndSavePhotos(false)
    addToast({
      title: 'Photo de couverture mise à jour ⭐',
      color: 'success'
    })
  } catch {
    addToast({ title: 'Erreur lors de la mise à jour de la couverture', color: 'error' })
  }
}

async function deletePhoto(photo: EventPhoto) {
  if (!confirm('Supprimer cette photo ? Elle sera retirée de la base et de R2.')) return

  try {
    await $fetch(`/api/events/${props.eventId}/photos/${photo.id}`, {
      method: 'DELETE'
    })
    photos.value = photos.value.filter((p) => p.id !== photo.id)
    emit('update:modelValue', photos.value)
    emit('change', photos.value)
    void syncAndSavePhotos(false)
    addToast({ title: 'Photo supprimée de R2 et de la base', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de la suppression', color: 'error' })
  }
}

// Drag & drop reordering
function handleDragStart(index: number) {
  draggedIndex.value = index
}

function handleDragOver(index: number) {
  dragOverIndex.value = index
}

async function handleReorderDrop(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    draggedIndex.value = null
    dragOverIndex.value = null
    return
  }

  const moved = photos.value.splice(draggedIndex.value, 1)[0]
  photos.value.splice(targetIndex, 0, moved)

  draggedIndex.value = null
  dragOverIndex.value = null

  emit('update:modelValue', photos.value)
  emit('change', photos.value)
  void syncAndSavePhotos(false)

  // Sauvegarde du nouvel ordre
  try {
    const photoIds = photos.value.map((p) => p.id)
    await $fetch(`/api/events/${props.eventId}/photos`, {
      method: 'PATCH',
      body: { photoIds }
    })
    addToast({ title: 'Ordre des photos sauvegardé', color: 'success' })
  } catch {
    addToast({ title: 'Erreur lors de la réorganisation', color: 'error' })
  }
}

// Import from R2
async function importFromR2() {
  if (!importPrefix.value.trim()) return
  isImporting.value = true

  try {
    const res = await $fetch<{ importedCount: number; photos: EventPhoto[] }>(
      `/api/events/${props.eventId}/photos/import-r2`,
      {
        method: 'POST',
        body: { prefix: importPrefix.value.trim() }
      }
    )
    photos.value = res.photos.sort((a, b) => a.order - b.order)
    emit('update:modelValue', photos.value)
    emit('change', photos.value)
    void syncAndSavePhotos(false)
    isImportModalOpen.value = false
    importPrefix.value = ''
    addToast({
      title: 'Import R2 réussi !',
      description: `${res.importedCount} photos importées et rattachées à l'événement.`,
      color: 'success'
    })
  } catch (err: any) {
    addToast({
      title: 'Échec de l\'import R2',
      description: err?.data?.statusMessage || err?.message || 'Vérifiez le préfixe R2',
      color: 'error'
    })
  } finally {
    isImporting.value = false
  }
}
</script>

<template>
  <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onFileSelect"
    />

    <!-- En-tête de la galerie -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>📸</span> Galerie Photos
        </h3>
        <UBadge color="neutral" variant="subtle" size="sm">
          {{ photos.length }} {{ photos.length > 1 ? 'photos' : 'photo' }}
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-heroicons-cloud-arrow-down"
          @click="isImportModalOpen = true"
        >
          Importer depuis R2
        </UButton>
        <UButton
          size="sm"
          variant="outline"
          color="neutral"
          icon="i-heroicons-arrow-up-tray"
          @click="triggerFilePicker"
        >
          Ajouter des photos
        </UButton>
        <UButton
          size="sm"
          color="primary"
          variant="solid"
          icon="i-heroicons-check"
          :loading="isSaving"
          @click="syncAndSavePhotos(true)"
        >
          {{ $t('common.submit') }}
        </UButton>
      </div>
    </div>

    <!-- Dropzone principale dédiée à l'événement -->
    <div
      class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary cursor-pointer transition-all bg-gray-50/50 hover:bg-gray-50 dark:hover:bg-gray-800/40 mb-8"
      @dragover.prevent
      @dragenter.prevent
      @drop="onDrop"
      @click="triggerFilePicker"
    >
      <div class="max-w-md mx-auto">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-primary/70 mx-auto mb-3" />
        <h4 class="text-base font-semibold text-gray-800 dark:text-gray-200">
          Glisser-déposer vos photos ici
        </h4>
        <p class="text-sm text-gray-500 mt-1">
          Prenez vos 25+ photos sur votre Mac et déposez-les d'un bloc.
        </p>
        <p class="text-xs text-gray-400 mt-2">
          Compression automatique (WebP thumb + full) & upload direct sur Cloudflare R2
        </p>
      </div>
    </div>

    <!-- File d'attente / vignettes en cours d'upload avec barre de progression -->
    <div v-if="uploadingQueue.length > 0" class="mb-8">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-4 h-4 text-primary" />
        Envoi vers R2 en cours ({{ uploadingQueue.length }})
      </h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          v-for="item in uploadingQueue"
          :key="item.id"
          class="relative rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800 aspect-square group shadow-xs"
        >
          <img
            :src="item.previewUrl"
            :alt="item.fileName"
            class="w-full h-full object-cover filter brightness-90"
          />
          <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-2 text-white">
            <span class="text-[10px] truncate mb-1">{{ item.fileName }}</span>
            <div class="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-primary h-1.5 rounded-full transition-all duration-150"
                :style="{ width: `${item.progress}%` }"
              />
            </div>
            <span class="text-[9px] mt-1 text-right font-mono">{{ item.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille des vignettes uploadées -->
    <div v-if="photos.length > 0">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>💡 Glisser-déposer les vignettes pour réorganiser l'ordre d'affichage</span>
        <span class="italic">⭐ = Photo de couverture</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="(photo, index) in photos"
          :key="photo.id"
          draggable="true"
          class="group relative rounded-xl overflow-hidden border bg-white dark:bg-gray-900 shadow-xs hover:shadow-md transition-all aspect-square cursor-grab active:cursor-grabbing"
          :class="[
            photo.isCover ? 'ring-3 ring-amber-400 border-amber-400' : 'border-gray-200 dark:border-gray-800',
            dragOverIndex === index ? 'scale-105 border-primary ring-2 ring-primary' : ''
          ]"
          @dragstart="handleDragStart(index)"
          @dragover.prevent="handleDragOver(index)"
          @drop="handleReorderDrop(index)"
        >
          <!-- Image vignette -->
          <img
            :src="photo.thumbUrl || photo.fullUrl"
            :alt="photo.caption || `Photo ${index + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <!-- Badge Ordre -->
          <span class="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            #{{ index + 1 }}
          </span>

          <!-- Badge Photo de Couverture -->
          <span
            v-if="photo.isCover"
            class="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
          >
            ⭐ Couverture
          </span>

          <!-- Overlay d'actions au survol -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <!-- Bouton Étoile Couverture -->
            <button
              type="button"
              class="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110 shadow-md"
              :class="photo.isCover ? 'bg-amber-400 text-white' : 'bg-white/90 text-gray-700 hover:text-amber-500'"
              title="Définir comme photo de couverture"
              @click.stop="setCover(photo)"
            >
              ⭐
            </button>

            <!-- Bouton Plein écran / Voir -->
            <a
              :href="photo.fullUrl"
              target="_blank"
              class="w-9 h-9 rounded-full bg-white/90 text-gray-700 hover:text-primary flex items-center justify-center transition-transform hover:scale-110 shadow-md"
              title="Ouvrir l'image en grand"
              @click.stop
            >
              🔍
            </a>

            <!-- Bouton Supprimer -->
            <button
              type="button"
              class="w-9 h-9 rounded-full bg-white/90 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-transform hover:scale-110 shadow-md"
              title="Supprimer la photo"
              @click.stop="deletePhoto(photo)"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div
      v-else-if="!loadingPhotos && uploadingQueue.length === 0"
      class="text-center py-10 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed text-gray-400"
    >
      <p class="text-sm">Aucune photo dans la galerie pour le moment.</p>
      <p class="text-xs text-gray-500 mt-1">Glissez vos photos ci-dessus pour alimenter la galerie.</p>
    </div>

    <!-- Modal "Importer depuis un dossier R2" -->
    <div
      v-if="isImportModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      @click.self="isImportModalOpen = false"
    >
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>⚡</span> Importer depuis un dossier R2
          </h4>
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="isImportModalOpen = false"
          />
        </div>

        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Pour récupérer des photos déjà uploadées sur R2, collez simplement le préfixe du dossier dans votre bucket.
          </p>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Préfixe du dossier R2
            </label>
            <UInput
              v-model="importPrefix"
              placeholder="ex: 2026-11/photos/thumb/ ou events/evt_001/photos/thumb/"
              class="w-full"
              @keydown.enter="importFromR2"
            />
            <p class="text-xs text-gray-400 mt-1">
              L'API S3 <code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">ListObjectsV2Command</code> va lister tous les fichiers sous ce préfixe et les rattacher automatiquement à cet événement.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t">
          <UButton
            variant="ghost"
            color="neutral"
            :disabled="isImporting"
            @click="isImportModalOpen = false"
          >
            Annuler
          </UButton>
          <UButton
            color="primary"
            :loading="isImporting"
            :disabled="!importPrefix.trim()"
            @click="importFromR2"
          >
            Lancer l'import
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
