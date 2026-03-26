import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3),
  date: z.string().min(1),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  location: z.enum(['in_person', 'online', 'hybrid']).optional(),
  description: z.string().optional(),
  bannerImageUrl: z.string().optional().nullable(),
  speakers: z.array(z.string()).default([]),
  sponsors: z.array(z.string()).default([]),
  contractors: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  venueId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createEvent(parsed.data)
})