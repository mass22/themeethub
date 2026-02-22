export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const l = await ds.getLogisticsItem(id)
  if (!l) throw createError({ statusCode: 404, statusMessage: 'Logistics item not found' })
  return l
})
