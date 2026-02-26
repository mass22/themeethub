export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const c = await ds.getExternalCommunity(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'External community not found' })
  return c
})
