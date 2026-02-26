import { z } from 'zod'

const schema = z.object({
  communityId: z.string().min(1),
  title: z.string().min(1),
  startAt: z.string().min(1),
  location: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createExternalEvent(parsed.data)
})
