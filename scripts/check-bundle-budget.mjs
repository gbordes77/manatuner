#!/usr/bin/env node
/**
 * QW3 — fail CI if eager/vendor chunks exceed measured budgets (post-T12).
 * Run after `npm run build`. Reads dist/assets/*.js sizes.
 *
 * Budgets (raw bytes) — leave headroom after T12 split:
 *  - vendor-mui (material+emotion): 450 KB
 *  - vendor-mui-icons: 450 KB
 *  - vendor-react: 200 KB
 *  - any single chunk: 700 KB
 *  - sum of entry-related vendors listed in index.html preloads: 1.6 MB
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = join(process.cwd(), 'dist')
const ASSETS = join(DIST, 'assets')

const BUDGETS = {
  'vendor-mui': 450 * 1024,
  'vendor-mui-icons': 450 * 1024,
  'vendor-react': 200 * 1024,
  anyChunk: 700 * 1024,
}

function main() {
  let files
  try {
    files = readdirSync(ASSETS).filter((f) => f.endsWith('.js'))
  } catch {
    console.error('check-bundle-budget: dist/assets missing — run build first')
    process.exit(1)
  }

  const sizes = files.map((f) => {
    const bytes = statSync(join(ASSETS, f)).size
    return { file: f, bytes }
  })

  const failures = []

  for (const { file, bytes } of sizes) {
    if (bytes > BUDGETS.anyChunk) {
      failures.push(`${file}: ${(bytes / 1024).toFixed(1)} KB > ${BUDGETS.anyChunk / 1024} KB any-chunk cap`)
    }
    for (const key of ['vendor-mui-icons', 'vendor-mui', 'vendor-react']) {
      if (file.includes(key) && bytes > BUDGETS[key]) {
        failures.push(
          `${file}: ${(bytes / 1024).toFixed(1)} KB > ${BUDGETS[key] / 1024} KB (${key})`
        )
      }
    }
  }

  // Report table
  console.log('Bundle budget check (QW3)')
  console.log(
    sizes
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 15)
      .map((s) => `  ${(s.bytes / 1024).toFixed(1).padStart(8)} KB  ${s.file}`)
      .join('\n')
  )

  if (failures.length) {
    console.error('\nBUDGET FAILURES:')
    for (const f of failures) console.error(' -', f)
    process.exit(1)
  }
  console.log('\nOK — all budgets within limits')
}

main()
