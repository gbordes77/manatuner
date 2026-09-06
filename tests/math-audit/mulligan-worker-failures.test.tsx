import React from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
const state = vi.hoisted(() => ({
  workers: [] as any[],
  constructionError: false,
  postError: false,
}))
vi.mock('../../src/workers/mulliganArchetype.worker?worker', () => ({
  default: class {
    listeners = new Map<string, Set<(event: any) => void>>()
    request: any
    terminate = vi.fn()
    constructor() {
      if (state.constructionError) throw new Error('load failed')
      state.workers.push(this)
    }
    addEventListener(type: string, fn: (event: any) => void) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set())
      this.listeners.get(type)!.add(fn)
    }
    removeEventListener(type: string, fn: (event: any) => void) {
      this.listeners.get(type)?.delete(fn)
    }
    postMessage(request: any) {
      if (state.postError) throw new Error('clone failed')
      this.request = request
    }
    emit(type: string, event: any) {
      for (const fn of [...(this.listeners.get(type) || [])]) fn(event)
    }
    count() {
      return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0)
    }
  },
}))
import { analyzeWithArchetype } from '../../src/services/mulliganSimulatorAdvanced'
import { MulliganTab } from '../../src/components/analyzer/MulliganTab'
const cards: any[] = [
  {
    name: 'Forest',
    quantity: 60,
    manaCost: '',
    cmc: 0,
    colors: [],
    isLand: true,
    producedMana: ['G'],
  },
]
const current = () => state.workers.at(-1)
beforeEach(() => {
  state.workers.length = 0
  state.constructionError = false
  state.postError = false
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
it('recovers from constructor failure and can retry', () => {
  state.constructionError = true
  expect(() => render(<MulliganTab cards={cards} />)).not.toThrow()
  expect(
    screen
      .getAllByRole('alert')
      .map((el) => el.textContent)
      .join(' ')
  ).toMatch(/Failed to start/i)
  state.constructionError = false
  fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
  expect(current().request.iterations).toBe(10000)
})
for (const kind of ['error', 'messageerror']) {
  it(`cleans ${kind}, frees loading, retries and ignores old listeners`, () => {
    render(<MulliganTab cards={cards} />)
    const old = current()
    const stale = [...old.listeners.get('message')][0] as (event: any) => void
    act(() => old.emit(kind, { preventDefault: vi.fn() }))
    expect(
      screen
        .getAllByRole('alert')
        .map((el) => el.textContent)
        .join(' ')
    ).toMatch(/worker|message/i)
    expect(screen.getByRole('button', { name: 'Re-run Analysis' })).toBeEnabled()
    expect(old.terminate).toHaveBeenCalled()
    expect(old.count()).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
    act(() => stale({ data: { id: old.request.id, ok: false, error: 'STALE' } }))
    expect(screen.queryByText('STALE')).toBeNull()
    const active = current()
    act(() =>
      active.emit('message', {
        data: { id: active.request.id, ok: false, error: 'Business failure' },
      })
    )
    expect(screen.getByText('Business failure')).toBeTruthy()
    expect(active.count()).toBe(0)
  })
}
it('reports no worker acknowledgement and cleans listeners', () => {
  vi.useFakeTimers()
  render(<MulliganTab cards={cards} />)
  const worker = current()
  act(() => vi.advanceTimersByTime(15000))
  expect(screen.getByRole('button', { name: 'Re-run Analysis' })).toBeEnabled()
  expect(
    screen
      .getAllByRole('alert')
      .map((el) => el.textContent)
      .join(' ')
  ).toMatch(/start|respond/i)
  expect(worker.count()).toBe(0)
  expect(worker.terminate).toHaveBeenCalled()
})
it('does not time out an acknowledged precise calculation and offers cancel/retry', () => {
  vi.useFakeTimers()
  render(<MulliganTab cards={cards} />)
  let worker = current()
  act(() =>
    worker.emit('message', { data: { id: worker.request.id, ok: false, error: 'initial stop' } })
  )
  fireEvent.click(screen.getByText('Precise (50k)'))
  worker = current()
  expect(worker.request.iterations).toBe(50000)
  act(() => worker.emit('message', { data: { id: worker.request.id, type: 'started' } }))
  act(() => vi.advanceTimersByTime(3600000))
  expect(worker.terminate).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel analysis' }))
  expect(worker.terminate).toHaveBeenCalled()
  expect(worker.count()).toBe(0)
  fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
  expect(current()).not.toBe(worker)
})
it('recovers from postMessage failure and cleans on unmount', () => {
  state.postError = true
  const view = render(<MulliganTab cards={cards} />)
  expect(
    screen
      .getAllByRole('alert')
      .map((el) => el.textContent)
      .join(' ')
  ).toMatch(/Failed to start/)
  expect(current().count()).toBe(0)
  state.postError = false
  fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
  const worker = current()
  view.unmount()
  expect(worker.count()).toBe(0)
  expect(worker.terminate).toHaveBeenCalled()
})

it('clears a completed result on retry failure and accepts a fresh successful run', () => {
  render(<MulliganTab cards={cards} />)
  const result = analyzeWithArchetype(cards, 'midrange', 1000)
  let worker = current()
  act(() => worker.emit('message', { data: { id: worker.request.id, ok: true, result } }))
  expect(screen.getByText('How to use this analysis')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
  expect(screen.queryByText('How to use this analysis')).toBeNull()
  worker = current()
  act(() => worker.emit('error', { preventDefault: vi.fn() }))
  expect(screen.queryByText('How to use this analysis')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Re-run Analysis' }))
  worker = current()
  act(() => worker.emit('message', { data: { id: worker.request.id, ok: true, result } }))
  expect(screen.getByText('How to use this analysis')).toBeTruthy()
})
