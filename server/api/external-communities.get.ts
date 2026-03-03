import { parseLocale, localizeEntity } from '../utils/localize'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const list = await ds.listExternalCommunities()
  return list.map((c) => localizeEntity(c, locale, ['name', 'notes']))
})
