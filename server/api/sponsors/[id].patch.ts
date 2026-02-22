import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(1).optional(),
  tier: z.string().optional(),
  contactId: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSponsor(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Sponsor not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateSponsor(id, parsed.data)
  return updated
})
