import { parseLocale, localizeEntity } from '../../../utils/localize'

/** Détail communauté externe sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store, max-age=0')
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const s = await ds.getExternalCommunity(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'External community not found' })
  if (!s.publishedAt) throw createError({ statusCode: 404, statusMessage: 'External community not published' })
  return localizeEntity(s, locale, ['name', 'websiteUrl'])
})