export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const s = await ds.getSocialPost(id)
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Social post not found' })
  return s
})
