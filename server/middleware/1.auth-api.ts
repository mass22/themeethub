import { getRequestHeaders } from 'h3'
import { auth } from '../../lib/auth'

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/')) return
  if (path.startsWith('/api/auth')) return
  if (path.startsWith('/api/public/')) return

  const config = useRuntimeConfig(event)
  if (config.public.e2eBypassAuth) return

  const session = await auth.api.getSession({
    headers: getRequestHeaders(event)
  })
  if (!session?.session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
