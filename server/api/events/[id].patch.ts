import { z } from 'zod'

const eventVideoSchema = z.object({
  title: z.string(),
  youtube_url: z.string()
})

const eventTalkSlideSchema = z.object({
  type: z.enum(['file', 'link']),
  fileUrl: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  linkUrl: z.string().nullable().optional()
})

const eventTalkSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  speakerId: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  slides: eventTalkSlideSchema.optional()
})

const eventPhotoSchema = z.object({
  id: z.string(),
  eventId: z.string().optional(),
  thumbUrl: z.string(),
  fullUrl: z.string(),
  caption: z.string().nullable().optional(),
  order: z.number().default(0),
  isCover: z.boolean().default(false),
  createdAt: z.string().optional()
})

const schema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  date: z.string().min(1).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  location: z.enum(['in_person', 'online', 'hybrid']).optional(),
  description: z.string().optional(),
  bannerImageUrl: z.string().optional().nullable(),
  speakers: z.array(z.string()).optional(),
  sponsors: z.array(z.string()).optional(),
  contractors: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  externalCommunities: z.array(z.string()).optional(),
  videos: z.array(eventVideoSchema).optional(),
  talks: z.array(eventTalkSchema).optional(),
  photos: z.array(eventPhotoSchema).optional(),
  venueId: z.string().optional(),
  stats: z.object({ registered: z.number().min(0), attended: z.number().min(0) }).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const e = await ds.getEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateEvent(id, parsed.data)
  return updated
})
