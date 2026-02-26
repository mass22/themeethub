import { z } from 'zod'
import type { PromoItemStatus } from '../../../types/promoItem'

const statusSchema = z.enum(['todo', 'in_progress', 'done'] as [PromoItemStatus, ...PromoItemStatus[]])

const schema = z.object({
  eventId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  channel: z.string().optional(),
  dueAt: z.string().optional(),
  status: statusSchema.optional(),
  copy: z.string().optional(),
  assetLinks: z.array(z.string()).optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const p = await ds.getPromoItem(id)
  if (!p) throw createError({ statusCode: 404, statusMessage: 'Promo item not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updatePromoItem(id, parsed.data)
  return updated
})
