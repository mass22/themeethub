export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const e = await ds.getEvent(id)
  if (!e) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  return e
})