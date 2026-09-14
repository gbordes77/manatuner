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

  const view = render(<DeckInputSection {...props} />)
  return { setDeckList, onAnalyze, props, ...view }
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

describe('external clear invalidates pending draft persistence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it.each(['24 Mountain', ''])(
    'does not restore a pending draft after Clear (parent %j) and persists subsequent typing',
    (initialDeck) => {
      const setDeckList = vi.fn()
      function Harness() {
        const [deckList, setParentDeckList] = React.useState(initialDeck)
        return (
          <DeckInputSection
            deckList={deckList}
            deckName=""
            setDeckName={vi.fn()}
            setDeckList={(value) => {
              setDeckList(value)
              setParentDeckList(value)
            }}
            isAnalyzing={true}
            analysisResult={null}
            isDeckMinimized={false}
            setIsDeckMinimized={vi.fn()}
            onAnalyze={vi.fn()}
            onClear={() => setParentDeckList('')}
            onLoadSample={vi.fn()}
            isMobile={false}
            isSmallMobile={false}
          />
        )
      }
      render(<Harness />)
      const input = screen.getByRole('textbox', {
        name: /Paste your decklist/i,
      }) as HTMLTextAreaElement
      fireEvent.change(input, { target: { value: '36 Lightning Bolt' } })
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(input.value).toBe('')
      act(() => vi.advanceTimersByTime(DECKLIST_PERSIST_DEBOUNCE_MS))
      expect(setDeckList).not.toHaveBeenCalled()
      expect(input.value).toBe('')
      fireEvent.change(input, { target: { value: '24 Forest' } })
      act(() => vi.advanceTimersByTime(DECKLIST_PERSIST_DEBOUNCE_MS))
      expect(setDeckList).toHaveBeenCalledExactlyOnceWith('24 Forest')
      expect(input.value).toBe('24 Forest')
    }
  )
})

describe('route departure preserves pending edits', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  it('flushes the latest Unicode and zone draft on immediate unmount without analyzing', () => {
    const { setDeckList, onAnalyze, unmount } = setup({
      deckList: '24 Mountain\n36 Lightning Bolt',
    })
    const draft = 'Deck\n25 Mountain\n35 Lightning Bolt\n\nSideboard\n1 Éclair 森 — incomplete'
    fireEvent.change(screen.getByLabelText(/Paste your decklist/i), { target: { value: draft } })
    unmount()
    expect(setDeckList).toHaveBeenCalledExactlyOnceWith(draft)
    expect(onAnalyze).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1000))
    expect(setDeckList).toHaveBeenCalledTimes(1)
  })
  it('uses the latest parent callback and only flushes once under StrictMode', () => {
    const { props, unmount: removeSetup } = setup()
    removeSetup()
    const initial = vi.fn(),
      latest = vi.fn()
    const { rerender, unmount } = render(
      <React.StrictMode>
        <DeckInputSection {...props} setDeckList={initial} />
      </React.StrictMode>
    )
    expect(initial).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText(/Paste your decklist/i), {
      target: { value: '25 Mountain' },
    })
    rerender(
      <React.StrictMode>
        <DeckInputSection {...props} setDeckList={latest} />
      </React.StrictMode>
    )
    expect(initial).not.toHaveBeenCalled()
    expect(latest).not.toHaveBeenCalled()
    unmount()
    expect(initial).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledExactlyOnceWith('25 Mountain')
  })
  it.each(['Clear', 'Try Example'])(
    'does not resurrect a pending draft when %s immediately navigates away',
    (button) => {
      const { props, unmount: removeSetup } = setup()
      removeSetup()
      const setDeckList = vi.fn()
      const callback = vi.fn(() => leave())
      const view = render(
        <DeckInputSection
          {...props}
          setDeckList={setDeckList}
          onClear={callback}
          onLoadSample={callback}
        />
      )
      const leave = view.unmount
      fireEvent.change(screen.getByLabelText(/Paste your decklist/i), {
        target: { value: 'OLD DRAFT' },
      })
      fireEvent.click(screen.getByRole('button', { name: button }))
      act(() => vi.advanceTimersByTime(1000))
      expect(callback).toHaveBeenCalledOnce()
      expect(setDeckList).not.toHaveBeenCalled()
    }
  )
  it('external sample replacement wins over the pending draft on departure', () => {
    const { props, rerender, unmount, setDeckList } = setup({ deckList: '24 Mountain' })
    fireEvent.change(screen.getByLabelText(/Paste your decklist/i), {
      target: { value: 'OLD DRAFT' },
    })
    rerender(<DeckInputSection {...props} deckList="24 Forest" />)
    unmount()
    expect(setDeckList).not.toHaveBeenCalled()
  })
})

describe('leaving the editor before lazy route unmount', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  it('flushes on blur even while the route keeps its previous editor mounted', () => {
    const { setDeckList, onAnalyze } = setup({ deckList: '24 Mountain\n36 Lightning Bolt' })
    const input = screen.getByLabelText(/Paste your decklist/i)
    fireEvent.change(input, { target: { value: '25 Mountain\n35 Lightning Bolt' } })
    fireEvent.blur(input)
    expect(setDeckList).toHaveBeenCalledExactlyOnceWith('25 Mountain\n35 Lightning Bolt')
    expect(onAnalyze).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1000))
    expect(setDeckList).toHaveBeenCalledTimes(1)
  })
})
