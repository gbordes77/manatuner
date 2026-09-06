import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('initial HTTP content, 404, asset and direct analyzer reload', async ({
  request,
  browser,
}) => {
  for (const route of [
    '/',
    '/analyzer',
    '/library',
    '/library/saito-part-1-concentration',
    '/library/author/frank-karsten',
    '/privacy',
  ]) {
    const response = await request.get(route)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('<!-- prerendered -->')
    expect(await response.text()).toMatch(/<h1[\s>]/)
  }
  const absent = await request.get('/audit-nonexistent-20260906')
  expect(absent.status()).toBe(404)
  expect(await absent.text()).toContain('noindex')
  expect(await absent.text()).not.toContain('rel="canonical"')
  const asset = await request.get('/boot-watchdog.js')
  expect(asset.status()).toBe(200)
  expect(asset.headers()['content-type']).toContain('javascript')
  const alias = await request.get('/mes-analyses', { maxRedirects: 0 })
  expect(alias.status()).toBe(308)
  expect(alias.headers().location).toBe('/my-analyses')
  const missingAsset = await request.get('/assets/does-not-exist.js')
  expect(missingAsset.status()).toBe(404)
  const context = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await context.newPage()
  await staticPage.goto('http://127.0.0.1:4175/library')
  await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible()
  await context.close()
})

test('direct analyzer query and reload mount the candidate chunks', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/analyzer?source=direct-link#deck')
  await expect(page.getByRole('button', { name: /try example/i })).toBeEnabled()
  await page.reload()
  await expect(page.getByRole('button', { name: /try example/i })).toBeEnabled()
  expect(errors).toEqual([])
})

test('contrast checker detects a real footer regression', async ({ page }) => {
  await page.goto('/')
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.locator('footer').evaluate((footer) => {
    footer.innerHTML =
      '<p style="font-size:16px;color:rgb(238,238,238);background:rgb(255,255,255)">Contrast regression fixture: this footer text must fail.</p>'
  })
  const results = await new AxeBuilder({ page })
    .include('footer')
    .withRules(['color-contrast'])
    .analyze()
  expect(results.violations.some((v) => v.id === 'color-contrast')).toBe(true)
})
