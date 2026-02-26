import { z } from 'zod'
import type { SocialPostStatus } from '../../types/socialPost'

const statusSchema = z.enum(['draft', 'scheduled', 'posted'] as [SocialPostStatus, ...SocialPostStatus[]])

const schema = z.object({
  eventId: z.string().min(1).optional(),
  platform: z.string().optional(),
  copy: z.string().optional(),
  scheduledAt: z.string().optional(),
  status: statusSchema.default('draft'),
  assetLinks: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createSocialPost(parsed.data)
})
