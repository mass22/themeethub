import { z } from 'zod'
import type { RequestStatus, RequestType } from '../../../types/request'

const validStatuses: RequestStatus[] = ['new', 'exploring_call', 'validated', 'in_progress', 'closed', 'rejected']
const validTypes: RequestType[] = ['sponsor', 'speaker']

const querySchema = z.object({
  type: z.enum(validTypes as [RequestType, ...RequestType[]]).optional(),
  status: z.enum(validStatuses as [RequestStatus, ...RequestStatus[]]).optional()
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const parsed = querySchema.safeParse(query)
  const filters = parsed.success ? parsed.data : undefined
  const ds = useDataSource()
  return ds.listRequests(filters)
})
