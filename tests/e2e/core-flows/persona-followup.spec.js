import { test, expect } from '../../fixtures/audit-browser.js'
import sampleCards from '../../fixtures/scryfall-sample-audit.json' with { type: 'json' }
import { readFile } from 'node:fs/promises'
import AxeBuilder from '@axe-core/playwright'

// Same public simple-card fixture as input-contract-audit; no live dependency.
const basics = [
  {
    name: 'Plains',
    mana_cost: '',
    cmc: 0,
    type_line: 'Basic Land — Plains',
    oracle_text: '({T}: Add {W}.)',
    colors: [],
    color_identity: ['W'],
    produced_mana: ['W'],
    layout: 'normal',
  },
  {
    name: 'Savannah Lions',
    mana_cost: '{W}',
    cmc: 1,
    type_line: 'Creature — Cat',
    oracle_text: '',
    colors: ['W'],
    color_identity: ['W'],
    layout: 'normal',
  },
]
async function fixture(page, cards = basics) {
  await page.route('https://api.scryfall.com/**', async (route) => {
    const request = route.request()
    if (request.url().includes('/cards/collection')) {
      const names = request.postDataJSON().identifiers.map((c) => c.name.toLowerCase())
      await route.fulfill({
        json: { object: 'list', data: cards.filter((c) => names.includes(c.name.toLowerCase())) },
      })
    } else {
      const url = new URL(request.url())
      const card = cards.find(
        (c) => c.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy'))
      )
      if (card) await route.fulfill({ json: card })
      else await route.fallback()
    }
  })
}
async function analyze(page) {
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
}
const saved = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses')))

