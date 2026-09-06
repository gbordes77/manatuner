// Run from repository root: BASE_URL=http://127.0.0.1:3002 node docs/math/probability-recovery-2026-09-06/browser-review.cjs
const { chromium, webkit, expect } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const cards = require('../../../tests/fixtures/probability-recovery/limited.json')
const output = process.env.REVIEW_OUTPUT || '/tmp/manatuner-extra-review'
fs.mkdirSync(output, { recursive: true })
async function downloaded(page, action) {
  const event = page.waitForEvent('download')
  await action()
  const download = await event
  const stream = await download.createReadStream()
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  const bytes = Buffer.concat(chunks)
  fs.writeFileSync(path.join(output, download.suggestedFilename()), bytes)
  return bytes
}
;(async () => {
  const results = []
  for (const [name, type] of Object.entries({ chromium, webkit })) {
    const browser = await type.launch()
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
      await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
      await page.route('https://api.scryfall.com/cards/**', async (route) => {
        const request = route.request(),
          url = new URL(request.url())
        const card = cards.find(
          (c) => c.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy'))
        )
        const collection = url.pathname.endsWith('/collection')
        await route.fulfill({
          status: collection || card ? 200 : 404,
          json: collection
            ? {
                object: 'list',
                data: cards.filter((c) =>
                  request.postDataJSON().identifiers.some((x) => x.name === c.name)
                ),
                not_found: [],
              }
            : card || { object: 'error', details: 'Fixture absent' },
        })
      })
      const url = process.env.BASE_URL || 'http://127.0.0.1:3002'
      await page.goto(url + '/analyzer?sample=limited')
      await page.getByRole('button', { name: 'Analyze Manabase' }).click()
      await expect(page.getByTestId('mana-estimate')).toHaveCount(17)
      await page.screenshot({ path: path.join(output, name + '-estimates.png'), fullPage: true })
      await page.getByTestId('tab-blueprint').click()
      const exports = {}
      for (const [format, menu] of Object.entries({
        png: 'PNG (Social Media)',
        pdf: 'PDF (Documentation)',
        csv: 'CSV (Sheets / Pandas)',
      })) {
        await page.getByRole('button', { name: 'Export Blueprint' }).click()
        const bytes = await downloaded(page, () =>
          page.getByRole('menuitem', { name: menu, exact: true }).click()
        )
        if (format === 'png') assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
        if (format === 'pdf') assert.equal(bytes.subarray(0, 5).toString(), '%PDF-')
        if (format === 'csv') assert.match(bytes.toString(), /ManaTuner CSV export/)
        exports[format] = bytes.length
      }
      // Import the real saved record under a new identity in this isolated browser context.
      const backup = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('manatuner_analyses'))
      )
      assert.equal(backup[0].analysis.totalCards, 40)
      backup.push({ ...backup[0], id: 'review-import', deckName: 'Review imported deck' })
      const chooserEvent = page.waitForEvent('filechooser')
      await page.getByRole('button', { name: 'Import', exact: true }).click()
      await (
        await chooserEvent
      ).setFiles({
        name: 'review-backup.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(backup)),
      })
      await expect
        .poll(() =>
          page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses')).length)
        )
        .toBe(2)
      await page.goto(url + '/my-analyses')
      await expect(page.getByText('Review imported deck', { exact: true })).toBeVisible()
      const exported = await downloaded(page, () =>
        page
          .getByRole('button', { name: /Export/i })
          .first()
          .click()
      )
      assert.equal(JSON.parse(exported).length, 2)
      await page.getByRole('button', { name: 'Compare', exact: true }).click()
      await page.getByRole('checkbox').nth(0).click()
      await page.getByRole('checkbox').nth(1).click()
      await page.getByRole('button', { name: 'Compare Selected (2/2)', exact: true }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(
        page.getByRole('dialog').getByText('Review imported deck', { exact: true }).first()
      ).toBeVisible()
      await expect(page.getByText(/Something went wrong|DataCloneError/)).toHaveCount(0)
      results.push({
        browser: name,
        numericRows: 17,
        exports,
        importRecords: 2,
        backupRecords: 2,
        comparisonOpened: true,
      })
      fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2))
    } finally {
      await browser.close()
    }
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
