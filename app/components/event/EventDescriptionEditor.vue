<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  { placeholder: '' }
)

const model = defineModel<string>({ default: '' })

/** Barre d’outils alignée sur l’exemple « With toolbar » de la doc Nuxt UI Editor */
const toolbarItems: EditorToolbarItem[][] = [[{
  icon: 'i-lucide-heading',
  tooltip: { text: 'Titres' },
  content: { align: 'start' },
  items: [
    { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Titre 1' },
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Titre 2' },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: 'Titre 3' },
    { kind: 'heading', level: 4, icon: 'i-lucide-heading-4', label: 'Titre 4' }
  ]
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold',
  tooltip: { text: 'Gras' }
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic',
  tooltip: { text: 'Italique' }
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline',
  tooltip: { text: 'Souligné' }
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough',
  tooltip: { text: 'Barré' }
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code',
  tooltip: { text: 'Code' }
}], [{
  icon: 'i-lucide-list',
  tooltip: { text: 'Listes' },
  content: { align: 'start' },
  items: [
    { kind: 'bulletList', icon: 'i-lucide-list', label: 'Liste à puces' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: 'Liste numérotée' }
  ]
}, {
  kind: 'blockquote',
  icon: 'i-lucide-text-quote',
  tooltip: { text: 'Citation' }
}, {
  kind: 'codeBlock',
  icon: 'i-lucide-square-code',
  tooltip: { text: 'Bloc de code' }
}, {
  kind: 'link',
  icon: 'i-lucide-link',
  tooltip: { text: 'Lien' }
}]]

/** Couleurs explicites : dans les pages encore en `bg-white` / `text-gray-*`, les tokens `--ui-text` de l’éditeur peuvent rester trop pâles. */
const editorUi = {
  root: [
    'w-full min-h-48 overflow-hidden rounded-lg',
    'bg-white text-gray-900 ring-1 ring-gray-200',
    'dark:bg-gray-950 dark:text-gray-100 dark:ring-gray-700'
  ].join(' '),
  content: 'bg-transparent',
  base: [
    'min-h-36 px-3 py-3 sm:px-4 outline-none',
    'text-gray-900 dark:text-gray-100',
    '[&_p]:text-inherit [&_li]:text-inherit [&_blockquote]:text-inherit',
    '[&_:is(h1,h2,h3,h4,h5,h6)]:text-gray-950 dark:[&_:is(h1,h2,h3,h4,h5,h6)]:text-gray-50',
    '[&_a]:text-violet-700 dark:[&_a]:text-violet-300 [&_a]:font-medium',
    '[&_code]:text-gray-900 dark:[&_code]:text-gray-100',
    '[&_pre]:bg-gray-100 [&_pre]:text-gray-900 dark:[&_pre]:bg-gray-800 dark:[&_pre]:text-gray-100',
    '[&_.is-editor-empty:first-child::before]:text-gray-400 dark:[&_.is-editor-empty:first-child::before]:text-gray-500'
  ].join(' ')
}
</script>

<template>
  <UEditor
    v-bind="$attrs"
    v-slot="{ editor }"
    v-model="model"
    content-type="markdown"
    :placeholder="placeholder"
    class="w-full"
    :ui="editorUi"
  >
    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
      class="border-b border-gray-200 bg-gray-50 px-1 py-1 overflow-x-auto dark:border-gray-700 dark:bg-gray-900"
    />
  </UEditor>
</template>
