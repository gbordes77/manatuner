import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { AnalysisResult } from '../../../services/deckAnalyzer'
import { DeckInputSection } from '../DeckInputSection'

const deck = '24 Mountain\n36 Lightning Bolt'

for (const key of ['{Enter}', ' ', 'pointer']) {
  describe(`standalone compact editor (${key})`, () => {
    it('opens once through a named button and preserves the focused draft', async () => {
      const user = userEvent.setup()
      const toggle = vi.fn()
      function Harness() {
        const [minimized, setMinimized] = useState(true)
        return (
          <DeckInputSection
            deckList={deck}
            deckName="Keyboard fixture"
            setDeckList={vi.fn()}
            setDeckName={vi.fn()}
            isAnalyzing={false}
            analysisResult={{ totalCards: 60, totalLands: 24 } as AnalysisResult}
            isDeckMinimized={minimized}
            setIsDeckMinimized={(value) => {
              toggle(value)
              setMinimized(value)
            }}
            onAnalyze={vi.fn()}
            onClear={vi.fn()}
            onLoadSample={vi.fn()}
            isMobile={false}
            isSmallMobile={false}
          />
        )
      }
      render(<Harness />)
      await user.tab()
      const button = screen.getByRole('button', { name: 'Edit Deck' })
      expect(document.activeElement).toBe(button)
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(document.getElementById(button.getAttribute('aria-controls')!)).not.toBeNull()
      if (key === 'pointer') await user.click(button)
      else await user.keyboard(key)
      const editor = screen.getByRole('textbox', {
        name: /Paste your decklist/,
      }) as HTMLTextAreaElement
      expect(document.activeElement).toBe(editor)
      expect(editor.value).toBe(deck)
      expect(toggle).toHaveBeenCalledExactlyOnceWith(false)
    })
  })
}
