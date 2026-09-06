import { test, expect } from '../../fixtures/audit-browser.js'

const deck = '24 Mountain\n36 Lightning Bolt'

for (const [activation, width] of [
  ['Enter', 1440],
  ['Space', 768],
  ['pointer', 360],
  ['touch', 360],
]) {
  test.use({ hasTouch: true })
  test(`Edit Deck restores content and focus with ${activation} at ${width}px`, async ({
    page,
  }, testInfo) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/analyzer')
    const editor = page.getByRole('textbox', { name: /Paste your decklist/ })
    await editor.fill(deck)
    await page.getByRole('button', { name: 'Analyze Manabase', exact: true }).click()
    const edit = page.getByRole('button', { name: 'Edit Deck', exact: true })
    await expect(edit).toBeVisible({ timeout: 30000 })
    await expect(edit).toHaveAttribute('aria-expanded', 'false')
    const controlledId = await edit.getAttribute('aria-controls')
    await expect(page.locator(`[id="${controlledId}"]`)).toBeAttached()
    // Traverse the real document order rather than programmatically focusing Edit.
    await page.evaluate(() => document.activeElement?.blur())
    await page.keyboard.press('Control+Home')
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab')
      if (await edit.evaluate((element) => element === document.activeElement)) break
    }
    await expect(edit).toBeFocused()
    // The shared MUI theme animates outline width over 300 ms.
    await expect
      .poll(() =>
        edit.evaluate((element) => {
          const style = getComputedStyle(element)
          return style.outlineStyle === 'none' ? 0 : parseFloat(style.outlineWidth)
        })
      )
      .toBeGreaterThanOrEqual(2)
    await page.screenshot({ path: testInfo.outputPath('edit-focused.png') })
    await edit.evaluate((element) => {
      window.__editActivations = 0
      element.addEventListener('click', () => window.__editActivations++)
    })
    if (activation === 'touch') await edit.tap()
    else if (activation === 'pointer') await edit.click()
    else await page.keyboard.press(activation)
    await expect(editor).toBeVisible()
    await expect(editor).toBeFocused()
    await expect(editor).toHaveValue(deck)
    expect(await page.evaluate(() => window.__editActivations)).toBe(1)
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await editor.press('ControlOrMeta+A')
    await editor.press('ArrowRight')
    await editor.press('Enter')
    await editor.press('1')
    await expect(editor).toHaveValue(`${deck}\n1`)
    expect(errors).toEqual([])
  })
}
