import { expect, test } from '@playwright/test'

test('create event via form', async ({ page }) => {
  const suffix = Date.now()
  const title = `Playwright Event ${suffix}`
  const slug = `playwright-e2e-${suffix}`

  await page.goto('/events/new')
  await expect(page.getByRole('heading', { name: 'Créer un événement' })).toBeVisible({ timeout: 15000 })

  await page.getByLabel('Titre').fill(title)
  await page.getByLabel('Date et heure').fill('2025-12-01T10:00')
  await page.getByLabel('Slug').fill(slug)
  await page.locator('#location').click()
  await page.locator('[data-slot="itemLabel"]').filter({ hasText: /^Présentiel$/ }).click()
  await page.keyboard.press('Escape')
  await page.locator('#description [contenteditable="true"]').fill('Événement créé par Playwright')

  // Cliquer sur le bouton avec le bon texte
  await page.getByRole('button', { name: 'Créer l\'événement' }).click()

  // Vérifier la redirection vers la page de l'événement
  await expect(page).toHaveURL(/\/events\/evt_/)

  // Aller à la liste des événements et vérifier que l'événement est visible
  await page.goto('/events')
  await expect(page.getByRole('heading', { name: title }).first()).toBeVisible()
})