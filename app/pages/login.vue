<script setup lang="ts">
import { authClient } from '../../lib/auth-client'

definePageMeta({
  layout: 'login'
})

const { t } = useI18n()
const localePath = useLocalePath()

useHead(() => ({ title: `${t('auth.title')} · ${t('app.title')}` }))

const config = useRuntimeConfig()
const email = ref('')
const loading = ref(false)
const githubLoading = ref(false)
const message = ref('')
const errorMsg = ref('')

const showGithub = computed(() => Boolean(config.public.githubAuth))

async function signInWithGithub() {
  githubLoading.value = true
  errorMsg.value = ''
  try {
    const callbackURL = new URL(localePath('/'), window.location.origin).href
    const { data, error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL
    })
    if (error) {
      errorMsg.value = error.message || t('auth.errorGithub')
      return
    }
    if (data?.redirect && data.url) {
      window.location.href = data.url
    }
  } catch {
    errorMsg.value = t('auth.errorGithub')
  } finally {
    githubLoading.value = false
  }
}

async function onSubmit() {
  loading.value = true
  message.value = ''
  errorMsg.value = ''
  try {
    const callbackURL = new URL(localePath('/'), window.location.origin).href
    const { error } = await authClient.signIn.magicLink({
      email: email.value.trim(),
      callbackURL
    })
    if (error) {
      errorMsg.value = error.message || t('auth.errorGeneric')
    } else {
      message.value = t('auth.linkSent')
    }
  } catch {
    errorMsg.value = t('auth.errorGeneric')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-6 px-4 py-12">
    <div>
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('auth.title') }}
      </h1>
      <p class="mt-1 text-muted text-sm">
        {{ t('auth.subtitle') }}
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium">{{ t('auth.email') }}</label>
        <UInput
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :placeholder="t('auth.emailPlaceholder')"
          class="w-full"
        />
      </div>

      <UAlert v-if="message" color="success" variant="subtle" :title="message" />
      <UAlert v-if="errorMsg" color="error" variant="subtle" :title="errorMsg" />

      <UButton type="submit" block :loading="loading">
        {{ t('auth.sendLink') }}
      </UButton>
    </form>

    <template v-if="showGithub">
      <div class="relative flex items-center py-2">
        <div class="border-default grow border-t" />
        <span class="text-muted mx-4 shrink-0 text-xs">{{ t('auth.or') }}</span>
        <div class="border-default grow border-t" />
      </div>

      <UButton
        color="neutral"
        variant="outline"
        block
        icon="i-simple-icons-github"
        :loading="githubLoading"
        @click="signInWithGithub"
      >
        {{ t('auth.signInGithub') }}
      </UButton>
    </template>
  </div>
</template>
