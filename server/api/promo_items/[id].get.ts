export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const p = await ds.getPromoItem(id)
  if (!p) throw createError({ statusCode: 404, statusMessage: 'Promo item not found' })
  return p
})
