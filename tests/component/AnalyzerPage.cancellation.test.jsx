import React from 'react'
import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnalyzerPage from '../../src/pages/AnalyzerPage'
import { renderWithProviders } from '../test-utils'

const harness = vi.hoisted(() => ({
  analyze: vi.fn(),
  save: vi.fn(),
  suggest: vi.fn(),
  input: null,
}))
vi.mock('../../src/services/deckAnalyzer', () => ({
  DeckAnalyzer: { analyzeDeck: harness.analyze },
  AnalysisCancelledError: class AnalysisCancelledError extends Error {},
}))
vi.mock('../../src/lib/privacy', () => ({ PrivacyStorage: { saveAnalysis: harness.save } }))
vi.mock('../../src/contexts/accelerationState', async (importOriginal) => ({
  ...(await importOriginal()),
  useAcceleration: () => ({ suggestFromDeckSize: harness.suggest, unlockFormatAuto: vi.fn() }),
}))
vi.mock('../../src/components/analyzer/DeckInputSection', () => ({
  DeckInputSection: (props) => {
    harness.input = props
    return (
      <>
        <textarea
          aria-label="Deck"
          value={props.deckList}
          onChange={(e) => props.setDeckList(e.target.value)}
        />
        <button onClick={() => props.onAnalyze()}>Analyze</button>
        <button onClick={props.onClear}>Clear</button>
      </>
    )
  },
}))
vi.mock('../../src/components/analyzer/QuickVerdict', () => ({
  QuickVerdict: () => (
    <div id="quick-verdict" tabIndex={-1}>
      Verdict
    </div>
  ),
}))
vi.mock('../../src/components/analyzer/CastabilityTab', () => ({ CastabilityTab: () => null }))
vi.mock('../../src/components/Onboarding', () => ({ default: () => null }))
vi.mock('../../src/components/PrivacySettings', () => ({ default: () => null }))

const result = (totalCards) => ({
  totalCards,
  totalLands: 24,
  totalNonLands: totalCards - 24,
  cards: [],
  colorDistribution: {},
  consistency: 0.85,
  recommendations: [],
})
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const start = (list = '24 Plains\n36 Silvercoat Lion') => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Deck' }), { target: { value: list } })
  fireEvent.click(screen.getByRole('button', { name: 'Analyze' }))
}

// Deliberately ignore AbortSignal: UI ownership must hold even if transport cannot cancel.
describe('F05 analysis generation ownership', () => {
  let frames
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    frames = []
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      frames.push(callback)
      return frames.length
    })
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('Clear keeps editor, result, loading, format, notifications and history cleared after late success', async () => {
    const pending = deferred()
    harness.analyze.mockReturnValueOnce(pending.promise)
    const { store } = renderWithProviders(<AnalyzerPage />)
    start()
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    const framesBeforeResolution = frames.length
    await act(async () => pending.resolve(result(100)))
    const state = store.getState().analyzer
    expect(state.deckList).toBe('')
    expect(state.analysisResult).toBeNull()
    expect(state.isAnalyzing).toBe(false)
    expect(state.snackbar.message).toMatch(/^Interface cleared/)
    expect(harness.analyze.mock.calls[0][1].signal.aborted).toBe(true)
    expect(harness.save).not.toHaveBeenCalled()
    expect(harness.suggest).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('manatuner-commander-preset')).toBeNull()
    expect(frames).toHaveLength(framesBeforeResolution)
  })

  it('B finishing before A retains B and saves only B', async () => {
    const a = deferred(),
      b = deferred()
    harness.analyze.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise)
    const { store } = renderWithProviders(<AnalyzerPage />)
    start()
    act(() => {
      void harness.input.onAnalyze('40 Forest')
    })
    await act(async () => b.resolve(result(40)))
    await act(async () => a.resolve(result(100)))
    expect(store.getState().analyzer.analysisResult.totalCards).toBe(40)
    expect(harness.save).toHaveBeenCalledTimes(1)
    expect(harness.save.mock.calls[0][0].deckList).toBe('40 Forest')
    expect(harness.suggest.mock.calls).toEqual([[40]])
  })

  it.each(['resolve', 'reject'])(
    'obsolete %s cannot stop B loading or overwrite notifications',
    async (settle) => {
      const a = deferred(),
        b = deferred()
      harness.analyze.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise)
      const { store } = renderWithProviders(<AnalyzerPage />)
      start()
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      start('40 Forest')
      const snackbar = store.getState().analyzer.snackbar
      await act(async () =>
        a[settle](settle === 'resolve' ? result(100) : new Error('stale failure'))
      )
      expect(store.getState().analyzer.isAnalyzing).toBe(true)
      expect(store.getState().analyzer.snackbar).toEqual(snackbar)
      expect(harness.save).not.toHaveBeenCalled()
      await act(async () => b.resolve(result(40)))
      expect(store.getState().analyzer.isAnalyzing).toBe(false)
    }
  )

  it('unmount aborts pending work and remount with same store has no ghost result', async () => {
    const a = deferred()
    harness.analyze.mockReturnValueOnce(a.promise)
    const view = renderWithProviders(<AnalyzerPage />)
    start()
    view.unmount()
    renderWithProviders(<AnalyzerPage />, { store: view.store })
    await act(async () => a.resolve(result(100)))
    expect(harness.analyze.mock.calls[0][1].signal.aborted).toBe(true)
    expect(view.store.getState().analyzer.analysisResult).toBeNull()
    expect(view.store.getState().analyzer.isAnalyzing).toBe(false)
    expect(harness.save).not.toHaveBeenCalled()
    expect(harness.suggest).not.toHaveBeenCalled()
  })

  it('a queued verdict focus cannot run after Clear', async () => {
    harness.analyze.mockResolvedValueOnce(result(60))
    const { store } = renderWithProviders(<AnalyzerPage />)
    start()
    await act(async () => {})
    expect(harness.save).toHaveBeenCalledTimes(1)
    expect(store.getState().analyzer.analysisResult.totalCards).toBe(60)
    expect(frames.length).toBeGreaterThan(0)
    // Use the last input callbacks even if the compact deck bar hides the editor.
    act(() => harness.input.onClear())
    const target = document.createElement('div')
    target.id = 'quick-verdict'
    target.focus = vi.fn()
    target.scrollIntoView = vi.fn()
    document.body.append(target)
    frames.forEach((callback) => callback())
    expect(target.focus).not.toHaveBeenCalled()
    expect(target.scrollIntoView).not.toHaveBeenCalled()
    target.remove()
  })
})
