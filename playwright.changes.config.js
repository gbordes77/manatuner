import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'core-flows/compare-change.spec.js',
  retries: 0,
  workers: 1,
  reporter: 'line',
  outputDir: process.env.CHANGES_TEST_OUTPUT || 'test-results/compare-changes',
  use: {
    baseURL: process.env.CHANGES_BASE_URL || 'http://127.0.0.1:4197',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
