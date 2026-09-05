import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import PaymentPolicyPanel from '../../src/components/analyzer/PaymentPolicyPanel'
import type { DeckCard } from '../../src/services/deckAnalyzer'
import { landService } from '../../src/services/landService'
class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage: ((event: any) => void) | null = null
  onerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    FakeWorker.instances.push(this)
  }
}
afterEach(() => {
  vi.unstubAllGlobals()
  FakeWorker.instances = []
})
const cards: DeckCard[] = [
  {
    name: 'Forest',
    quantity: 10,
    isLand: true,
    resolved: true,
    colors: ['G'],
    cmc: 0,
    manaCost: '',
    landMetadata: landService.getLandSync('Forest')!,
  },
]
function start() {
  vi.stubGlobal('Worker', FakeWorker)
  render(<PaymentPolicyPanel cards={cards} />)
  fireEvent.click(screen.getByRole('button', { name: 'Calculate payment strategy' }))
  return FakeWorker.instances.at(-1)!
}
const exact = {
  status: 'exact',
  model: 'payment-policy-v2',
  probability: 0.7,
  work: 100,
  memoHits: 0,
  assumptions: 'external target',
}
it('runs off-thread, terminates on completion and invalidates results after input changes', () => {
  const worker = start()
  const { id, input } = worker.postMessage.mock.calls[0][0]
  expect(input.cards[0].count).toBe(10)
  act(() => worker.onmessage!({ data: { id, result: exact } }))
  expect(screen.getByText('Policy payment probability: 70.00%')).toBeInTheDocument()
  expect(worker.terminate).toHaveBeenCalledOnce()
  fireEvent.change(screen.getByLabelText('Target mana cost'), { target: { value: '{U}' } })
  expect(screen.queryByText(/70.00%/)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Export policy JSON' })).not.toBeInTheDocument()
})
it('cancels work and ignores a late result for the old input', () => {
  const worker = start()
  const { id } = worker.postMessage.mock.calls[0][0]
  fireEvent.click(screen.getByRole('button', { name: 'Cancel calculation' }))
  expect(worker.terminate).toHaveBeenCalledOnce()
  act(() => worker.onmessage!({ data: { id, result: exact } }))
  expect(screen.queryByText(/70.00%/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Calculate payment strategy' }))
  const next = FakeWorker.instances.at(-1)!
  fireEvent.change(screen.getByLabelText('Target turn'), { target: { value: '3' } })
  expect(next.terminate).toHaveBeenCalled()
  act(() => next.onmessage!({ data: { id: next.postMessage.mock.calls[0][0].id, result: exact } }))
  expect(screen.queryByText(/70.00%/)).not.toBeInTheDocument()
})
it('worker errors and resource exhaustion display no percentage', () => {
  const worker = start()
  act(() => worker.onerror!())
  expect(screen.getByText(/Worker unavailable/)).toBeInTheDocument()
  expect(screen.queryByText(/Policy payment probability/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Calculate payment strategy' }))
  const next = FakeWorker.instances.at(-1)!
  act(() =>
    next.onmessage!({
      data: {
        id: next.postMessage.mock.calls[0][0].id,
        result: {
          status: 'unsupported',
          model: 'payment-policy-v2',
          code: 'budget',
          reason: 'Budget exceeded',
        },
      },
    })
  )
  expect(screen.getByText(/Budget exceeded/)).toBeInTheDocument()
  expect(screen.queryByText(/Policy payment probability/)).not.toBeInTheDocument()
})
