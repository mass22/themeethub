import { z } from 'zod'
import type { RequestStatus } from '../../../types/request'
import { useEmailService, buildExploringCallEmailParams } from '../../../services/emailService'

const validStatuses: RequestStatus[] = ['new', 'exploring_call', 'validated', 'in_progress', 'closed', 'rejected']

const schema = z.object({
  status: z.enum(validStatuses as [RequestStatus, ...RequestStatus[]])
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const r = await ds.getRequest(id)
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Request not found' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const newStatus = parsed.data.status
  let exploringCallEmailSentAt: string | undefined

  if (newStatus === 'exploring_call' && (r.exploringCallEmailSentAt == null || r.exploringCallEmailSentAt === '')) {
    const config = useRuntimeConfig()
    const emailService = useEmailService()
    const params = buildExploringCallEmailParams(r, {
      calSponsorLink: config.calSponsorLink || '',
      calSpeakerLink: config.calSpeakerLink || '',
      fromEmail: config.fromEmail || ''
    })
    await emailService.sendExploringCallEmail(params)
    exploringCallEmailSentAt = new Date().toISOString()
  }

  const updated = await ds.patchRequestStatus(id, newStatus, exploringCallEmailSentAt != null ? { exploringCallEmailSentAt } : undefined)
  return updated
})
