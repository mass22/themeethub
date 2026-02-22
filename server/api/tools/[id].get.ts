export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const t = await ds.getTool(id)
  if (!t) throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
  return t
})
