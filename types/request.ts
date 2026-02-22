export type RequestStatus =
  | 'new'
  | 'exploring_call'
  | 'validated'
  | 'in_progress'
  | 'closed'
  | 'rejected'

export type RequestType = 'sponsor' | 'speaker'

export interface Request {
  id: string
  name: string
  email: string
  type: RequestType
  companyName?: string
  role?: string
  status: RequestStatus
  createdAt: string
  exploringCallEmailSentAt?: string | null
}
