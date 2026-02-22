import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  capacity: z.number().optional(),
  contactId: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const v = await ds.getVenue(id)
  if (!v) throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateVenue(id, parsed.data)
  return updated
})
