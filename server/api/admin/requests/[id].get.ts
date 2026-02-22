export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const r = await ds.getRequest(id)
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Request not found' })
  return r
})
