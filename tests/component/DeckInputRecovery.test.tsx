import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { DeckInputSection } from '../../src/components/analyzer/DeckInputSection'

it.each([false, true])(
  'keeps the editor usable without results despite a stale minimized flag (mobile=%s)',
  (isMobile) => {
    const onAnalyze = vi.fn()
    render(
      <DeckInputSection
        deckList="24 Forest"
        deckName="Saved deck"
        setDeckList={vi.fn()}
        setDeckName={vi.fn()}
        isAnalyzing={false}
        analysisResult={null}
        isDeckMinimized={true}
        setIsDeckMinimized={vi.fn()}
        onAnalyze={onAnalyze}
        onClear={vi.fn()}
        onLoadSample={vi.fn()}
        isMobile={isMobile}
        isSmallMobile={isMobile}
      />
    )
    const editor = screen.getByPlaceholderText(/paste your decklist/i)
    expect(editor).toBeVisible()
    fireEvent.change(editor, { target: { value: '60 Forest' } })
    fireEvent.click(screen.getByRole('button', { name: 'Analyze Manabase' }))
    expect(onAnalyze).toHaveBeenCalledWith('60 Forest')
  }
)
