import { getRequestIP } from 'h3'
import type { H3Event } from 'h3'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 10

export function checkRateLimit(
  event: H3Event,
  options: { maxRequests?: number; windowMs?: number } = {}
): void {
  const maxRequests = options.maxRequests ?? MAX_REQUESTS
  const windowMs = options.windowMs ?? WINDOW_MS
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()

  let entry = store.get(ip)
  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }
  if (now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }
  entry.count += 1
  if (entry.count > maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    })
  }
}

/**
 * Reset rate limit for an IP (useful for tests)
 */
export function resetRateLimit(ip?: string): void {
  if (ip) {
    store.delete(ip)
  } else {
    store.clear()
  }
}
