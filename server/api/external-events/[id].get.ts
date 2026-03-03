import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const e = await ds.getExternalEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'External event not found' })
  return localizeEntity(e, locale, ['title', 'notes'])
})
