export interface Speaker {
  id: string
  name: string
  bio?: string
  avatar?: string
  socials?: { x?: string; linkedin?: string; website?: string }
  topics?: string[]
  history?: string[] // event ids
}