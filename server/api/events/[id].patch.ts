import { z } from 'zod'

const eventVideoSchema = z.object({
  title: z.string(),
  youtube_url: z.string()
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
  videos: z.array(eventVideoSchema).optional(),
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
