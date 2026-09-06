import { test, expect } from '../../fixtures/audit-browser.js'

async function analyze(page) {
  await page.goto('/analyzer')
  await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
}

test('E02 mobile manabase tabs show their complete labels and open the deck', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 360, height: 900 })
  await analyze(page)
  await page.getByTestId('tab-manabase').click()
  const tab = page.getByRole('tab', { name: 'Full Deck List', exact: true })
  const bounds = await tab.evaluate(el => {
    const range = document.createRange()
    const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('Full Deck List'))
    range.selectNode(node)
    const text = range.getBoundingClientRect()
    const scroller = el.closest('.MuiTabs-scroller').getBoundingClientRect()
    return { left: text.left, right: text.right, clipLeft: scroller.left, clipRight: scroller.right }
  })
  expect(bounds.left).toBeGreaterThanOrEqual(bounds.clipLeft)
  expect(bounds.right).toBeLessThanOrEqual(bounds.clipRight)
  await tab.click()
  await expect(tab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Lightning Bolt', { exact: true }).first()).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('manabase-mobile.png') })
})

test('V05 blueprint JSON matches results and PNG/PDF retain the whole tall blueprint', async ({ page }, testInfo) => {
  test.setTimeout(90000)
  await page.setViewportSize({ width: 360, height: 900 })
  await analyze(page)
  await page.getByTestId('tab-blueprint').click()
  const card = page.getByTestId('blueprint-card')
  expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const downloads = {}
  for (const [kind, label] of [['json', 'JSON (Backup)'], ['png', 'PNG (Social Media)'], ['pdf', 'PDF (Documentation)']]) {
    await page.getByRole('button', { name: 'Export Blueprint', exact: true }).click()
    const pending = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: label, exact: true }).click()
    const download = await pending
    const path = testInfo.outputPath(`blueprint.${kind}`)
    await download.saveAs(path)
    downloads[kind] = await (await import('node:fs/promises')).readFile(path)
  }
  const json = JSON.parse(downloads.json)
  expect(json.analysis.totalCards).toBe(60)
  expect(json.analysis.totalLands).toBe(24)
  expect(json.stabilityScore).toBe(Math.round(json.analysis.consistency * 100))
  expect(downloads.png.subarray(1, 4).toString()).toBe('PNG')
  const width = downloads.png.readUInt32BE(16)
  const height = downloads.png.readUInt32BE(20)
  const expectedPages = Math.ceil(height / Math.floor(width * 277 / 190))
  expect(expectedPages).toBeGreaterThan(1)
  const pageCount = [...downloads.pdf.toString('latin1').matchAll(/\/Type \/Page\b/g)].length
  expect(pageCount).toBe(expectedPages)
  await page.screenshot({ path: testInfo.outputPath('blueprint-display.png'), fullPage: true })
})

for (const width of [768, 1440]) {
  test(`NR-M21/M27 shared deck survives direct navigation and back at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => { window.__sharedLink = value } } })
    })
    await analyze(page)
    await page.getByTestId('tab-manabase').click()
    await page.getByRole('button', { name: 'Copy shareable link to this manabase analysis', exact: true }).click()
    const url = await page.evaluate(() => window.__sharedLink)
    expect(new URL(url).hash).toContain('d=')
    expect(new URL(url).search).toBe('')
    await page.goto('/library')
    await page.goBack()
    await page.goto(url)
    await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue('24 Mountain\n36 Lightning Bolt')
    await page.reload()
    await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue('24 Mountain\n36 Lightning Bolt')
    await page.getByRole('button', { name: /analyze manabase/i }).click()
    await expect(page.getByTestId('analysis-results')).toBeVisible()
    await page.getByTestId('tab-manabase').click()
    await expect(page.getByRole('tab', { name: 'Full Deck List', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`manabase-${width}.png`) })
  })
}

test('NR-M02 actual Try Example resolves all twenty public card names and saves sixty cards', async ({ page }) => {
  const { default: sampleCards } = await import('../../fixtures/scryfall-sample-audit.json', { with: { type: 'json' } })
  await page.route('https://api.scryfall.com/**', async route => {
    if (route.request().url().includes('/cards/collection')) {
      const names = route.request().postDataJSON().identifiers.map(c => c.name)
      await route.fulfill({ json: { object: 'list', data: sampleCards.filter(c => names.includes(c.name)) } })
    } else await route.fallback()
  })
  await page.goto('/analyzer')
  await expect(page.getByRole('button', { name: /analyze manabase/i })).toBeDisabled()
  await page.getByRole('button', { name: 'Try Example', exact: true }).click()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(/4 Llanowar Elves/)
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses'))[0])
  expect(record.analysis.totalCards).toBe(60)
  expect(record.analysis.cards).toHaveLength(20)
  expect(record.deckName).toBe("Nature's Rhythm (Midrange Combo)")
})

test('NR-M24 global metadata outage reports an error and the same deck can be retried', async ({ page }) => {
  test.setTimeout(45000)
  // No seeded lands: every card needs remote metadata, so a total outage cannot resolve any card.
  const outage = async route => route.fulfill({ status: 503, json: { object: 'error', code: 'unavailable' } })
  await page.route('https://api.scryfall.com/**', outage)
  await page.goto('/analyzer')
  await page.getByPlaceholder(/paste your decklist/i).fill('60 Lightning Bolt')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByRole('alert').filter({ hasText: /Failed to analyze deck/ })).toBeVisible({ timeout: 35000 })
  await expect(page.getByTestId('analysis-results')).toHaveCount(0)
  await page.unroute('https://api.scryfall.com/**', outage)
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses')).length)).toBe(1)
})
