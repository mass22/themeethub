export default defineEventHandler(async (event) => {
  const ds = useDataSource()
  const body = await readBody(event)
  return ds.createSpeaker(body)
})