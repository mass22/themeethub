import { parseLocale, localizeEntity } from '../../utils/localize'

/** Liste sponsors / partenaires sans auth — vitrine. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = parseLocale(query)
  const ds = useDataSource()
  const sponsors = (await ds.listSponsors()).filter((s) => s.type !== 'financial_event')
  return sponsors.map((s) => localizeEntity(s, locale, ['companyName', 'notes']))
})
