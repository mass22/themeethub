import { parseLocale, localizeEntity } from '../../utils/localize'

/** Liste intervenants sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const speakers = await ds.listSpeakers()
  return speakers.map((s) => localizeEntity(s, locale, ['name', 'role', 'bio']))
})
