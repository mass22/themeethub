import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  contactId: z.string().optional(),
  topics: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSpeaker(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateSpeaker(id, parsed.data)
  return updated
})
