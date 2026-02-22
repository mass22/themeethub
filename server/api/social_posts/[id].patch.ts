import { z } from 'zod'
import type { SocialPostStatus } from '../../../types/socialPost'

const statusSchema = z.enum(['draft', 'scheduled', 'posted'] as [SocialPostStatus, ...SocialPostStatus[]])

const schema = z.object({
  eventId: z.string().min(1).optional(),
  platform: z.string().optional(),
  copy: z.string().optional(),
  scheduledAt: z.string().optional(),
  status: statusSchema.optional(),
  assetLinks: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSocialPost(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Social post not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const updated = await ds.updateSocialPost(id, parsed.data)
  return updated
})
