import { parseLocale, localizeEntity } from '../../../utils/localize'

/** Détail sponsor sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store, max-age=0')
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const s = await ds.getSponsor(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Sponsor not found' })
  if (!s.publishedAt || s.type === 'financial_event') throw createError({ statusCode: 404, statusMessage: 'Sponsor not published' })
  return localizeEntity(s, locale, ['companyName', 'notes'])
})
