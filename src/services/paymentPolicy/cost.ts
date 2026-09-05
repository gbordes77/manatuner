import type { ManaOutput, PaymentKind } from './types'
export const MANA = 'WUBRGC'
// Snow is provenance, creature-only is a spending restriction; neither is a color.
export const unitIndex = (u: ManaOutput): number =>
  MANA.indexOf(u.color) + (u.snow ? 6 : 0) + (u.creatureOnly ? 12 : 0)
export function parsePolicyCost(text: string, x = 2): string[] | null {
  if (!Number.isSafeInteger(x) || x < 0 || x > 100) return null
  const tokens = text.match(/\{([^{}]+)\}/g) ?? []
  if (!tokens.length || tokens.join('') !== text.replace(/\s/g, '')) return null
  const out: string[] = []
  for (const token of tokens) {
    const v = token.slice(1, -1)
    if (/^\d+$/.test(v) || v === 'X') {
      const n = v === 'X' ? x : Number(v)
      if (!Number.isSafeInteger(n) || n > 100) return null
      out.push(...Array<string>(n).fill('1'))
    } else if (
      /^[WUBRGCS]$/.test(v) ||
      /^(?:[WUBRG]\/)?[WUBRG]\/P$/.test(v) ||
      /^[WUBRG]\/P$/.test(v) ||
      /^(?:2|[WUBRGC])\/[WUBRG]$/.test(v)
    )
      out.push(v)
    else return null
  }
  // Colored/provenance constraints before generic greatly reduce equivalent payments.
  return out.sort((a, b) => Number(a === '1') - Number(b === '1'))
}
export function payments(
  pool: number[],
  life: number,
  tokens: string[],
  kind: PaymentKind,
  floor: number,
  tick: () => void = () => {}
): { pool: number[]; life: number }[] {
  const results = new Map<string, { pool: number[]; life: number }>()
  const visited = new Set<string>()
  const visit = (index: number, p: number[], hp: number) => {
    tick()
    const key = `${index}:${hp}:${p}`
    if (visited.has(key)) return
    visited.add(key)
    if (index === tokens.length) {
      results.set(`${hp}:${p}`, { pool: p, life: hp })
      return
    }
    for (const option of tokens[index].split('/')) {
      if (option === 'P') {
        if (hp - 2 >= floor) visit(index + 1, p, hp - 2)
        continue
      }
      if (option === '2') {
        for (const paid of payments(p, hp, ['1', '1'], kind, floor, tick))
          visit(index + 1, paid.pool, paid.life)
        continue
      }
      for (let i = 0; i < 24; i++) {
        if (!p[i] || (i >= 12 && kind !== 'creature')) continue
        if (option !== '1' && !(option === 'S' ? i % 12 >= 6 : MANA[i % 6] === option)) continue
        const next = [...p]
        next[i]--
        visit(index + 1, next, hp)
      }
    }
  }
  visit(0, pool, life)
  return [...results.values()]
}
