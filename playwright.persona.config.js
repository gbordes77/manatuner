import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e/core-flows',
  testMatch: 'persona-followup.spec.js',
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: 'line',
  outputDir: process.env.PERSONA_TEST_OUTPUT || 'test-results/persona',
  use: { baseURL: 'http://127.0.0.1:3001', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'CANDIDATE_PORT=3001 node scripts/serve-candidate.mjs', url: 'http://127.0.0.1:3001', reuseExistingServer: false },
})
