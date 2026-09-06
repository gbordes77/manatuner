import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: [
    'core-flows/input-contract-audit.spec.js',
    'core-flows/cancellation-audit.spec.js',
    'core-flows/synthesis-audit.spec.js',
    'core-flows/history-audit.spec.js',
    'core-flows/mulligan-worker-recovery.spec.js',
    'core-flows/privacy-audit.spec.js',
    'core-flows/final-audit.spec.js',
  ],
  retries: 0,
  workers: 1,
  reporter: 'line',
  outputDir: process.env.AUDIT_TEST_OUTPUT || 'test-results/audit',
  use: { baseURL: 'http://127.0.0.1:3000', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: { command: 'CANDIDATE_PORT=3000 node scripts/serve-candidate.mjs', url: 'http://127.0.0.1:3000', reuseExistingServer: false },
})
