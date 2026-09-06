import React from 'react'
import { expect, it, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
const { workers } = vi.hoisted(() => ({ workers: [] as any[] }))
vi.mock('../../src/workers/mulliganArchetype.worker?worker', () => ({
  default: class {
    handler: any
    request: any
    terminate = vi.fn()
    constructor() {
      workers.push(this)
    }
    addEventListener(type: string, handler: any) {
      if (type === 'message') this.handler = handler
    }
    removeEventListener() {}
    postMessage(request: any) {
      this.request = request
    }
  },
}))
import { MulliganTab } from '../../src/components/analyzer/MulliganTab'
it('switching rules terminates prior work and ignores a stale result', () => {
  const { unmount } = render(
    <MulliganTab
      cards={[
        {
          name: 'Forest',
          quantity: 60,
          manaCost: '',
          cmc: 0,
          colors: [],
          isLand: true,
          producedMana: ['G'],
        },
      ]}
    />
  )
  const first = workers.at(-1)
  fireEvent.click(screen.getByRole('checkbox', { name: /Multiplayer/ }))
  const current = workers.at(-1)
  expect(first.terminate).toHaveBeenCalled()
  expect(current.request.multiplayer).toBe(true)
  act(() => first.handler({ data: { id: first.request.id, ok: false, error: 'STALE RESULT' } }))
  expect(screen.queryByText('STALE RESULT')).toBeNull()
  act(() =>
    current.handler({ data: { id: current.request.id, ok: false, error: 'CURRENT RESULT' } })
  )
  expect(screen.getByText('CURRENT RESULT')).toBeTruthy()
  unmount()
  expect(current.terminate).toHaveBeenCalled()
})
