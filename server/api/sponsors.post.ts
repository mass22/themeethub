import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  tier: z.string().optional(),
  contactId: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  if (parsed.data.contactEmail) {
    const existing = await ds.findSponsorByCompanyAndEmail(parsed.data.companyName, parsed.data.contactEmail)
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Sponsor already exists with same company and email' })
    }
  }
  return ds.createSponsor(parsed.data)
})