test('T04 home exact example starts supported and agrees with independent opening-hand oracle', async ({
  page,
}) => {
  await fixture(page)
  await page.goto('/')
  await page.locator('a[href="/analyzer?sample=exact"]').click()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(
    '24 Plains\n36 Savannah Lions'
  )
  await analyze(page)
  await expect(
    page.getByRole('button', { name: 'Exact goldfish potential', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  const oracle =
    1 - Array.from({ length: 7 }, (_, i) => (36 - i) / (60 - i)).reduce((a, b) => a * b, 1)
  expect((await saved(page))[0].analysis.probabilities.turn1.anyColor).toBeCloseTo(oracle, 12)
  await expect(page.getByText('Potential castability: 98%', { exact: true })).toBeVisible()
})

test('T07 JSON and CSV retain deck identity, totals, engine and score definitions', async ({
  page,
}, testInfo) => {
  await fixture(page)
  await page.goto('/analyzer?sample=exact')
  await page.getByLabel('Deck Name (optional)').fill('Persona, "White"')
  await analyze(page)
  await page.getByTestId('tab-blueprint').click()
  const bodies = {}
  for (const [kind, label] of [
    ['json', 'JSON (Backup)'],
    ['csv', 'CSV (Sheets / Pandas)'],
  ]) {
    await page.getByRole('button', { name: 'Export Blueprint', exact: true }).click()
    const pending = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: label, exact: true }).click()
    const download = await pending
    const path = testInfo.outputPath(`persona.${kind}`)
    await download.saveAs(path)
    bodies[kind] = await readFile(path, 'utf8')
  }
  const data = JSON.parse(bodies.json)
  expect(data.deckName).toBe('Persona, "White"')
  expect(data.engineVersion).toMatch(/\d+\.\d+\.\d+/)
  expect(data.analysis.totalCards).toBe(60)
  expect(data.analysis.totalLands).toBe(24)
  expect(Object.keys(data.scoreDefinitions)).toEqual(
    expect.arrayContaining(['health', 'blueprint', 'mulligan', 'limitation'])
  )
  expect(data.assumptions.playDraw).toBe('PLAY')
  expect(bodies.csv).toContain('# Deck: "Persona, ""White"""')
  expect(bodies.csv).toContain(`# Engine: ${data.engineVersion}`)
  expect(bodies.csv).toContain('deck,Plains,24,')
  expect(bodies.csv).toContain('deck,Savannah Lions,36,')
  for (const key of Object.keys(data.scoreDefinitions)) expect(bodies.csv).toContain(`# ${key}:`)
})

test('T07 real clipboard share opens in a separate clean browser context', async ({
  page,
  browser,
}, testInfo) => {
  await fixture(page)
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/analyzer?sample=exact')
  await analyze(page)
  await page.getByTestId('tab-manabase').click()
  await page
    .getByRole('button', { name: 'Copy shareable link to this manabase analysis', exact: true })
    .click()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(new URL(url).hash).toMatch(/^#d=/)
  expect(new URL(url).search).toBe('')
  await testInfo.attach('share-url', { body: url, contentType: 'text/plain' })
  const other = await browser.newContext()
  try {
    const second = await other.newPage()
    await second.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
    await fixture(second)
    await second.goto(url)
    await expect(second.getByPlaceholder(/paste your decklist/i)).toHaveValue(
      '24 Plains\n36 Savannah Lions'
    )
    expect(await second.evaluate(() => localStorage.getItem('manatuner_analyses'))).toBeNull()
    await second.reload()
    await analyze(second)
    expect((await saved(second))[0].analysis.totalLands).toBe(24)
  } finally {
    await other.close()
  }
})

for (const width of [360, 390, 768, 1440]) {
  test(`T08 exact example keyboard and viewport ${width} in light and dark themes`, async ({
    page,
  }, testInfo) => {
    await fixture(page)
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/analyzer?sample=exact')
    await analyze(page)
    await page.getByTestId('tab-manabase').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('tab', { name: 'Full Deck List', exact: true })).toBeVisible()
    for (const colorScheme of ['light', 'dark']) {
      await page.evaluate((theme) => localStorage.setItem('manatuner-theme', theme), colorScheme)
      await page.reload()
      await analyze(page)
      await page.getByTestId('tab-manabase').click()
      expect(await page.evaluate(() => localStorage.getItem('manatuner-theme'))).toBe(colorScheme)
      expect(
        await page.evaluate(() => ({
          width: innerWidth,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }))
      ).toEqual({ width, overflow: false })
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => {}))
        )
      })
      const resultContrast = await new AxeBuilder({ page })
        .include('#quick-verdict')
        .include('[data-testid="analysis-results"] > .MuiTypography-root')
        .withRules(['color-contrast'])
        .analyze()
      await testInfo.attach(`${width}-${colorScheme}-result-contrast`, {
        body: JSON.stringify(resultContrast),
        contentType: 'application/json',
      })
      expect(resultContrast.violations, JSON.stringify(resultContrast.violations, null, 2)).toEqual(
        []
      )
      await page.screenshot({
        path: testInfo.outputPath(`${width}-${colorScheme}.png`),
        fullPage: true,
      })
      const edit = page.getByRole('button', { name: 'Edit Deck', exact: true })
      if (await edit.isVisible()) await edit.click()
      await expect(page.getByLabel('Deck Name (optional)')).toBeVisible()
      const deckContrast = await new AxeBuilder({ page })
        .include('#deck-editor')
        .withRules(['color-contrast'])
        .analyze()
      await testInfo.attach(`${width}-${colorScheme}-deck-contrast`, {
        body: JSON.stringify(deckContrast),
        contentType: 'application/json',
      })
      expect(deckContrast.violations, JSON.stringify(deckContrast.violations, null, 2)).toEqual([])
    }
  })
}

test('T03 real midrange persists explicit unsupported reasons across reload', async ({ page }) => {
  await fixture(page, sampleCards)
  await page.goto('/analyzer')
  await page.getByRole('button', { name: 'Try Example', exact: true }).click()
  await analyze(page)
  const before = (await saved(page))[0]
  expect(before.analysis.totalCards).toBe(60)
  await expect(page.getByTestId('priority-source-deficit')).toContainText('Karsten target')
  await page.getByText('Why the three scores differ', { exact: true }).click()
  await expect(page.getByTestId('quick-verdict')).toContainText('Blueprint')
  await expect(page.getByTestId('quick-verdict')).toContainText('Mulligan')
  await page.getByRole('button', { name: 'Review mana sources', exact: true }).click()
  await expect(page.getByTestId('tab-manabase')).toHaveAttribute('aria-selected', 'true')
  expect(Object.keys(before.analysis.unsupportedSpellAnalysis).length).toBeGreaterThan(0)
  expect(Object.values(before.analysis.unsupportedSpellAnalysis).join(' ')).toMatch(
    /Abandoned Air Temple|unsupported|not modeled|not supported/i
  )
  await page.reload()
  expect((await saved(page))[0]).toEqual(before)
})

