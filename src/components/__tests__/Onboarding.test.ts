import { describe, expect, it } from 'vitest'
import { hasAnalyzerDeepLinkParams, isPrimaryAnalyzerCtaLabel, ONBOARDING_KEY } from '../Onboarding'

describe('Onboarding helpers (P0-UX-1)', () => {
  it('exports stable localStorage key', () => {
    expect(ONBOARDING_KEY).toBe('manatuner-onboarding-completed')
  })

  it('detects sample / format deep links', () => {
    expect(hasAnalyzerDeepLinkParams('?sample=edh')).toBe(true)
    expect(hasAnalyzerDeepLinkParams('?format=commander')).toBe(true)
    expect(hasAnalyzerDeepLinkParams('?sample=aggro&format=commander')).toBe(true)
    expect(hasAnalyzerDeepLinkParams('')).toBe(false)
    expect(hasAnalyzerDeepLinkParams('?tab=1')).toBe(false)
  })

  it('recognizes primary analyzer CTA labels', () => {
    expect(isPrimaryAnalyzerCtaLabel('Try Example')).toBe(true)
    expect(isPrimaryAnalyzerCtaLabel('  Try Example  ')).toBe(true)
    expect(isPrimaryAnalyzerCtaLabel('Analyze Manabase')).toBe(true)
    expect(isPrimaryAnalyzerCtaLabel('Analyzing...')).toBe(true)
    expect(isPrimaryAnalyzerCtaLabel('Skip tour')).toBe(false)
    expect(isPrimaryAnalyzerCtaLabel('Clear')).toBe(false)
    expect(isPrimaryAnalyzerCtaLabel('Next')).toBe(false)
  })
})
