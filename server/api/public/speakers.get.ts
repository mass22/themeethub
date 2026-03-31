import { parseLocale, localizeEntity } from '../../utils/localize'

/** Liste intervenants sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const speakers = await ds.listSpeakers()
  const publishedSpeakers = speakers.filter((s) => Boolean(s.publishedAt))
  return publishedSpeakers.map((s) => localizeEntity(s, locale, ['name', 'role', 'bio']))
})
