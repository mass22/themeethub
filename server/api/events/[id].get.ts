import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const e = await ds.getEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  return localizeEntity(e, locale, ['title', 'description'])
})