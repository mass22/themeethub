import type { CalendarItem, CalendarItemType } from '../../types/calendarItem'

/** Vérifie qu'une chaîne est un ISO 8601 valide (parseable en Date). */
function isValidIso(iso: string): boolean {
  if (!iso || typeof iso !== 'string') return false
  return !Number.isNaN(new Date(iso).getTime())
}

/** Normalise une valeur en ISO string, ou null si invalide. */
function parseToIso(val: string | undefined | null): string | null {
  if (!val || typeof val !== 'string') return null
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const from = query.from as string | undefined
  const to = query.to as string | undefined
  const type = query.type as CalendarItemType | CalendarItemType[] | undefined

  // FullCalendar datesSet: arg.start (inclusif), arg.end (exclusif)
  // Range [fromIso, toIso) — comparaison ISO string (ordre lexicographique correct)
  const now = new Date()
  let fromIso: string
  let toIso: string

  if (from && to) {
    const f = parseToIso(from)
    const t = parseToIso(to)
    if (!f || !t) {
      throw createError({ statusCode: 400, message: 'Query params from/to must be valid ISO 8601 dates' })
    }
    fromIso = f
    toIso = t
  } else if (from) {
    const f = parseToIso(from)
    if (!f) throw createError({ statusCode: 400, message: 'Query param from must be valid ISO 8601' })
    fromIso = f
    const d = new Date(from)
    d.setDate(d.getDate() + 31)
    toIso = d.toISOString()
  } else {
    fromIso = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).toISOString()
    toIso = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0).toISOString() // premier jour du mois suivant (exclusif)
  }

  const typeFilter = Array.isArray(type) ? type : type ? [type] : undefined

  const ds = useDataSource()
  const items: CalendarItem[] = []

  /** Item dans la plage [fromIso, toIso) — comparaison ISO string, pas new Date().getTime() */
  const inRange = (startAt: string) => {
    if (!startAt || !isValidIso(startAt)) return false
    return startAt >= fromIso && startAt < toIso
  }

  const matchesType = (t: CalendarItemType) => !typeFilter || typeFilter.includes(t)

  // events
  const events = await ds.listEvents()
  for (const e of events) {
    const startAt = parseToIso(e.date)
    if (startAt && inRange(startAt) && matchesType('event')) {
      items.push({
        id: e.id,
        type: 'event',
        title: e.title,
        startAt,
        href: `/events/${e.id}`,
        meta: { location: e.location }
      })
    }
  }

  // promo_items
  const promoItems = await ds.listPromoItems()
  for (const p of promoItems) {
    const startAt = parseToIso(p.dueAt ?? p.createdAt)
    if (startAt && inRange(startAt) && matchesType('promo')) {
      items.push({
        id: p.id,
        type: 'promo',
        title: p.title,
        startAt,
        status: p.status,
        href: `/promo/${p.id}`,
        meta: { channel: p.channel }
      })
    }
  }

  // social_posts
  const socialPosts = await ds.listSocialPosts()
  for (const s of socialPosts) {
    const startAt = parseToIso(s.scheduledAt ?? s.createdAt)
    if (startAt && inRange(startAt) && matchesType('social')) {
      items.push({
        id: s.id,
        type: 'social',
        title: s.copy?.slice(0, 50) ?? `Post #${s.id}`,
        startAt,
        status: s.status,
        href: `/social/${s.id}`,
        meta: { platform: s.platform }
      })
    }
  }

  // logistics_items (dueAt if present, else createdAt)
  const logisticsItems = await ds.listLogisticsItems()
  for (const l of logisticsItems) {
    const startAt = parseToIso(l.dueAt ?? l.createdAt)
    if (startAt && inRange(startAt) && matchesType('logistics')) {
      items.push({
        id: l.id,
        type: 'logistics',
        title: l.name,
        startAt,
        status: l.status,
        href: `/logistics/${l.id}`,
        meta: { category: l.category }
      })
    }
  }

  // external_events
  const externalEvents = await ds.listExternalEvents()
  for (const e of externalEvents) {
    const startAt = parseToIso(e.startAt)
    if (startAt && inRange(startAt) && matchesType('external_event')) {
      items.push({
        id: e.id,
        type: 'external_event',
        title: e.title,
        startAt,
        status: undefined,
        href: `/external-events/${e.id}`,
        meta: { communityId: e.communityId, location: e.location }
      })
    }
  }

  // participations (followUpDueAt)
  const participations = await ds.listParticipations()
  for (const p of participations) {
    const startAt = parseToIso(p.followUpDueAt)
    if (startAt && inRange(startAt) && matchesType('participation')) {
      const evt = await ds.getExternalEvent(p.externalEventId)
      items.push({
        id: p.id,
        type: 'participation',
        title: evt ? `Follow-up: ${evt.title}` : `Participation #${p.id}`,
        startAt,
        status: p.status,
        href: `/external-events/${p.externalEventId}`,
        meta: { intent: p.intent }
      })
    }
  }

  items.sort((a, b) => (a.startAt < b.startAt ? -1 : a.startAt > b.startAt ? 1 : 0))
  return items
})
