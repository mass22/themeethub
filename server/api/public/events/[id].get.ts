import { parseLocale, localizeEntity } from '../../../utils/localize'

/** Détail événement sans auth — pour la vitrine. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const e = await ds.getEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  if (!e.publishedAt) throw createError({ statusCode: 404, statusMessage: 'Event not published' })
  const venue = e.venueId ? await ds.getVenue(e.venueId) : null
  return localizeEntity({ ...e, venue }, locale, ['title', 'description'])
})
