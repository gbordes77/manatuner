/**
 * T01 — DeckInputSection debounce + flush-before-analyze non-regression.
 * @vitest-environment jsdom
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DECKLIST_PERSIST_DEBOUNCE_MS, DeckInputSection } from '../DeckInputSection'

function setup(overrides: Partial<React.ComponentProps<typeof DeckInputSection>> = {}) {
  const setDeckList = vi.fn()
  const setDeckName = vi.fn()
  const onAnalyze = vi.fn()
  const onClear = vi.fn()
  const onLoadSample = vi.fn()
  const setIsDeckMinimized = vi.fn()

  const props: React.ComponentProps<typeof DeckInputSection> = {
    deckList: '',
    deckName: '',
    setDeckList,
    setDeckName,
    isAnalyzing: false,
    analysisResult: null,
    isDeckMinimized: false,
    setIsDeckMinimized,
    onAnalyze,
    onClear,
    onLoadSample,
    isMobile: false,
    isSmallMobile: false,
    ...overrides,
  }

  render(<DeckInputSection {...props} />)
  return { setDeckList, onAnalyze, props }
}

describe('T01 DeckInputSection debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not dispatch setDeckList on every keystroke (debounced)', () => {
    const { setDeckList } = setup()
    const input = screen.getByLabelText(/Paste your decklist/i)

    fireEvent.change(input, { target: { value: '4 Lightning Bolt' } })
    expect(setDeckList).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(DECKLIST_PERSIST_DEBOUNCE_MS - 50)
    })
    expect(setDeckList).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(setDeckList).toHaveBeenCalledTimes(1)
    expect(setDeckList).toHaveBeenCalledWith('4 Lightning Bolt')
  })

  it('flushes local draft synchronously before onAnalyze', () => {
    const { setDeckList, onAnalyze } = setup()
    const input = screen.getByLabelText(/Paste your decklist/i)

    fireEvent.change(input, { target: { value: '20 Mountain\n4 Bolt' } })
    // Debounce not yet fired
    expect(setDeckList).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Analyze Manabase/i }))

    expect(setDeckList).toHaveBeenCalledWith('20 Mountain\n4 Bolt')
    expect(onAnalyze).toHaveBeenCalledWith('20 Mountain\n4 Bolt')
  })

  it('Analyze stays disabled while local draft is empty', () => {
    setup({ deckList: '' })
    const btn = screen.getByRole('button', { name: /Analyze Manabase/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})
