import { uploadToR2 } from '../../../utils/r2'

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
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const fileItem = formData.find((item) => item.name === 'file' && item.filename)
  if (!fileItem || !fileItem.data) {
    throw createError({ statusCode: 400, statusMessage: 'File item is missing' })
  }

  const talkSlugItem = formData.find((item) => item.name === 'talkSlug')
  const talkTitleItem = formData.find((item) => item.name === 'talkTitle')

  const rawSlug = talkSlugItem?.data ? talkSlugItem.data.toString('utf-8') : ''
  const rawTitle = talkTitleItem?.data ? talkTitleItem.data.toString('utf-8') : ''

  const baseSlug = rawSlug ? slugify(rawSlug) : rawTitle ? slugify(rawTitle) : 'talk'
  const talkSlug = baseSlug || 'talk'

  const origName = fileItem.filename || 'slides.pdf'
  const dotIndex = origName.lastIndexOf('.')
  const ext = dotIndex !== -1 ? origName.slice(dotIndex + 1).toLowerCase() : 'pdf'

  const allowedExts = ['pdf', 'pptx', 'ppt', 'key']
  if (!allowedExts.includes(ext)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Format de fichier non supporté (.${ext}). Veuillez uploader un PDF ou PPTX.`
    })
  }

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    key: 'application/vnd.apple.keynote'
  }

  const contentType = fileItem.type || mimeTypes[ext] || 'application/octet-stream'
  const key = `events/${eventId}/slides/${talkSlug}.${ext}`

  const result = await uploadToR2({
    key,
    body: fileItem.data,
    contentType
  })

  return {
    key: result.key,
    url: result.url,
    fileName: origName,
    fileSize: fileItem.data.length
  }
})
