/**
 * Utilitaire de localisation pour les API multilingues (Phase 1).
 * Accepte les données existantes (string) et le format i18n futur (Record<string, string>).
 */

const FALLBACK_LOCALE = 'fr'
const SUPPORTED_LOCALES = ['fr', 'en']

export type LocalizableValue = string | Record<string, string> | undefined | null

/**
 * Résout une valeur localisable en string pour la locale demandée.
 * - Si string : retourne tel quel (rétrocompatibilité)
 * - Si Record : retourne value[locale] ?? value[fallback] ?? première valeur disponible
 */
export function localize(
  value: LocalizableValue,
  locale: string,
  fallbackLocale: string = FALLBACK_LOCALE
): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, string>
    const direct = obj[locale] ?? obj[fallbackLocale]
    if (direct) return direct
    const first = Object.values(obj).find(Boolean)
    return first
  }
  return undefined
}

/**
 * Valide et normalise la locale depuis la requête.
 * Retourne une locale supportée ou le fallback.
 */
export function parseLocale(query: Record<string, unknown>): string {
  const raw = query.locale as string | undefined
  if (!raw || typeof raw !== 'string') return FALLBACK_LOCALE
  const code = raw.toLowerCase().slice(0, 2)
  return SUPPORTED_LOCALES.includes(code) ? code : FALLBACK_LOCALE
}

/**
 * Localise les champs d'un objet. Crée une copie shallow avec les champs résolus.
 * Les champs non localisables sont copiés tels quels.
 */
export function localizeEntity<T extends Record<string, unknown>>(
  obj: T,
  locale: string,
  fields: (keyof T)[]
): T {
  const result = { ...obj }
  for (const key of fields) {
    const val = result[key] as LocalizableValue
    const resolved = localize(val, locale)
    if (resolved !== undefined) {
      ;(result as Record<string, unknown>)[key as string] = resolved
    }
  }
  return result
}
