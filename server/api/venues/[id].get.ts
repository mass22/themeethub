export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const v = await ds.getVenue(id)
  if (!v) throw createError({ statusCode: 404, statusMessage: 'Venue not found' })
  return v
})
