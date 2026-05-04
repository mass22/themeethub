/**
 * Source unique pour savoir si on utilise les JSON `mocks/` ou Prisma.
 * Précédence : NUXT_USE_MOCKS (true|false) > runtimeConfig.useMocks
 */
export function resolveUseMocks(config: { useMocks?: boolean }): boolean {
  const envUseMocks = process.env.NUXT_USE_MOCKS
  if (envUseMocks === 'true') return true
  if (envUseMocks === 'false') return false
  return Boolean(config.useMocks)
}

/** Dev : contourner l’auth sur /api/* quand les mocks sont actifs (désactivable). */
export function mockDevApiAuthBypassEnabled(): boolean {
  const env = process.env.NUXT_MOCK_DEV_API_BYPASS
  if (env === 'false' || env === '0') return false
  if (env === 'true' || env === '1') return true
  return import.meta.dev
}
