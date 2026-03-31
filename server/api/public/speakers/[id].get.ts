import { parseLocale, localizeEntity } from '../../../utils/localize'

/** Détail intervenant sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store, max-age=0')
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const s = await ds.getSpeaker(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
  if (!s.publishedAt) throw createError({ statusCode: 404, statusMessage: 'Speaker not published' })
  return localizeEntity(s, locale, ['name', 'role', 'bio'])
})
