import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  contactId: z.string().optional(),
  socials: z.object({
    x: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional()
  }).optional(),
  topics: z.array(z.string()).optional(),
  isPublished: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSpeaker(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const { isPublished, ...rest } = parsed.data
  const patchData: any = { ...rest }
  if (isPublished !== undefined) {
    patchData.publishedAt = isPublished ? new Date().toISOString() : null
  }
  const updated = await ds.updateSpeaker(id, patchData)
  return updated
})
