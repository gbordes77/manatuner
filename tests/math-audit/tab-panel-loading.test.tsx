import React, { lazy } from 'react'
import { act, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { TabPanel } from '../../src/components/analyzer/TabPanel'

it('keeps the controlled panel in the DOM while its lazy content loads', async () => {
  let resolve!: (module: { default: React.ComponentType }) => void
  const pending = new Promise<{ default: React.ComponentType }>((done) => {
    resolve = done
  })
  const Content = lazy(() => pending)
  render(
    <>
      <button id="analyzer-tab-0" aria-controls="analyzer-tabpanel-0">
        Castability
      </button>
      <TabPanel index={0} value={0}>
        <Content />
      </TabPanel>
    </>
  )
  const tab = screen.getByRole('button', { name: 'Castability' })
  const panel = document.getElementById(tab.getAttribute('aria-controls')!)!
  expect(panel).not.toBeNull()
  expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
  expect(screen.getByRole('status').textContent).toContain('Loading analysis panel')
  await act(async () => {
    resolve({ default: () => <p>Probability ready</p> })
    await pending
  })
  expect(screen.getByText('Probability ready')).toBeTruthy()
  expect(screen.queryByRole('status')).toBeNull()
  expect(document.getElementById(tab.getAttribute('aria-controls')!)).toBe(panel)
})
