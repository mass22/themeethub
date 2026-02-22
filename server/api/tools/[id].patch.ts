import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const t = await ds.getTool(id)
  if (!t) throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateTool(id, parsed.data)
  return updated
})
