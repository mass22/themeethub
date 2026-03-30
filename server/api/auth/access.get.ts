import { getRequestHeaders } from 'h3'
import { auth } from '../../../lib/auth'
import { parseAllowedEmails, isEmailAllowed } from '../../utils/authAccess'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(event)
  })

  if (!session?.session) {
    return { authenticated: false, allowed: false }
  }

  const allowed = parseAllowedEmails(process.env.NUXT_AUTH_ALLOWED_EMAILS)
  return {
    authenticated: true,
    allowed: isEmailAllowed(session.user?.email, allowed)
  }
})
