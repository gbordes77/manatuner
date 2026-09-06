import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrivacyPage } from '../../src/components/layout/StaticPages'

vi.mock('../../src/components/common/SEO', () => ({ SEO: () => null }))
afterEach(() => { cleanup(); vi.unstubAllEnvs() })

describe('privacy information matches actual data flows', () => {
  it('identifies third parties, transmitted information and storage deletion limits', () => {
    vi.stubEnv('PROD', false)
    render(<PrivacyPage />)
    const text = document.body.textContent || ''
    for (const disclosure of ['api.scryfall.com', 'cards.scryfall.io', 'Google Fonts', 'jsDelivr', 'IP address', 'IndexedDB', '30 days', '7 days', 'exported files', 'shared links', 'best effort']) {
      expect(text).toContain(disclosure)
    }
    expect(text).not.toMatch(/never leave your device|don't collect, store, or transmit|no data.*transmit/i)
    expect(screen.getByText(/Error monitoring is disabled in this build/)).toBeTruthy()
  })
  it('discloses configured monitoring without claiming delivery when a production DSN exists', () => {
    vi.stubEnv('PROD', true)
    vi.stubEnv('VITE_SENTRY_DSN', 'https://public@example.invalid/1')
    render(<PrivacyPage />)
    expect(screen.getByText(/The Sentry SDK is configured in this build/)).toBeTruthy()
    expect(document.body.textContent).toContain('Before enabling Sentry')
    expect(document.body.textContent).toContain('Content Security Policy')
    expect(document.body.textContent).toContain('does not confirm that events are received')
  })
})
