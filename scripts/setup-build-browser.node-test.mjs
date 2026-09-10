import test from 'node:test'
import assert from 'node:assert/strict'
import { setupBuildBrowser } from './setup-build-browser.mjs'

test('browser setup does not install native packages on local or non-Vercel hosts', () => {
  const run = () => {
    throw new Error('Must not mutate this host')
  }
  for (const [platform, env] of [
    ['darwin', { VERCEL: '1' }],
    ['win32', { VERCEL: 'true' }],
    ['linux', {}],
    ['linux', { VERCEL: 'false' }],
  ])
    assert.equal(setupBuildBrowser({ platform, env, run }), false)
})

test('Vercel Linux installs native libraries exactly once and accepts success', () => {
  const calls = []
  const env = { VERCEL: '1' }
  const run = (...args) => {
    calls.push(args)
    return { status: 0 }
  }
  assert.equal(setupBuildBrowser({ platform: 'linux', env, run }), true)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'dnf')
  assert.deepEqual(calls[0][1], [
    'install',
    '-y',
    'nspr',
    'nss',
    'mesa-libgbm',
    'libxkbcommon',
    'libdrm',
    'libXdamage',
    'libXfixes',
  ])
  assert.equal(calls[0][2].env, env)
  assert.equal(calls[0][2].stdio, 'inherit')
})

test('missing dnf, package failure and termination all block installation', () => {
  for (const [result, expected] of [
    [{ status: 1 }, /exit 1/],
    [{ status: null, signal: 'SIGTERM' }, /signal SIGTERM/],
    [{ status: null, error: new Error('spawn dnf ENOENT') }, /ENOENT/],
  ]) {
    assert.throws(
      () => setupBuildBrowser({ platform: 'linux', env: { VERCEL: 'true' }, run: () => result }),
      expected
    )
  }
})
