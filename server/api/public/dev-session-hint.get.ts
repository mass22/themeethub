import { mockDevApiAuthBypassEnabled, resolveUseMocks } from '../../utils/resolveUseMocks'

/** Indique si le hub peut être utilisé sans session (dev + mocks + bypass non désactivé). */
export default defineEventHandler((event) => {
  setHeader(event, 'cache-control', 'no-store, max-age=0')
  const config = useRuntimeConfig(event)
  const skipLoginWall = resolveUseMocks(config) && mockDevApiAuthBypassEnabled()
  return { skipLoginWall }
})
