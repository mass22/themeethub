export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const c = await ds.getContractor(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'Contractor not found' })
  return c
})
