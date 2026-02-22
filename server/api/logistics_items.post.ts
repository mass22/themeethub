import { z } from 'zod'
import type { LogisticsItemStatus } from '../../types/logisticsItem'

const statusSchema = z.enum(['todo', 'ready', 'done'] as [LogisticsItemStatus, ...LogisticsItemStatus[]])

const schema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  ownerContactId: z.string().optional(),
  status: statusSchema.default('todo'),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createLogisticsItem(parsed.data)
})
