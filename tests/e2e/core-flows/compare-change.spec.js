import { test, expect } from '../../fixtures/audit-browser.js'
import commanderCards from '../../fixtures/scryfall-persona-edh.json' with { type: 'json' }

const original = '24 Mountain\n36 Lightning Bolt'
const variant = '20 Mountain\n40 Lightning Bolt'
const history = page => page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses') || '[]'))
const dialog = page => page.getByRole('dialog', { name: 'Compare a change' })
const edit = page => dialog(page).getByRole('textbox', { name: 'B — edit your variant deck list' })
async function start(page, deck = original) {
  await page.goto('/analyzer')
  await page.getByPlaceholder(/paste your decklist/i).fill(deck)
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  await page.getByRole('button', { name: 'Compare a change', exact: true }).click()
  await expect(dialog(page)).toBeVisible()
}
async function calculate(page, deck = variant) {
  await edit(page).fill(deck)
  await dialog(page).getByRole('button', { name: 'Analyze variant', exact: true }).click()
  await expect(dialog(page).getByRole('region', { name: 'Saved build comparison' })).toBeVisible()
}

test('CMP01–04 edit manual B, points only for comparable populations, discard preserves A', async ({ page }, info) => {
  await start(page)
  const before = await history(page)
  expect(before).toHaveLength(1)
  await expect(edit(page)).toHaveValue(/24 Mountain/)
  await expect(dialog(page).getByRole('button', { name: 'Analyze variant', exact: true })).toBeDisabled()
  await edit(page).fill(variant)
  await expect(dialog(page)).toContainText('Removed 4 Mountain (library)')
  await expect(dialog(page)).toContainText('Added 4 Lightning Bolt (library)')
  await calculate(page)
  const comparison = dialog(page).getByRole('region', { name: 'Saved build comparison' })
  await expect(comparison.getByTestId('comparison-spell')).toContainText(/-\d+\.\d+ points/)
  await expect(dialog(page)).toContainText('60 library cards · 24 lands')
  expect(await history(page)).toEqual(before)
  await calculate(page, '20 Mountain\n39 Lightning Bolt')
  await expect(comparison).toContainText('The library populations differ.')
  await expect(comparison.locator('.MuiChip-root').filter({ hasText: /points/ })).toHaveCount(0)
  await page.screenshot({ path: info.outputPath('different-population.png') })
  await dialog(page).getByRole('button', { name: 'Discard variant', exact: true }).click()
  await expect(dialog(page)).toHaveCount(0)
  expect(await history(page)).toEqual(before)
  await page.getByRole('button', { name: 'Edit Deck', exact: true }).click()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(original)
})

test('CMP05 saving produces a distinct ID and quota refusal leaves history intact', async ({ page }) => {
  await start(page)
  const before = await history(page)
  await calculate(page)
  await dialog(page).getByRole('textbox', { name: 'Variant name', exact: true }).fill('QA independent variant')
  await page.evaluate(() => {
    window.qaSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = function(key, value) {
      if (key === 'manatuner_analyses') throw new DOMException('Injected quota', 'QuotaExceededError')
      return window.qaSetItem.call(this, key, value)
    }
  })
  await dialog(page).getByRole('button', { name: 'Save variant separately', exact: true }).click()
  await expect(dialog(page)).toContainText('Browser storage full. No history was changed.')
  expect(await history(page)).toEqual(before)
  await expect(edit(page)).toHaveValue(variant)
  await page.evaluate(() => { Storage.prototype.setItem = window.qaSetItem })
  await dialog(page).getByRole('button', { name: 'Save variant separately', exact: true }).click()
  await expect(dialog(page)).toContainText('Variant saved separately in My Analyses.')
  const after = await history(page)
  expect(after).toHaveLength(2)
  expect(after.find(r => r.id === before[0].id)).toEqual(before[0])
  expect(after.find(r => r.id !== before[0].id).deckName).toBe('QA independent variant')
  expect(after.find(r => r.id !== before[0].id).analysis.totalLands).toBe(20)
})

