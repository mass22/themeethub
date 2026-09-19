import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
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
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const { name, role, isPublished, ...rest } = parsed.data
  const existing = await ds.findSpeakerByNameAndRole(name, role)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Speaker already exists with this name and role', data: { speakerId: existing.id } })
  }
  return ds.createSpeaker({
    name,
    role,
    ...rest,
    publishedAt: isPublished ? new Date().toISOString() : null
  })
})
