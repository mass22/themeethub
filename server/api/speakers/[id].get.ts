import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const s = await ds.getSpeaker(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
  return localizeEntity(s, locale, ['name', 'role', 'bio'])
})