test('CMP06 cancellation ignores late B and restores original focus on discard', async ({ page }) => {
  await start(page)
  const before = await history(page)
  let release, markStarted, markFinished
  const started = new Promise(resolve => { markStarted = resolve })
  const finished = new Promise(resolve => { markFinished = resolve })
  const wait = new Promise(resolve => { release = resolve })
  await page.route('https://api.scryfall.com/**', async route => {
    markStarted()
    await wait
    await route.fulfill({ json: { object: 'list', data: [] } }).catch(() => {})
    markFinished()
  })
  await edit(page).fill('24 Mountain\n35 Lightning Bolt\n1 QA Pending Card')
  await dialog(page).getByRole('button', { name: 'Analyze variant', exact: true }).click()
  await expect(dialog(page).getByRole('button', { name: 'Cancel variant calculation' })).toBeVisible()
  await started
  await dialog(page).getByRole('button', { name: 'Cancel variant calculation' }).click()
  release()
  await finished
  await expect(dialog(page).getByRole('button', { name: 'Save variant separately' })).toBeDisabled()
  await expect(dialog(page).getByRole('region', { name: 'Saved build comparison' })).toHaveCount(0)
  await dialog(page).getByRole('button', { name: 'Discard variant', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Compare a change', exact: true })).toBeFocused()
  expect(await history(page)).toEqual(before)
})

test('CMP04 commander 99+1 remains fixed and outside library', async ({ page }) => {
  await page.route('https://api.scryfall.com/**', async route => {
    const request = route.request()
    const url = new URL(request.url())
    const names = url.pathname.endsWith('/collection') ? request.postDataJSON().identifiers.map(c => c.name) : [url.searchParams.get('exact') || url.searchParams.get('fuzzy')]
    const found = commanderCards.filter(c => names.includes(c.name))
    if (!found.length) return route.fallback()
    if (url.pathname.endsWith('/collection')) {
      // Let the ordinary fixture resolve the rest through the supported exact fallback.
      return route.fulfill({ json: { object: 'list', data: found } })
    }
    return route.fulfill({ json: found[0] })
  })
  const commander = commanderCards.find(c => c.name.startsWith('Atraxa'))?.name
  expect(commander).toBeTruthy()
  await start(page, `Commander\n1 ${commander}\n\nDeck\n35 Mountain\n64 Lightning Bolt`)
  await expect(dialog(page)).toContainText('99 library cards · 35 lands')
  const draft = await edit(page).inputValue()
  await edit(page).fill(draft.replace(`1 ${commander}`, '1 Lightning Bolt'))
  await expect(dialog(page)).toContainText('Keep the original commander unchanged.')
  await expect(dialog(page).getByRole('button', { name: 'Analyze variant', exact: true })).toBeDisabled()
  await calculate(page, draft.replace('35 Mountain', '36 Mountain').replace('64 Lightning Bolt', '63 Lightning Bolt'))
  await expect(dialog(page).getByRole('region', { name: 'Saved build comparison' })).not.toContainText('The commanders differ.')
  await expect(dialog(page)).toContainText('99 library cards · 35 lands')
})

test('B06 preview choices and copied payload match, clipboard refusal is recoverable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.qaClipboard = value } } })
  })
  await start(page)
  await calculate(page)
  await dialog(page).getByText('Preview context to share (optional)', { exact: true }).click()
  const preview = dialog(page).getByRole('textbox', { name: 'Context preview' })
  await expect(preview).toHaveValue(/COMPARISON A → B/)
  expect(await preview.inputValue()).not.toContain('A — deck by zone')
  await dialog(page).getByRole('checkbox', { name: 'Include deck list', exact: true }).check()
  await dialog(page).getByRole('checkbox', { name: 'Include deck name', exact: true }).check()
  await expect(preview).toHaveValue(/A — deck by zone/)
  await expect(preview).toHaveValue(/B — deck by zone/)
  await dialog(page).getByRole('button', { name: 'Copy context text' }).click()
  expect(await page.evaluate(() => window.qaClipboard)).toBe(await preview.inputValue())
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new DOMException('Denied', 'NotAllowedError') } })
  await dialog(page).getByRole('button', { name: 'Copy context text' }).click()
  await expect(dialog(page)).toContainText('Copy unavailable. Select and copy the preview text manually.')
})

for (const width of [320, 390, 768, 1440]) for (const theme of ['light', 'dark']) {
  test(`CMP responsive ${width} ${theme} no outer overflow, keyboard comparison region`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(theme => localStorage.setItem('manatuner-theme', theme), theme)
    await start(page)
    await calculate(page)
    const region = dialog(page).getByRole('region', { name: 'Saved build comparison' })
    await region.focus()
    await expect(region).toBeFocused()
    await page.keyboard.press('ArrowRight')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await dialog(page).evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
    await expect(dialog(page)).toHaveCSS('background-color', theme === 'dark' ? 'rgb(25, 26, 31)' : 'rgb(255, 255, 255)')
    await expect(page.locator('.MuiDialog-container')).toHaveCSS('opacity', '1')
    await info.attach('dialog-style', { body: JSON.stringify(await dialog(page).evaluate(el => ({ background: getComputedStyle(el).backgroundColor, opacity: getComputedStyle(el).opacity, image: getComputedStyle(el).backgroundImage }))), contentType: 'application/json' })
    await page.screenshot({ path: info.outputPath(`compare-${width}-${theme}.png`), fullPage: true, animations: 'disabled' })
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
  })
}

test('CMP03 changed spell cost groups hide heuristic deltas but preserve common-spell comparison', async ({ page }) => {
  await start(page)
  await calculate(page, '20 Mountain\n39 Lightning Bolt\n1 Counterspell')
  const comparison = dialog(page).getByRole('region', { name: 'Saved build comparison' })
  await expect(comparison).toContainText('The spell costs change the question used by Health Score.')
  await expect(comparison.getByText('Health Score', { exact: true }).locator('..').locator('.MuiChip-root').filter({ hasText: /points/ })).toHaveCount(0)
  await expect(comparison.getByText('Consistency', { exact: true }).locator('..').locator('.MuiChip-root')).toHaveCount(0)
  await expect(comparison.getByTestId('comparison-spell')).toContainText(/Lightning Bolt.*-\d+\.\d+ points/)
})

test('CMP dark dialog headings retain readable contrast', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('manatuner-theme', 'dark'))
  await start(page)
  const findings = await dialog(page).evaluate(el => {
    const rgb = color => color.match(/[\d.]+/g).slice(0, 3).map(Number)
    const lum = color => rgb(color).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
    const background = getComputedStyle(el).backgroundColor
    return [...el.querySelectorAll('h2, h3')].map(heading => {
      const style = getComputedStyle(heading)
      const a = lum(style.color), b = lum(background)
      return { text: heading.textContent, color: style.color, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), threshold: parseFloat(style.fontSize) >= 24 || parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700 ? 3 : 4.5 }
    })
  })
  await info.attach('heading-contrast', { body: JSON.stringify(findings, null, 2), contentType: 'application/json' })
  console.log(JSON.stringify(findings))
  for (const finding of findings) expect(finding.ratio, finding.text).toBeGreaterThanOrEqual(finding.threshold)
})
