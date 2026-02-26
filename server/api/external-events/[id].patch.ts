import { z } from 'zod'

const schema = z.object({
  communityId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  startAt: z.string().min(1).optional(),
  location: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const e = await ds.getExternalEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'External event not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.updateExternalEvent(id, parsed.data)
})
