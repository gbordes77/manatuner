// Measure the same DOM-readiness boundary as toBeVisible(), from the real click.
// Extra animation frames, runner polling and actionability waits are not included.
// This measures UI response, not a hardware first-paint or frame-rate guarantee.
export async function measureClickToContent(page, target, contentSelector) {
  await target.evaluate((element, selector) => {
    window.__auditInteraction = new Promise(resolve => {
      element.addEventListener('click', () => {
        const start = performance.now()
        let timeout
        const observer = new MutationObserver(check)
        function check() {
          const content = document.querySelector(selector)
          if (content && content.getClientRects().length && getComputedStyle(content).visibility !== 'hidden') {
            observer.disconnect()
            clearTimeout(timeout)
            resolve(performance.now() - start)
          }
        }
        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
        timeout = setTimeout(() => { observer.disconnect(); resolve(Infinity) }, 10000)
        // React may commit in a microtask after the native event. The observer
        // catches later commits, including lazy content; an already active tab
        // is a legitimate no-op and is checked after its event has run.
        queueMicrotask(check)
      }, { once: true, capture: true })
    })
  }, contentSelector)
  await target.click()
  return page.evaluate(() => window.__auditInteraction)
}
