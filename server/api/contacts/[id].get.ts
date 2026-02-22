export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const c = await ds.getContact(id)
  if (!c) throw createError({ statusCode: 404, statusMessage: 'Contact not found' })
  return c
})