test('T03 compatible 24 and 20 Plains builds compare actual saved probabilities', async ({
  page,
  browser,
}) => {
  const records = []
  for (const lands of [24, 20]) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL })
    try {
      const build = await context.newPage()
      await build.addInitScript(() =>
        localStorage.setItem('manatuner-onboarding-completed', 'true')
      )
      await fixture(build)
      await build.goto('/analyzer?sample=exact')
      await build.getByLabel('Deck Name (optional)').fill(`White ${lands}`)
      await build
        .getByPlaceholder(/paste your decklist/i)
        .fill(`${lands} Plains\n${60 - lands} Savannah Lions`)
      await analyze(build)
      records.push((await saved(build))[0])
    } finally {
      await context.close()
    }
  }
  expect(records[0].analysis.spellAnalysis['Savannah Lions'].percentage).toBeGreaterThan(
    records[1].analysis.spellAnalysis['Savannah Lions'].percentage
  )
  await page.goto('/my-analyses')
  await page.evaluate(
    (records) => localStorage.setItem('manatuner_analyses', JSON.stringify(records)),
    records
  )
  await page.reload()
  await page.getByRole('button', { name: 'Compare', exact: true }).click()
  for (const name of ['White 24', 'White 20']) await page.getByText(name, { exact: true }).click()
  await page.getByRole('button', { name: 'Compare Selected (2/2)', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Savannah Lions (1 CMC)', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Unavailable', { exact: true })).toHaveCount(0)
  const spell = dialog.getByTestId('comparison-spell')
  for (const record of records) {
    await expect(spell).toContainText(
      `${record.analysis.spellAnalysis['Savannah Lions'].percentage.toFixed(1)}%`
    )
  }
  expect(await spell.innerText()).not.toMatch(/\d+\.\d{2,}%/)
})

test('T05 multiplayer control exposes the free redraw contract and toggles without simulation', async ({
  page,
}) => {
  await fixture(page)
  await page.goto('/analyzer?sample=exact')
  await analyze(page)
  await page.getByTestId('tab-mulligan').click()
  await expect(page.getByText(/In multiplayer mode the first mulligan is free/)).toBeVisible()
  const multiplayer = page.getByRole('checkbox', {
    name: 'Multiplayer: free first mulligan and turn-one draw',
  })
  await expect(multiplayer).not.toBeChecked()
  await multiplayer.check()
  await expect(multiplayer).toBeChecked()
  await multiplayer.uncheck()
  await expect(multiplayer).not.toBeChecked()
})

test('T04/T07 public Atraxa example keeps 99 plus commander, four colors, EDH horizon and CSV zones', async ({
  page,
}, testInfo) => {
  const proof = `${process.cwd()}/tests/fixtures/`
  const cards = JSON.parse(await readFile(`${proof}scryfall-persona-edh.json`, 'utf8'))
  const deck = await readFile(`${proof}persona-edh-deck.txt`, 'utf8')
  await fixture(page, [...cards, ...basics])
  await page.goto('/analyzer')
  await page.getByLabel('Deck Name (optional)').fill('Public Atraxa zone validation')
  await page.getByPlaceholder(/paste your decklist/i).fill(`${deck}\n\nSideboard\n1 Savannah Lions`)
  await analyze(page)
  const analysis = (await saved(page))[0].analysis
  expect(analysis.totalCards).toBe(99)
  const commander = analysis.cards.find((c) => c.isCommander)
  expect(commander.name).toBe("Atraxa, Praetors' Voice")
  expect([...commander.colors].sort()).toEqual(['B', 'G', 'U', 'W'])
  await expect(page.getByText(/EDH: priority horizon T4–T8/)).toBeVisible()
  await page.getByTestId('tab-blueprint').click()
  await expect(page.getByTestId('blueprint-deck-zones')).toContainText('Library: 99 + commander: 1')
  for (const [kind, label] of [
    ['csv', 'CSV (Sheets / Pandas)'],
    ['json', 'JSON (Backup)'],
  ]) {
    await page.getByRole('button', { name: 'Export Blueprint', exact: true }).click()
    const pending = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: label, exact: true }).click()
    const path = testInfo.outputPath(`atraxa.${kind}`)
    await (await pending).saveAs(path)
    const body = await readFile(path, 'utf8')
    if (kind === 'csv') {
      expect(body).toContain('is_sideboard,is_commander')
      expect(body.split('\n').find((line) => line.startsWith('deck,"Atraxa,'))).toMatch(
        /,false,true\r?$/
      )
      expect(body.split('\n').find((line) => line.startsWith('deck,Savannah Lions,'))).toMatch(
        /,true,false\r?$/
      )
    } else {
      const json = JSON.parse(body)
      expect(json.analysis.cards.find((c) => c.isCommander).name).toBe(commander.name)
      expect(json.analysis.cards.find((c) => c.isSideboard).name).toBe('Savannah Lions')
      expect(json.analysis.totalCards).toBe(99)
    }
  }
  await page.screenshot({ path: testInfo.outputPath('atraxa-blueprint.png'), fullPage: true })
})

