import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { magicLink } from 'better-auth/plugins/magic-link'
import { usePrisma } from '../server/utils/prisma'

const prisma = usePrisma()

const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'

const githubOAuth =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ['user:email']
        }
      }
    : {}

async function sendMagicLinkEmail(params: { to: string; subject: string; html: string; text: string; from: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text
      })
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Resend error ${res.status}: ${body}`)
    }
    return
  }
  console.log('[auth:magic-link] (no RESEND_API_KEY) email would be sent:', params)
}

function parseAllowedEmails(): Set<string> | null {
  const raw = process.env.NUXT_AUTH_ALLOWED_EMAILS?.trim()
  if (!raw) return null
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  ...(Object.keys(githubOAuth).length ? { socialProviders: githubOAuth } : {}),
  plugins: [
    magicLink({
      expiresIn: 60 * 15,
      async sendMagicLink({ email, url }) {
        const allowed = parseAllowedEmails()
        if (allowed && !allowed.has(email.toLowerCase())) {
          console.warn('[auth:magic-link] rejected email not in allowlist:', email)
          return
        }
        const from = process.env.NUXT_FROM_EMAIL || 'onboarding@resend.dev'
        await sendMagicLinkEmail({
          to: email,
          from,
          subject: 'TheMeetHub — lien de connexion',
          text: `Connexion TheMeetHub : ${url}\n\nCe lien expire dans 15 minutes.`,
          html: `<p>Connexion <strong>TheMeetHub</strong></p><p><a href="${url}">Se connecter</a></p><p>Ce lien expire dans 15 minutes.</p>`
        })
      }
    })
  ]
})
