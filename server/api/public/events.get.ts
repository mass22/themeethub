import { parseLocale, localizeEntity } from '../../utils/localize'

/** Liste événements sans auth — pour app vitrine / fetch cross-origin sans cookie. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const events = await ds.listEvents()
  const publishedEvents = events.filter((e) => Boolean(e.publishedAt))
  return publishedEvents.map((e) => localizeEntity(e, locale, ['title', 'description']))
})
