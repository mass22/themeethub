import { expect, test } from '@playwright/test'

test('create event via form', async ({ page }) => {
  await page.goto('/events/new')

  // Remplir le formulaire avec les bons labels
  await page.getByLabel('Titre').fill('Playwright Event')
  await page.getByLabel('Date et heure').fill('2025-12-01T10:00')
  await page.getByLabel('Slug').fill('playwright-event')
  await page.getByLabel('Location').fill('Montréal, QC')
  await page.getByLabel('Description').fill('Événement créé par Playwright')

  // Cliquer sur le bouton avec le bon texte
  await page.getByRole('button', { name: 'Créer l\'événement' }).click()

  // Vérifier la redirection vers la page de l'événement
  await expect(page).toHaveURL(/\/events\/evt_/)

  // Aller à la liste des événements et vérifier que l'événement est visible
  await page.goto('/events')
  await expect(page.getByRole('heading', { name: 'Playwright Event' }).first()).toBeVisible()
})