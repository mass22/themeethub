import { parseLocale, localizeEntity } from '../../utils/localize'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const p = await ds.getPromoItem(id)
  if (!p) throw createError({ statusCode: 404, statusMessage: 'Promo item not found' })
  return localizeEntity(p, locale, ['title', 'copy', 'notes'])
})
