import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3),
  date: z.string().min(1),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  location: z.string().optional(),
  description: z.string().optional(),
  speakers: z.array(z.string()).default([])
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