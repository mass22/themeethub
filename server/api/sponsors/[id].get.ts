export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSponsor(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Sponsor not found' })
  return s
})
