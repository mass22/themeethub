import { parseLocale, localizeEntity } from '../utils/localize'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const communityId = query.communityId as string | undefined
  const ds = useDataSource()
  const list = await ds.listExternalEvents()
  const filtered = communityId ? list.filter((e) => e.communityId === communityId) : list
  return filtered.map((e) => localizeEntity(e, locale, ['title', 'notes']))
})
