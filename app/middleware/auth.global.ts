function isLoginPath(path: string) {
  return /\/login\/?$/.test(path)
}

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  if (config.public.e2eBypassAuth) return

  if (isLoginPath(to.path)) return

  if (import.meta.dev) {
    const devHubNoLogin = useState<boolean | null>('dev-hub-no-login', () => null)
    if (devHubNoLogin.value === null) {
      try {
        const { skipLoginWall } = await $fetch<{ skipLoginWall: boolean }>('/api/public/dev-session-hint')
        devHubNoLogin.value = Boolean(skipLoginWall)
      } catch {
        devHubNoLogin.value = false
      }
    }
    if (devHubNoLogin.value === true) return
  }

  const localePath = useLocalePath()
  const { authClient } = await import('../../lib/auth-client')
  const { data } = await authClient.getSession()
  if (!data?.session) {
    return navigateTo({
      path: localePath('/login'),
      query: { reason: 'unauthorized' }
    })
  }

  try {
    const access = await $fetch<{ authenticated: boolean; allowed: boolean }>('/api/auth/access')
    if (!access.allowed) {
      await (authClient as any).signOut?.()
      return navigateTo({
        path: localePath('/login'),
        query: { reason: 'unauthorized' }
      })
    }
  } catch {
    return navigateTo({
      path: localePath('/login'),
      query: { reason: 'unauthorized' }
    })
  }
})
