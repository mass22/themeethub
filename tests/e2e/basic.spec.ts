import { expect, test } from '@playwright/test'

test('dashboard is reachable', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Statistiques globales' })).toBeVisible({ timeout: 10000 })
  const statsSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Statistiques globales' }),
  })
  await expect(statsSection.locator('.grid').first()).toBeVisible()
})
