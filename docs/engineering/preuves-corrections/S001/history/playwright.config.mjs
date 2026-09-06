export default {
  testDir: '../../../../../tests/e2e/core-flows',
  testMatch: 'history-audit.spec.js',
  use: { baseURL: 'http://127.0.0.1:3001', screenshot: 'only-on-failure' },
  projects: [{name:'chromium', use:{browserName:'chromium'}}],
  workers: 1, retries: 0, reporter: 'line',
  outputDir: './browser-dev',
}
