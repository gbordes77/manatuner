import { test, expect } from '@playwright/test'

for (const deckList of ['24 Forest', '']) {
  test(`Legacy minimized deck recovers, analyzes and remains usable after reload (${deckList || 'empty'})`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ deckList }) => {
        localStorage.setItem('manatuner-onboarding-completed', 'true')
        if (!sessionStorage.getItem('recovery-seeded')) {
          localStorage.setItem(
            'persist:root',
            JSON.stringify({
              analyzer: JSON.stringify({
                deckList,
                deckName: 'Saved recovery deck',
                activeTab: 0,
                isDeckMinimized: true,
                analysisResult: null,
                isAnalyzing: false,
                snackbar: { open: false, message: '', severity: 'success' },
              }),
              _persist: JSON.stringify({ version: 2, rehydrated: true }),
            })
          )
          sessionStorage.setItem('recovery-seeded', 'true')
        }
      },
      { deckList }
    )
    const forest = {
      object: 'card',
      id: 'recovery-forest',
      name: 'Forest',
      type_line: 'Basic Land — Forest',
      mana_cost: '',
      cmc: 0,
      colors: [],
      color_identity: ['G'],
      set: 'test',
      rarity: 'common',
      layout: 'normal',
      oracle_text: '{T}: Add {G}.',
    }
    await page.route('https://api.scryfall.com/cards/**', (route) =>
      route.fulfill({
        json: route.request().url().includes('/collection')
          ? { object: 'list', data: [forest], not_found: [] }
          : forest,
      })
    )
    await page.goto('/analyzer')
    const editor = page.getByPlaceholder(/paste your decklist/i)
    await expect(editor).toBeVisible()
    await expect(editor).toHaveValue(deckList)
    await expect(page.getByPlaceholder(/e.g. Rakdos Midrange/)).toHaveValue('Saved recovery deck')
    await editor.fill('60 Forest')
    await page.getByRole('button', { name: 'Analyze Manabase' }).click()
    await expect(page.getByTestId('analysis-results')).toBeVisible()
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(JSON.parse(localStorage.getItem('persist:root')).analyzer).deckList
        )
      )
      .toBe('60 Forest')
    await page.reload()
    await expect(editor).toBeVisible()
    await expect(editor).toHaveValue('60 Forest')
    await expect(page.getByTestId('analysis-results')).toHaveCount(0)
    await page.getByRole('button', { name: 'Analyze Manabase' }).click()
    await expect(page.getByTestId('analysis-results')).toBeVisible()
  })
}
