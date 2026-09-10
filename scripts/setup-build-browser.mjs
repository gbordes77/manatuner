/** Install Chromium's missing native libraries in the Vercel AL2023 build image.
 * Vercel documents dnf in Install Command: https://vercel.com/docs/builds/build-image
 * Keep the Playwright-pinned browser and its security/launch settings unchanged.
 */
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Vercel already supplies GTK, ALSA, ATK, Pango, Cairo, CUPS and their dependencies.
// These remaining libraries cover the Chromium requirements absent from its list.
export const browserPackages = Object.freeze([
  'nspr',
  'nss',
  'mesa-libgbm',
  'libxkbcommon',
  'libdrm',
  'libXdamage',
  'libXfixes',
])

export function setupBuildBrowser({
  env = process.env,
  platform = process.platform,
  run = spawnSync,
} = {}) {
  if (platform !== 'linux' || !['1', 'true'].includes(env.VERCEL)) return false
  console.log('[build browser] Installing Vercel Chromium native libraries with dnf')
  const result = run('dnf', ['install', '-y', ...browserPackages], { stdio: 'inherit', env })
  if (result.error || result.status !== 0) {
    throw new Error(
      `Chromium native library installation failed: ${result.error?.message || (result.signal ? `signal ${result.signal}` : `exit ${result.status}`)}`
    )
  }
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    setupBuildBrowser()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
