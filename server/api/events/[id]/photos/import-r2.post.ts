import { z } from 'zod'
import { listR2Objects, getR2PublicUrl } from '../../../../utils/r2'

const schema = z.object({
  prefix: z.string().min(1, 'Le préfixe est requis')
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
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Invalid payload' })
  }

  const rawPrefix = parsed.data.prefix.trim().replace(/^\/+/, '')
  const objects = await listR2Objects(rawPrefix)

  const imageRegex = /\.(webp|jpe?g|png|avif|gif)$/i
  const imageObjects = objects.filter((o) => imageRegex.test(o.key))

  if (imageObjects.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `Aucune image trouvée sous le préfixe R2 "${rawPrefix}". Vérifiez le préfixe ou le contenu de votre bucket.`
    })
  }

  const existingPhotos = await ds.getEventPhotos(eventId)
  let hasCover = existingPhotos.some((p) => p.isCover)
  let currentOrder = existingPhotos.length

  const importedPhotos = []

  for (const obj of imageObjects) {
    const key = obj.key
    let thumbKey = key
    let fullKey = key

    if (key.includes('/thumb/')) {
      fullKey = key.replace('/thumb/', '/full/')
    } else if (key.includes('/full/')) {
      thumbKey = key.replace('/full/', '/thumb/')
    }

    const thumbUrl = getR2PublicUrl(thumbKey)
    const fullUrl = getR2PublicUrl(fullKey)

    // Éviter d'importer des doublons si thumbUrl existe déjà pour cet événement
    const isDuplicate = existingPhotos.some((p) => p.thumbUrl === thumbUrl || p.fullUrl === fullUrl)
    if (isDuplicate) continue

    const isCover = !hasCover
    if (isCover) hasCover = true

    const fileName = key.split('/').pop() || ''
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/^\d+-/, '').replace(/[-_]/g, ' ')

    const created = await ds.addEventPhoto(eventId, {
      thumbUrl,
      fullUrl,
      caption: baseName || null,
      order: currentOrder++,
      isCover
    })
    importedPhotos.push(created)
  }

  const allPhotos = await ds.getEventPhotos(eventId)
  return {
    importedCount: importedPhotos.length,
    imported: importedPhotos,
    photos: allPhotos
  }
})
