import type { Request } from '../../types/request'

export interface ExploringCallEmailParams {
  to: string
  name: string
  type: 'sponsor' | 'speaker'
  calLink: string
  fromEmail: string
}

export interface IEmailService {
  sendExploringCallEmail(params: ExploringCallEmailParams): Promise<void>
}

/**
 * Stub implementation - logs to console.
 * Ready for Resend/Postmark integration later.
 */
export function createEmailService(config: { calSponsorLink: string; calSpeakerLink: string; fromEmail: string }): IEmailService {
  return {
    async sendExploringCallEmail(params: ExploringCallEmailParams): Promise<void> {
      console.log('[emailService.stub] sendExploringCallEmail', params)
    }
  }
}

export function useEmailService(): IEmailService {
  const config = useRuntimeConfig()
  return createEmailService({
    calSponsorLink: config.calSponsorLink || '',
    calSpeakerLink: config.calSpeakerLink || '',
    fromEmail: config.fromEmail || ''
  })
}

export function buildExploringCallEmailParams(request: Request, config: { calSponsorLink: string; calSpeakerLink: string; fromEmail: string }): ExploringCallEmailParams {
  const calLink = request.type === 'sponsor' ? config.calSponsorLink : config.calSpeakerLink
  return {
    to: request.email,
    name: request.name,
    type: request.type,
    calLink,
    fromEmail: config.fromEmail
  }
}
