import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const l = await ds.getLogisticsItem(id)
  if (!l) throw createError({ statusCode: 404, statusMessage: 'Logistics item not found' })
  return localizeEntity(l, locale, ['name', 'notes'])
})
