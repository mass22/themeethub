import { uploadToR2 } from '../../../../utils/r2'

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const foundEvent = await ds.getEvent(eventId)
  if (!foundEvent) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No multipart data provided' })
  }

  const thumbItem = formData.find((i) => i.name === 'thumb')
  const fullItem = formData.find((i) => i.name === 'full') || thumbItem
  const fileNameItem = formData.find((i) => i.name === 'fileName')
  const captionItem = formData.find((i) => i.name === 'caption')
  const isCoverItem = formData.find((i) => i.name === 'isCover')

  if (!thumbItem || !thumbItem.data) {
    throw createError({ statusCode: 400, statusMessage: 'Thumbnail image data is required' })
  }

  const rawFileName = fileNameItem?.data?.toString('utf-8') || thumbItem.filename || 'photo.webp'
  const baseName = rawFileName.replace(/\.[^/.]+$/, '')
  const cleanName = slugify(baseName) || 'photo'
  const timestamp = Math.floor(Date.now() / 1000)

  // Extension : par défaut webp
  const thumbExt = thumbItem.type?.includes('jpeg') ? 'jpg' : thumbItem.type?.includes('png') ? 'png' : 'webp'
  const fullExt = fullItem?.type?.includes('jpeg') ? 'jpg' : fullItem?.type?.includes('png') ? 'png' : 'webp'

  const thumbKey = `events/${eventId}/photos/thumb/${timestamp}-${cleanName}.${thumbExt}`
  const fullKey = `events/${eventId}/photos/full/${timestamp}-${cleanName}.${fullExt}`

  const thumbResult = await uploadToR2({
    key: thumbKey,
    body: thumbItem.data,
    contentType: thumbItem.type || 'image/webp'
  })

  const fullResult = await uploadToR2({
    key: fullKey,
    body: (fullItem || thumbItem).data,
    contentType: (fullItem || thumbItem).type || 'image/webp'
  })

  const isCover = isCoverItem?.data?.toString('utf-8') === 'true'
  const caption = captionItem?.data?.toString('utf-8') || null

  const newPhoto = await ds.addEventPhoto(eventId, {
    thumbUrl: thumbResult.url,
    fullUrl: fullResult.url,
    caption,
    order: (foundEvent.photos || []).length,
    isCover
  })

  return newPhoto
})
