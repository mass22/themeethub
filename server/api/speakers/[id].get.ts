export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSpeaker(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Speaker not found' })
  return s
})
