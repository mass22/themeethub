import { z } from 'zod'
import { checkRateLimit } from '../../utils/rateLimit'
import { checkHoneypot, trimString, normalizeEmail } from '../../utils/antiSpam'

const schema = z.object({
  name: z.string().transform(trimString).pipe(z.string().min(1, 'Name is required')),
  email: z.string().transform(normalizeEmail).pipe(z.string().email('Valid email is required')),
  role: z.string().transform(trimString).pipe(z.string().min(1, 'Role is required'))
})

export default defineEventHandler(async (event) => {
  checkRateLimit(event)

  const ds = useDataSource()
  const body = await readBody(event)
  checkHoneypot(body)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  const { name, email, role } = parsed.data
  return ds.createRequest({
    type: 'speaker',
    name,
    email,
    companyName: undefined,
    role
  })
})