test('T05 real 3k worker distinguishes free and paid mulligan results and guidance', async ({
  page,
}, testInfo) => {
  await fixture(page)
  await page.goto('/analyzer?sample=exact')
  await analyze(page)
  await page.getByTestId('tab-mulligan').click()
  await page.getByText('Quick (3k)', { exact: true }).click()
  const multiplayer = page.getByRole('checkbox', {
    name: 'Multiplayer: free first mulligan and turn-one draw',
  })
  await multiplayer.check()
  await expect(page.getByText(/Based on 3,000 samples per hand size/)).toBeVisible()
  const help = page.getByRole('button', { name: 'How to use this analysis', exact: true })
  await expect(help).toBeVisible()
  if ((await help.getAttribute('aria-expanded')) === 'false') await help.click()
  await expect(
    page.getByText(/Before the free mulligan, the first redraw still keeps seven cards/)
  ).toBeVisible()
  await expect(page.getByText(/After the free mulligan, keep-seven threshold: \d+/)).toBeVisible()
  await expect(
    page.getByText('(After the free redraw and one paid mulligan)', { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText('(After the free redraw and two paid mulligans)', { exact: true })
  ).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('multiplayer-3k.png'), fullPage: true })
  await multiplayer.uncheck()
  await expect(page.getByText(/Based on 3,000 samples per hand size/)).toBeVisible()
  await expect(
    page.getByText(/A paid mulligan draws seven again; keep six after bottoming one card/)
  ).toBeVisible()
  await expect(page.getByText('(After one paid mulligan)', { exact: true })).toBeVisible()
  await expect(
    page.getByText('(After the free redraw and one paid mulligan)', { exact: true })
  ).toHaveCount(0)
  await expect(page.getByText(/After the free mulligan, keep-seven threshold:/)).toHaveCount(0)
  await page.screenshot({ path: testInfo.outputPath('duel-3k.png'), fullPage: true })
})

async function compareRecords(page, records) {
  await page.goto('/my-analyses')
  await page.evaluate(
    (records) => localStorage.setItem('manatuner_analyses', JSON.stringify(records)),
    records
  )
  await page.reload()
  await page.getByRole('button', { name: 'Compare', exact: true }).click()
  for (const record of records) await page.getByText(record.deckName, { exact: true }).click()
  await page.getByRole('button', { name: 'Compare Selected (2/2)', exact: true }).click()
  return page.getByRole('dialog')
}

test('R03 identical saved builds show equality without an unavailable result', async ({ page }) => {
  await fixture(page)
  await page.goto('/analyzer?sample=exact')
  await analyze(page)
  const original = (await saved(page))[0]
  const records = [original, structuredClone(original)]
  records.forEach((r, index) => {
    r.id = `identical-${index}`
    r.deckName = `Identical ${index}`
  })
  const dialog = await compareRecords(page, records)
  const row = dialog.getByTestId('comparison-spell')
  await expect(row.getByText('=', { exact: true })).toBeVisible()
  await expect(row).not.toContainText('Unavailable')
})

test('R03 unsupported midrange groups shared reasons and keeps spell details accessible', async ({
  page,
}) => {
  await fixture(page, sampleCards)
  await page.goto('/analyzer')
  await page.getByRole('button', { name: 'Try Example', exact: true }).click()
  await analyze(page)
  const original = (await saved(page))[0]
  const records = [original, structuredClone(original)]
  records.forEach((r, index) => {
    r.id = `midrange-${index}`
    r.deckName = `Midrange ${index}`
  })
  const dialog = await compareRecords(page, records)
  const reasons = dialog.getByTestId('comparison-unavailable-reasons')
  await expect(reasons).toBeVisible()
  const distinctReasons = new Set(Object.values(original.analysis.unsupportedSpellAnalysis))
  await expect(reasons.locator('details')).toHaveCount(distinctReasons.size)
  await expect(dialog).toContainText(/A: 0\/\d+ calculated\. B: 0\/\d+ calculated/)
  const rows = dialog.getByTestId('comparison-spell')
  expect(await rows.count()).toBeGreaterThan(1)
  await expect(rows.first()).toContainText('Unavailable')
  await expect(rows.first()).not.toContainText(
    'This result is unavailable under the saved lands-only model'
  )
  const detail = reasons.locator('summary').first()
  await detail.focus()
  await page.keyboard.press('Enter')
  await expect(reasons.locator('details').first()).toHaveAttribute('open', '')
  await expect(reasons).toContainText('A')
  await expect(dialog.locator('a[href="/analyzer?sample=exact"]')).toBeVisible()
})

