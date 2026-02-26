export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string | undefined
  const channel = query.channel as string | undefined
  const ds = useDataSource()
  const list = await ds.listPromoItems()
  let filtered = list
  if (status) filtered = filtered.filter((p) => p.status === status)
  if (channel) filtered = filtered.filter((p) => p.channel === channel)
  return filtered
})
