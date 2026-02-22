import type { H3Event } from 'h3'

/**
 * Honeypot: if 'website' field is present and non-empty, reject (likely bot)
 */
export function checkHoneypot(body: unknown): void {
  if (body && typeof body === 'object' && 'website' in body) {
    const w = (body as { website?: unknown }).website
    if (typeof w === 'string' && w.trim().length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payload',
        message: 'Invalid payload'
      })
    }
  }
}

/**
 * Standard string transform: trim
 */
export const trimString = (s: string) => (typeof s === 'string' ? s.trim() : s)

/**
 * Standard email transform: trim + lowercase
 */
export const normalizeEmail = (s: string) =>
  (typeof s === 'string' ? s.trim().toLowerCase() : s)

/**
 * Placeholder for future Turnstile/hCaptcha integration.
 * Returns null for now; when captcha is added, validate token and throw if invalid.
 *
 * Usage later:
 *   const token = await useCaptchaToken(event)
 *   if (!token) throw createError({ statusCode: 400, ... })
 *   await verifyTurnstile(token) // or verifyHCaptcha(token)
 */
export async function useCaptchaToken(_event: H3Event): Promise<string | null> {
  return null
}
