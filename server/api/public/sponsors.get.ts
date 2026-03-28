import { parseLocale, localizeEntity } from '../../utils/localize'

/** Liste sponsors / partenaires sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const sponsors = await ds.listSponsors()
  return sponsors.map((s) => localizeEntity(s, locale, ['companyName', 'notes']))
})
