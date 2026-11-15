import { z } from 'zod'

const schema = z.object({
  photoIds: z.array(z.string()).optional(),
  coverPhotoId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const foundEvent = await ds.getEvent(eventId)
  if (!foundEvent) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  if (parsed.data.coverPhotoId) {
    await ds.setEventCoverPhoto(eventId, parsed.data.coverPhotoId)
  }

  if (parsed.data.photoIds && parsed.data.photoIds.length > 0) {
    await ds.reorderEventPhotos(eventId, parsed.data.photoIds)
  }

  const updatedPhotos = await ds.getEventPhotos(eventId)
  return updatedPhotos
})
