import { z } from 'zod'

const intentSchema = z.enum(['attend', 'network', 'ask_promo', 'propose_talk', 'sponsor'])
const statusSchema = z.enum(['planned', 'done'])

const schema = z.object({
  externalEventId: z.string().min(1),
  intent: intentSchema,
  ownerContactId: z.string().optional(),
  status: statusSchema.default('planned'),
  followUpDueAt: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createParticipation(parsed.data)
})
