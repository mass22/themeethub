export interface Speaker {
  id: string
  name: string
  role?: string
  bio?: string
  avatar?: string
  contactId?: string
  socials?: { x?: string; linkedin?: string; website?: string }
  topics?: string[]
  createdAt: string
  updatedAt: string
}
