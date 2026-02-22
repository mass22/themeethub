import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  return ds.createTool(parsed.data)
})
