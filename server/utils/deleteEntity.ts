import events from '../../mocks/events.json'
import speakers from '../../mocks/speakers.json'
import sponsors from '../../mocks/sponsors.json'
import contacts from '../../mocks/contacts.json'
import venues from '../../mocks/venues.json'
import contractors from '../../mocks/contractors.json'
import tools from '../../mocks/tools.json'
import promoItems from '../../mocks/promo_items.json'
import logisticsItems from '../../mocks/logistics_items.json'
import socialPosts from '../../mocks/social_posts.json'
import externalCommunities from '../../mocks/external_communities.json'
import externalEvents from '../../mocks/external_events.json'
import participations from '../../mocks/participations.json'

const ALLOWED_RESOURCES = [
  'events',
  'speakers',
  'sponsors',
  'contacts',
  'venues',
  'contractors',
  'tools',
  'promo_items',
  'logistics_items',
  'social_posts',
  'external-communities',
  'external-events',
  'participations'
] as const

export type DeletableResource = (typeof ALLOWED_RESOURCES)[number]

export function isDeletableResource(resource: string): resource is DeletableResource {
  return (ALLOWED_RESOURCES as readonly string[]).includes(resource)
}

function removeFromArrayById<T extends { id: string }>(list: T[], id: string): boolean {
  const idx = list.findIndex((item) => item.id === id)
  if (idx < 0) return false
  list.splice(idx, 1)
  return true
}

function removeManyByField<T>(list: T[], field: keyof T, value: string) {
  let i = list.length - 1
  while (i >= 0) {
    if ((list[i][field] as string | undefined) === value) {
      list.splice(i, 1)
    }
    i -= 1
  }
}

export async function deleteEntity(resource: DeletableResource, id: string): Promise<boolean> {
  const ds = useDataSource()

  if (ds.useMocks) {
    const mockMap: Record<Exclude<DeletableResource, 'events' | 'external-communities' | 'external-events' | 'contacts'>, { id: string }[]> = {
      speakers: speakers as { id: string }[],
      sponsors: sponsors as { id: string }[],
      venues: venues as { id: string }[],
      contractors: contractors as { id: string }[],
      tools: tools as { id: string }[],
      promo_items: promoItems as { id: string }[],
      logistics_items: logisticsItems as { id: string }[],
      social_posts: socialPosts as { id: string }[],
      participations: participations as { id: string }[]
    }

    if (resource === 'events') {
      removeManyByField(logisticsItems as Array<{ eventId?: string }>, 'eventId', id)
      removeManyByField(promoItems as Array<{ eventId?: string }>, 'eventId', id)
      removeManyByField(socialPosts as Array<{ eventId?: string }>, 'eventId', id)
      return removeFromArrayById(events as { id: string }[], id)
    }

    if (resource === 'external-communities') {
      const linkedEventIds = (externalEvents as Array<{ id: string; communityId?: string }>)
        .filter((e) => e.communityId === id)
        .map((e) => e.id)
      for (const eventId of linkedEventIds) {
        removeManyByField(participations as Array<{ externalEventId?: string }>, 'externalEventId', eventId)
      }
      removeManyByField(externalEvents as Array<{ communityId?: string }>, 'communityId', id)
      return removeFromArrayById(externalCommunities as { id: string }[], id)
    }

    if (resource === 'external-events') {
      removeManyByField(participations as Array<{ externalEventId?: string }>, 'externalEventId', id)
      return removeFromArrayById(externalEvents as { id: string }[], id)
    }

    if (resource === 'contacts') {
      for (const s of speakers as Array<{ contactId?: string | null }>) if (s.contactId === id) s.contactId = undefined
      for (const s of sponsors as Array<{ contactId?: string | null }>) if (s.contactId === id) s.contactId = undefined
      for (const v of venues as Array<{ contactId?: string | null }>) if (v.contactId === id) v.contactId = undefined
      for (const c of contractors as Array<{ contactId?: string | null }>) if (c.contactId === id) c.contactId = undefined
      for (const l of logisticsItems as Array<{ ownerContactId?: string | null }>) if (l.ownerContactId === id) l.ownerContactId = undefined
      for (const p of participations as Array<{ ownerContactId?: string | null }>) if (p.ownerContactId === id) p.ownerContactId = undefined
      return removeFromArrayById(contacts as { id: string }[], id)
    }

    return removeFromArrayById(mockMap[resource], id)
  }

  const prisma = usePrisma() as Record<string, { delete(args: { where: { id: string } }): Promise<{ id: string }>; deleteMany?: (args: { where: Record<string, string | null> }) => Promise<unknown>; updateMany?: (args: { where: Record<string, string>; data: Record<string, null> }) => Promise<unknown> }>

  try {
    if (resource === 'events') {
      await prisma.logisticsItem.deleteMany?.({ where: { eventId: id } })
      await prisma.promoItem.deleteMany?.({ where: { eventId: id } })
      await prisma.socialPost.deleteMany?.({ where: { eventId: id } })
      await prisma.event.delete({ where: { id } })
      return true
    }

    if (resource === 'external-communities') {
      const linkedEvents = await (usePrisma() as { externalEvent: { findMany: (args: { where: { communityId: string }; select: { id: true } }) => Promise<Array<{ id: string }>> } }).externalEvent.findMany({
        where: { communityId: id },
        select: { id: true }
      })
      for (const ev of linkedEvents) {
        await prisma.participation.deleteMany?.({ where: { externalEventId: ev.id } })
      }
      await prisma.externalEvent.deleteMany?.({ where: { communityId: id } })
      await prisma.externalCommunity.delete({ where: { id } })
      return true
    }

    if (resource === 'external-events') {
      await prisma.participation.deleteMany?.({ where: { externalEventId: id } })
      await prisma.externalEvent.delete({ where: { id } })
      return true
    }

    if (resource === 'contacts') {
      await prisma.speaker.updateMany?.({ where: { contactId: id }, data: { contactId: null } })
      await prisma.sponsor.updateMany?.({ where: { contactId: id }, data: { contactId: null } })
      await prisma.venue.updateMany?.({ where: { contactId: id }, data: { contactId: null } })
      await prisma.contractor.updateMany?.({ where: { contactId: id }, data: { contactId: null } })
      await prisma.logisticsItem.updateMany?.({ where: { ownerContactId: id }, data: { ownerContactId: null } })
      await prisma.participation.updateMany?.({ where: { ownerContactId: id }, data: { ownerContactId: null } })
      await prisma.contact.delete({ where: { id } })
      return true
    }

    const modelMap: Record<Exclude<DeletableResource, 'events' | 'external-communities' | 'external-events' | 'contacts'>, string> = {
      speakers: 'speaker',
      sponsors: 'sponsor',
      venues: 'venue',
      contractors: 'contractor',
      tools: 'tool',
      promo_items: 'promoItem',
      logistics_items: 'logisticsItem',
      social_posts: 'socialPost',
      participations: 'participation'
    }
    const model = modelMap[resource]
    await prisma[model].delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
