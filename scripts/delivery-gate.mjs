/** The native Vercel build cannot succeed before every local candidate check succeeds. */
import { spawnSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
export const checks = [
  ['npm', ['run', 'lint']],
  ['npm', ['run', 'type-check']],
  [
    'npx',
    [
      'vitest',
      'run',
      'src',
      'tests/component',
      'tests/math-audit',
      '--configLoader',
      'runner',
      '--no-cache',
    ],
  ],
  ['node', ['--test', 'scripts/delivery-gate.test.mjs']],
  ['npx', ['vite', 'build', '--outDir', process.env.PRERENDER_DIST || 'dist']],
  ['node', ['scripts/check-bundle-budget.mjs']],
  ['npm', ['audit', '--audit-level=high']],
  ['node', ['scripts/prerender.mjs']],
  ['npx', ['playwright', 'test', '--config=playwright.delivery.config.js', '--project=chromium']],
]
export function runDeliveryGate(run = spawnSync, sequence = checks) {
  const ownedEvidence = process.env.MANATUNER_MATH_EVIDENCE_DIR
    ? null
    : mkdtempSync(join(tmpdir(), 'manatuner-gate-math-'))
  const env = {
    ...process.env,
    MANATUNER_MATH_EVIDENCE_DIR: process.env.MANATUNER_MATH_EVIDENCE_DIR || ownedEvidence,
  }
  try {
    for (const [command, args] of sequence) {
      console.log(`[delivery gate] ${command} ${args.join(' ')}`)
      const result = run(command, args, { stdio: 'inherit', env })
      if (result.error || result.status !== 0)
        throw new Error(
          `Delivery blocked by ${command}: ${result.error?.message || `exit ${result.status}`}`
        )
    }
    console.log('[delivery gate] All candidate checks passed; build may finish.')
  } finally {
    if (ownedEvidence) rmSync(ownedEvidence, { recursive: true, force: true })
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    runDeliveryGate()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
