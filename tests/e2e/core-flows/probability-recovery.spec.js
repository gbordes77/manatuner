import { test, expect } from '@playwright/test'
import cards from '../../fixtures/probability-recovery/limited.json' with { type: 'json' }

test('Selesnya Limited: numeric estimates, play/draw, ramp and explicit exact-mode refusal', async ({
  page,
}) => {
  await analyzeLimited(page)
  await expect(page.getByRole('button', { name: 'Mana estimates', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  const estimates = page.getByTestId('mana-estimate')
  await expect(estimates).toHaveCount(17)
  await expect(page.getByText('2 mana rocks/dorks detected', { exact: true })).toBeVisible()
  await expect(page.getByText('Calculation unavailable', { exact: true })).toHaveCount(0)
  // T1 white source-count oracle: 1 - C(30,7)/C(40,7) = 89.085...
  const pathRow = page
    .locator('.MuiPaper-root')
    .filter({ has: page.getByText(/^1x Path to Exile/) })
    .last()
  await expect(pathRow.getByText('Mana availability estimate: 89%', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'On the draw', exact: true }).click()
  await expect(pathRow.getByText('Mana availability estimate: 92%', { exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: 'Count rocks & dorks' }).uncheck()
  await expect(pathRow.getByText(/Lands only: 92%/)).toBeVisible()
  await page.getByRole('checkbox', { name: 'Count rocks & dorks' }).check()
  await page.getByRole('button', { name: 'Exact goldfish potential', exact: true }).click()
  await expect(estimates).toHaveCount(0)
  await expect(
    page.getByText('Exact sequencing currently supports goldfish only (removal rate 0)', {
      exact: true,
    })
  ).toHaveCount(17)
  await page.getByRole('button', { name: 'Mana estimates', exact: true }).click()
  await expect(estimates).toHaveCount(17)
})

async function analyzeLimited(page, sideboard = false) {
  await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
  await page.route('https://api.scryfall.com/cards/**', async (route) => {
    const request = route.request()
    if (request.url().includes('/collection')) {
      const names = request.postDataJSON().identifiers.map((x) => x.name)
      return route.fulfill({
        json: { object: 'list', data: cards.filter((c) => names.includes(c.name)), not_found: [] },
      })
    }
    const url = new URL(request.url())
    const card = cards.find(
      (c) => c.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy'))
    )
    return route.fulfill({
      status: card ? 200 : 404,
      json: card || { object: 'error', details: 'Fixture absent' },
    })
  })
  await page.goto('/analyzer?sample=limited')
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(
    /1 Llanowar Elves[\s\S]*7 Forest/
  )
  if (sideboard) {
    const editor = page.getByPlaceholder(/paste your decklist/i)
    await editor.fill((await editor.inputValue()) + '\n\nSideboard\n1 Plains')
  }
  await page.getByRole('button', { name: 'Analyze Manabase' }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
}

test('Review: result tabs, JSON export, local history and loading another saved deck', async ({
  page,
}) => {
  await analyzeLimited(page)
  for (const tab of ['analysis', 'mulligan', 'manabase', 'blueprint']) {
    await page.getByTestId(`tab-${tab}`).click()
    await expect(page.getByTestId(`tab-${tab}`)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/Something went wrong|DataCloneError/)).toHaveCount(0)
  }
  await page.getByRole('button', { name: 'Export Blueprint' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('menuitem', { name: 'JSON (Backup)', exact: true }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  let body = ''
  for await (const chunk of stream) body += chunk
  const exported = JSON.parse(body)
  expect(exported.analysis.totalCards).toBe(40)
  expect(exported.analysis.totalLands).toBe(17)
  expect(exported.analysis.spellAnalysisModel).toBe('physical-v1')
  await page.evaluate(() => {
    const records = JSON.parse(localStorage.getItem('manatuner_analyses'))
    if (records[0].analysis.totalCards !== 40) throw new Error('Analysis was not saved')
    localStorage.setItem(
      'manatuner_analyses',
      JSON.stringify([
        ...records,
        {
          ...records[0],
          id: 'review-other-deck',
          deckName: 'Review other deck',
          deckList: '40 Forest',
        },
      ])
    )
  })
  // SPA navigation deliberately retains the current Redux result: loading must invalidate it.
  await page.getByRole('link', { name: 'My Analyses', exact: true }).first().click()
  const saved = page
    .locator('.MuiCard-root')
    .filter({ has: page.getByText('Review other deck', { exact: true }) })
  await saved.getByRole('button', { name: /Load/ }).click()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toBeVisible()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue('40 Forest')
  await expect(page.getByTestId('analysis-results')).toHaveCount(0)
  await page.getByRole('button', { name: 'Analyze Manabase' }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
})

test('Post-board estimates use the incoming land and restore main-deck sources', async ({
  page,
}) => {
  await analyzeLimited(page, true)
  const pathRow = page
    .locator('.MuiPaper-root')
    .filter({ has: page.getByText(/^1x Path to Exile/) })
    .last()
  await expect(pathRow.getByText('Mana availability estimate: 89%', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Post-board', exact: true }).click()
  await page.getByText('Post-Board Analysis', { exact: true }).click()
  await expect(
    page.locator('.MuiCollapse-entered').filter({
      has: page.getByRole('button', { name: 'Increase maindeck Oath of Nissa', exact: true }),
    })
  ).toHaveCount(1)
  await page.getByRole('button', { name: 'Increase sideboard Plains', exact: true }).click()
  const removeOath = page.getByRole('button', {
    name: 'Increase maindeck Oath of Nissa',
    exact: true,
  })
  await removeOath.scrollIntoViewIfNeeded()
  await expect(removeOath).toBeInViewport({ ratio: 1 })
  await removeOath.click()
  await expect(page.getByText('Balanced: 1 in / 1 out', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Apply/ }).click()
  // Independent source-count marginal: 1 - C(29,7)/C(40,7).
  await expect(pathRow.getByText('Mana availability estimate: 92%', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Main only', exact: true }).click()
  await expect(pathRow.getByText('Mana availability estimate: 89%', { exact: true })).toBeVisible()
})
