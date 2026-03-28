/** Contourne les erreurs réseau transitoires en dev (ex. charge parallèle e2e / rechargement Vite). */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  opts?: { retries?: number; delayMs?: number }
): Promise<T> {
  const retries = opts?.retries ?? 2
  const delayMs = opts?.delayMs ?? 120
  let last: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (e) {
      last = e
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw last
}
