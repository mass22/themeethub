import { z } from 'zod'

const intentSchema = z.enum(['attend', 'network', 'ask_promo', 'propose_talk', 'sponsor'])
const statusSchema = z.enum(['planned', 'done'])

const schema = z.object({
  externalEventId: z.string().min(1).optional(),
  intent: intentSchema.optional(),
  ownerContactId: z.string().optional(),
  status: statusSchema.optional(),
  followUpDueAt: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const p = await ds.getParticipation(id)
  if (!p) throw createError({ statusCode: 404, statusMessage: 'Participation not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.updateParticipation(id, parsed.data)
})
