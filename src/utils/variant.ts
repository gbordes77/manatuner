import { parseDecklist, type ParsedDeckEntry } from '../services/deckParser'

export function variantChanges(original: string, draft: string) {
  const a = parseDecklist(original),
    b = parseDecklist(draft)
  const key = (c: ParsedDeckEntry) => `${c.section}\u0000${c.name.toLowerCase()}`
  const counts = new Map<string, { name: string; section: string; quantity: number }>()
  for (const [entries, sign] of [
    [a.entries, -1],
    [b.entries, 1],
  ] as const) {
    for (const c of entries) {
      const prev = counts.get(key(c))
      counts.set(key(c), {
        name: c.name,
        section: c.section,
        quantity: (prev?.quantity || 0) + sign * c.quantity,
      })
    }
  }
  const changes = [...counts.values()].filter((c) => c.quantity !== 0)
  return {
    changes,
    warnings: b.warnings,
    commanderChanged: changes.some((c) => c.section === 'commander'),
  }
}
