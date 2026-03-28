function isLoginPath(path: string) {
  return /\/login\/?$/.test(path)
}

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  if (config.public.e2eBypassAuth) return

  if (isLoginPath(to.path)) return

  const { authClient } = await import('../../lib/auth-client')
  const { data } = await authClient.getSession()
  if (!data?.session) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/login'))
  }
})
