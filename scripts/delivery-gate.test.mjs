import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checks, runDeliveryGate } from './delivery-gate.mjs'
test('every failing check prevents later build/publish readiness', () => {
  for (let failure = 0; failure < checks.length; failure++) {
    let calls = 0
    assert.throws(
      () => runDeliveryGate(() => ({ status: calls++ === failure ? 1 : 0 })),
      /Delivery blocked/
    )
    assert.equal(calls, failure + 1)
  }
})
test('a killed check also blocks readiness', () => {
  assert.throws(
    () => runDeliveryGate(() => ({ status: null, signal: 'SIGTERM' })),
    /Delivery blocked/
  )
})
test('successful checks run exactly once and in order', () => {
  const seen = []
  runDeliveryGate((cmd, args) => {
    seen.push([cmd, args])
    return { status: 0 }
  })
  assert.deepEqual(seen, checks)
})
