import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const c = await ds.getExternalCommunity(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'External community not found' })
  return localizeEntity(c, locale, ['name', 'notes'])
})
