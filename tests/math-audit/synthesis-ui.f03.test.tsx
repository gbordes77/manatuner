import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
afterEach(cleanup)
const renderToStaticMarkup = (element: ReactElement) => render(<MemoryRouter>{element}</MemoryRouter>).container.innerHTML
import { QuickVerdict } from '../../src/components/analyzer/QuickVerdict'
import { KarstenTargetDelta } from '../../src/components/analyzer/KarstenTargetDelta'
import EnhancedRecommendations from '../../src/components/EnhancedRecommendations'
import EnhancedCharts from '../../src/components/EnhancedCharts'
import { calculateStabilityScore } from '../../src/components/export/manaStability'
import type { AnalysisResult } from '../../src/services/deckAnalyzer'
const analysis = {
  totalCards: 60,
  totalLands: 24,
  landRatio: 0.4,
  consistency: 0,
  consistencyUnavailable: true,
  recommendations: [],
  cards: [{ name: 'Phyrexian demand', manaCost: '{G/P}', quantity: 36, cmc: 1, isLand: false }],
  colorDistribution: { G: 24 },
} as unknown as AnalysisResult

describe('F03 consumed score limitations', () => {
  it('renders unavailable in verdict and an explicit unsupported target', () => {
    const verdict = renderToStaticMarkup(
      <QuickVerdict analysisResult={analysis} manabaseVerdict={null} />
    )
    expect(verdict).toContain('Health Score unavailable')
    expect(verdict).not.toContain('Health Score 0%')
    const target = renderToStaticMarkup(
      <KarstenTargetDelta analysisResult={analysis} isMobile={false} />
    )
    expect(target).toContain('per-color target unavailable')
    expect(target).not.toContain('sources short')
  })
  it('keeps unsupported recommendations and blueprint index unavailable', () => {
    const recommendations = renderToStaticMarkup(
      <EnhancedRecommendations
        recommendations={[]}
        analysis={{
          consistency: 0,
          consistencyUnavailable: true,
          atRiskSpells: null,
          landRatio: 0.4,
          avgCMC: 1,
        }}
      />
    )
    expect(recommendations).toContain('Unavailable')
    expect(calculateStabilityScore(analysis)).toBeNull()
  })
  it('charts never substitutes a hardcoded good score for zero or unavailable', () => {
    const markup = renderToStaticMarkup(
      <EnhancedCharts
        analysis={{ totalCards: 60, totalLands: 24, overallScore: 0, consistency: 0 } as any}
        consistencyUnavailable
      />
    )
    expect(markup).toContain('Unavailable')
    expect(markup).not.toContain('75%')
  })
})

it('F04 main manabase omits sideboard land and spell identity', async () => {
  const { ManabaseTab } = await import('../../src/components/analyzer/ManabaseTab')
  const main = {
    ...analysis,
    consistencyUnavailable: false,
    cards: [
      {
        name: 'Forest',
        quantity: 24,
        isLand: true,
        manaCost: '',
        cmc: 0,
        colors: [],
        producedMana: ['G'],
      },
      { name: 'Green Spell', quantity: 36, isLand: false, manaCost: '{G}', cmc: 1, colors: ['G'] },
      {
        name: 'Island',
        quantity: 1,
        isLand: true,
        manaCost: '',
        cmc: 0,
        colors: [],
        producedMana: ['U'],
        isSideboard: true,
      },
      {
        name: 'Blue Spell',
        quantity: 1,
        isLand: false,
        manaCost: '{U}',
        cmc: 1,
        colors: ['U'],
        isSideboard: true,
      },
    ],
  } as unknown as AnalysisResult
  const markup = renderToStaticMarkup(
    <ManabaseTab analysisResult={main} isMobile={false} isSmallMobile={false} />
  )
  expect(markup).toContain('Forest')
  expect(markup).not.toContain('Island')
  expect(markup).not.toContain('Blue Spell')
})
