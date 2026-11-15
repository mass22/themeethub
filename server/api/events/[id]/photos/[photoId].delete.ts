import { deleteFromR2, extractKeyFromUrl } from '../../../../utils/r2'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')!
  const photoId = getRouterParam(event, 'photoId')!

  const ds = useDataSource()
  const photos = await ds.getEventPhotos(eventId)
  const targetPhoto = photos.find((p) => p.id === photoId)

  if (!targetPhoto) {
    throw createError({ statusCode: 404, statusMessage: 'Photo not found' })
  }

  // Suppression sur R2
  if (targetPhoto.thumbUrl) {
    const thumbKey = extractKeyFromUrl(targetPhoto.thumbUrl)
    if (thumbKey) {
      await deleteFromR2(thumbKey)
    }
  }

  if (targetPhoto.fullUrl) {
    const fullKey = extractKeyFromUrl(targetPhoto.fullUrl)
    if (fullKey) {
      await deleteFromR2(fullKey)
    }
  }

  // Suppression en base de données
  const success = await ds.deleteEventPhoto(eventId, photoId)
  return { success }
})
