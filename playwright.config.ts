import { defineConfig, devices } from '@playwright/test'

/** Port dédié aux e2e pour ne pas réutiliser un `nuxt dev` classique sur :3000 (sans e2eBypassAuth). */
const E2E_PORT = process.env.E2E_PORT ?? '3100'
const E2E_ORIGIN = `http://localhost:${E2E_PORT}`

/** Ne pas se baser sur `CI` seul : certains environnements (IDE) définissent CI=true et lanceraient preview sans build. */
const E2E_USE_PREVIEW = process.env.E2E_PREVIEW === '1'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /**
   * Peu de workers : `nuxt dev` + Nitro supportent mal 5+ navigateurs qui chargent le dashboard en parallèle
   * (fetch annulés / « Failed to fetch » dans les logs du webServer, bruit sans échec des tests).
   */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: E2E_ORIGIN,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: E2E_USE_PREVIEW
      ? `nuxt preview --port ${E2E_PORT}`
      : `nuxt dev --port ${E2E_PORT}`,
    env: {
      ...process.env,
      /** Dev : charge `nuxt.config.e2e` via `nuxt.config.ts`. Preview : build classique + bypass via env public. */
      NUXT_E2E: '1',
      NUXT_PUBLIC_E2E_BYPASS_AUTH: 'true',
    },
    url: E2E_ORIGIN,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes pour démarrer
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
