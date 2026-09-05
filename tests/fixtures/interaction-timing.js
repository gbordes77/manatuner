// Time the application from the real click event to painted destination content.
// Playwright actionability waits, transport and assertion polling are not app latency.
export async function measureClickToContent(page, target, contentSelector) {
  await target.evaluate((element, selector) => {
    window.__auditInteraction = new Promise(resolve => {
      element.addEventListener('click', () => {
        const start = performance.now()
        const check = () => {
          const content = document.querySelector(selector)
          if (content && content.getClientRects().length && getComputedStyle(content).visibility !== 'hidden') {
            // Two frames allow the ready content to be painted before recording.
            requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - start)))
          } else if (performance.now() - start >= 10000) resolve(Infinity)
          else requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
      }, { once: true, capture: true })
    })
  }, contentSelector)
  await target.click()
  return page.evaluate(() => window.__auditInteraction)
}
