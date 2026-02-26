export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const externalEventId = query.externalEventId as string | undefined
  const ds = useDataSource()
  const list = await ds.listParticipations()
  const filtered = externalEventId ? list.filter((p) => p.externalEventId === externalEventId) : list
  return filtered
})
