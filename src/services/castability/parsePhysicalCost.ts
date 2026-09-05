import type { ProducerManaCost } from '../../types/manaProducers'
/** Parse only represented payments. Unknown symbols are not silently discarded. */
export function parsePhysicalCost(text: string, x = 2): ProducerManaCost {
  const result: ProducerManaCost = { mv: 0, generic: 0, pips: {}, hybrid: [] }
  const tokens = text.match(/\{([^{}]+)\}/g) ?? []
  if (
    !tokens.length ||
    tokens.join('') !== text.replace(/\s/g, '') ||
    !Number.isSafeInteger(x) ||
    x < 0
  )
    result.unsupportedSymbols = true
  for (const token of tokens) {
    const value = token.slice(1, -1)
    if (/^\d+$/.test(value) || value === 'X') {
      result.generic += value === 'X' ? x : Number(value)
    } else if (/^[WUBRGC]$/.test(value)) {
      const c = value as keyof typeof result.pips
      result.pips[c] = (result.pips[c] ?? 0) + 1
    } else if (/^[WUBRG]\/[WUBRG]$/.test(value)) {
      result.hybrid!.push(value.split('/').reduce((m, c) => m | (1 << 'WUBRGC'.indexOf(c)), 0))
    } else result.unsupportedSymbols = true
  }
  result.mv =
    result.generic +
    Object.values(result.pips).reduce((a, b) => a + (b ?? 0), 0) +
    result.hybrid!.length
  return result
}
