import { beforeEach, describe, expect, it } from 'vitest'
import { PrivacyStorage } from '../privacy'

describe('PrivacyStorage.clearAllLocalData (SEC-2026-08-02)', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('removes analyses, redux persist, caches, and prefs', () => {
    localStorage.setItem('manatuner_analyses', '[]')
    localStorage.setItem('manatuner-analyses', '[]')
    localStorage.setItem('persist:root', '{"analyzer":{}}')
    localStorage.setItem('manatuner_lands_cache', '{}')
    localStorage.setItem('manatuner_producer_cache', '{}')
    localStorage.setItem('manatuner_acceleration_settings', '{}')
    localStorage.setItem('manatuner-library-progress-v1', '{}')
    localStorage.setItem('manatuner-theme', 'dark')
    localStorage.setItem('manatuner-onboarding-completed', 'true')
    localStorage.setItem('manatuner-feedback-banner-dismissed-v1', '1')
    sessionStorage.setItem('manatuner-commander-preset', '1')
    sessionStorage.setItem('mt-sw-cleared', '1')

    PrivacyStorage.clearAllLocalData()

    // jsdom / some mocks return null; others undefined — both mean "gone"
    const gone = (v: string | null) => expect(v == null).toBe(true)
    gone(localStorage.getItem('manatuner_analyses'))
    gone(localStorage.getItem('manatuner-analyses'))
    gone(localStorage.getItem('persist:root'))
    gone(localStorage.getItem('manatuner_lands_cache'))
    gone(localStorage.getItem('manatuner_producer_cache'))
    gone(localStorage.getItem('manatuner_acceleration_settings'))
    gone(localStorage.getItem('manatuner-library-progress-v1'))
    gone(localStorage.getItem('manatuner-theme'))
    gone(localStorage.getItem('manatuner-onboarding-completed'))
    gone(sessionStorage.getItem('manatuner-commander-preset'))
    gone(sessionStorage.getItem('mt-sw-cleared'))
  })

  it('also sweeps unexpected manatuner* keys', () => {
    localStorage.setItem('manatuner-future-feature', 'x')
    PrivacyStorage.clearAllLocalData()
    expect(localStorage.getItem('manatuner-future-feature') == null).toBe(true)
  })
})
