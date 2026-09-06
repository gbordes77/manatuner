/** Strict static preview: never use Vite's SPA fallback as evidence of HTTP 404s.
 * This mirrors the selected filesystem/404 contract; it is not a Vercel emulator.
 */
import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { resolve, join, extname, sep } from 'node:path'
const root = resolve(process.env.PRERENDER_DIST || 'dist')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
}
createServer((req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const aliases = { '/reading-list': '/library', '/mes-analyses': '/my-analyses' }
    if (aliases[path]) {
      res.writeHead(308, { Location: aliases[path] })
      res.end()
      return
    }
    let file = resolve(root, '.' + path)
    if (file !== root && !file.startsWith(root + sep)) throw new Error('invalid path')
    try {
      if (statSync(file).isDirectory()) file = join(file, 'index.html')
    } catch {
      /* missing */
    }
    if (!extname(file)) file += '.html'
    const body = readFileSync(file)
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' })
    res.end(readFileSync(join(root, '404.html')))
  }
}).listen(Number(process.env.CANDIDATE_PORT || 4175), '127.0.0.1', () =>
  console.log(`Strict candidate server: ${root}`)
)
