export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const p = await ds.getParticipation(id)
  if (!p) throw createError({ statusCode: 404, statusMessage: 'Participation not found' })
  return p
})
