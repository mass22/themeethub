import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const c = await ds.getExternalCommunity(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'External community not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.updateExternalCommunity(id, parsed.data)
})
