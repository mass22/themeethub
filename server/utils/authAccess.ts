export function parseAllowedEmails(raw: string | undefined | null): Set<string> | null {
  const value = raw?.trim()
  if (!value) return null
  return new Set(
    value
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function isEmailAllowed(email: string | undefined | null, allowed: Set<string> | null): boolean {
  if (!allowed) return true
  if (!email) return false
  return allowed.has(email.toLowerCase())
}
