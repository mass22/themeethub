import { parseLocale, localizeEntity } from '../utils/localize'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const list = await ds.listLogisticsItems()
  return list.map((l) => localizeEntity(l, locale, ['name', 'notes']))
})
