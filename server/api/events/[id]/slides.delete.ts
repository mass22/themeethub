import { deleteFromR2, extractKeyFromUrl } from '../../../utils/r2'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const body = event.node.req.method !== 'GET' ? await readBody(event).catch(() => ({})) : {}

  const rawKeyOrUrl = (query.key || query.url || body.key || body.url) as string | undefined
  if (!rawKeyOrUrl) {
    throw createError({ statusCode: 400, statusMessage: 'key or url is required' })
  }

  const key = extractKeyFromUrl(rawKeyOrUrl)
  // Vérification de sécurité pour éviter de supprimer en dehors de events/{eventId}/slides/
  if (!key.startsWith(`events/${eventId}/slides/`)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  await deleteFromR2(key)
  return { success: true }
})
