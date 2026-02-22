import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  contactId: z.string().optional(),
  rate: z.number().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const c = await ds.getContractor(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'Contractor not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateContractor(id, parsed.data)
  return updated
})
