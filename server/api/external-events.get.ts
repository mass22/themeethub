export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const communityId = query.communityId as string | undefined
  const ds = useDataSource()
  const list = await ds.listExternalEvents()
  const filtered = communityId ? list.filter((e) => e.communityId === communityId) : list
  return filtered
})
