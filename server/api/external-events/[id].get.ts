export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const e = await ds.getExternalEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'External event not found' })
  return e
})
