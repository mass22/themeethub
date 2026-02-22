import { z } from 'zod'
import type { LogisticsItemStatus } from '../../../types/logisticsItem'

const statusSchema = z.enum(['todo', 'ready', 'done'] as [LogisticsItemStatus, ...LogisticsItemStatus[]])

const schema = z.object({
  eventId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  ownerContactId: z.string().optional(),
  status: statusSchema.optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const l = await ds.getLogisticsItem(id)
  if (!l) throw createError({ statusCode: 404, statusMessage: 'Logistics item not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateLogisticsItem(id, parsed.data)
  return updated
})