test('R03/R05 synthetic snapshot boundary keeps zero distinct from unavailable', async ({
  page,
}) => {
  await fixture(page)
  await page.goto('/analyzer?sample=exact')
  await analyze(page)
  const original = (await saved(page))[0]
  // Display boundary only: these injected snapshots are not engine probability evidence.
  const records = [original, structuredClone(original)]
  records.forEach((r, index) => {
    r.id = `boundary-${index}`
    r.deckName = `Boundary ${index}`
  })
  records[0].analysis.spellAnalysis['Savannah Lions'].percentage = 0
  delete records[1].analysis.spellAnalysis['Savannah Lions']
  records[1].analysis.unsupportedSpellAnalysis = {
    'Savannah Lions': 'Synthetic missing result for display boundary',
  }
  const dialog = await compareRecords(page, records)
  const row = dialog.getByTestId('comparison-spell')
  await expect(row.getByText('0%', { exact: true })).toHaveCount(1)
  await expect(row.getByText('Unavailable', { exact: true })).toHaveCount(1)
  await expect(row.getByText('=', { exact: true })).toHaveCount(0)
  await expect(dialog).toContainText('A: 1/1 calculated. B: 0/1 calculated.')
  await expect(dialog.getByTestId('comparison-unavailable-reasons')).toContainText(
    'Synthetic missing result for display boundary'
  )
})

for (const width of [390, 1440]) {
  for (const route of ['/mathematics', '/guide', '/library', '/my-analyses']) {
    test(`R01–R07 ${route} keyboard, contrast, themes and viewport ${width}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      for (const colorScheme of ['light', 'dark']) {
        await page.goto('/')
        await page.evaluate((theme) => localStorage.setItem('manatuner-theme', theme), colorScheme)
        await page.goto(route)
        await expect(page.getByRole('main')).toBeVisible()
        expect(
          await page.evaluate(() => ({
            width: innerWidth,
            overflow: document.documentElement.scrollWidth > innerWidth,
          }))
        ).toEqual({ width, overflow: false })
        expect(await page.evaluate(() => localStorage.getItem('manatuner-theme'))).toBe(colorScheme)
        if (colorScheme === 'dark') {
          // Axe cannot resolve contrast against every CSS background image.
          // Verify the actual body paint behind transparent page surfaces as well.
          const background = await page.evaluate(() => {
            const style = getComputedStyle(document.body)
            const channels = style.backgroundColor.match(/[\d.]+/g)?.map(Number) || []
            const linear = channels.slice(0, 3).map((channel) => {
              const value = channel / 255
              return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
            })
            return {
              color: style.backgroundColor,
              image: style.backgroundImage,
              alpha: channels[3] ?? 1,
              luminance: linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722,
            }
          })
          await testInfo.attach(`${route.slice(1)}-${width}-dark-body-background`, {
            body: JSON.stringify(background),
            contentType: 'application/json',
          })
          expect(background.image).toBe('none')
          expect(background.alpha).toBe(1)
          expect(background.luminance).toBeLessThan(0.1)
        }
        await page.keyboard.press('Tab')
        const focus = page.locator(':focus')
        await expect(focus).toBeVisible()
        expect(
          await focus.evaluate(
            (element) =>
              ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(element.tagName) ||
              element.tabIndex >= 0
          )
        ).toBe(true)
        await page.evaluate(async () => {
          await document.fonts.ready
          await Promise.all(
            document
              .getAnimations()
              .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
              .map((animation) => animation.finished.catch(() => {}))
          )
        })
        await page.screenshot({
          path: testInfo.outputPath(`${route.slice(1)}-${width}-${colorScheme}.png`),
          fullPage: true,
        })
        const contrast = await new AxeBuilder({ page })
          .include('main')
          .withRules(['color-contrast'])
          .analyze()
        await testInfo.attach(`${route.slice(1)}-${width}-${colorScheme}-contrast`, {
          body: JSON.stringify(contrast),
          contentType: 'application/json',
        })
        expect(contrast.violations, JSON.stringify(contrast.violations, null, 2)).toEqual([])
      }
    })
  }
}
