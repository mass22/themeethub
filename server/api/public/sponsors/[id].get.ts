import { parseLocale, localizeEntity } from '../../../utils/localize'

/** Détail sponsor sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const s = await ds.getSponsor(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Sponsor not found' })
  return localizeEntity(s, locale, ['companyName', 'notes'])
})
