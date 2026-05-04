<script setup lang="ts">
import { authClient } from '../../lib/auth-client'

definePageMeta({
  layout: 'login'
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

useHead(() => ({ title: `${t('auth.title')} · ${t('app.title')}` }))

const config = useRuntimeConfig()
const email = ref('')
const loading = ref(false)
const githubLoading = ref(false)
const message = ref('')
const errorMsg = ref('')

const showGithub = computed(() => Boolean(config.public.githubAuth))

onMounted(() => {
  if (route.query.reason === 'unauthorized') {
    errorMsg.value = t('auth.unauthorized')
  }
})

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
  <div class="flex w-full flex-col gap-6">
    <div class="flex flex-col items-center gap-3 text-center">
      <NuxtLink :to="localePath('/')" class="flex items-center flex-col gap-2 font-semibold text-slate-900 dark:text-white">
      <span class="text-5xl font-semibold text-highlighted">TheMeetHub</span>
      <img
        src="/logo.svg"
        alt=""
        width="128"
        height="128"
        class="h-64 w-64 shrink-0"
      >
      </NuxtLink>
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('auth.title') }}
      </h1>
      <p class="text-muted max-w-sm text-sm">
        {{ t('auth.subtitle') }}
      </p>
    </div>

    <form class="w-full space-y-4 text-left" @submit.prevent="onSubmit">
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
