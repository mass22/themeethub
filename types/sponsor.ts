export interface Sponsor {
  id: string
  companyName: string
  tier?: string
  contactId?: string
  contactName?: string
  contactEmail?: string
  logoUrl?: string | null
  websiteUrl?: string | null
  notes?: string
  createdAt: string
  updatedAt: string
}
