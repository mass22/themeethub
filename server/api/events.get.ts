import { parseLocale, localizeEntity } from '../utils/localize'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const events = await ds.listEvents()
  return events.map((e) => localizeEntity(e, locale, ['title', 'description']))
})