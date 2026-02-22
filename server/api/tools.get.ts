export default defineEventHandler(async () => {
  const ds = useDataSource()
  return ds.listTools()
})
