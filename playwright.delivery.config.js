import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['accessibility/*.spec.js', 'delivery/*.spec.js'],
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: 'line',
  outputDir: process.env.DELIVERY_TEST_OUTPUT || 'test-results/delivery',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-candidate.mjs',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
  },
})
