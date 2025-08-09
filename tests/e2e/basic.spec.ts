import { expect, test } from '@playwright/test'
test('dashboard is reachable', async ({ page }) => {
  await page.goto('/dashboard')
  // Vérifie que la page dashboard charge avec son titre (attendre le chargement de l'i18n)
  await expect(page.locator('h2')).toBeVisible({ timeout: 10000 })
  // Optionnel : vérifier aussi que les EventCard se chargent
  await expect(page.locator('.grid')).toBeVisible()
})
