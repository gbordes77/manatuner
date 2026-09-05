/** Independent oracle: integer combinatorics, no production imports. */
export function choose(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n
  let value = 1n
  for (let i = 1; i <= k; i++) value = (value * BigInt(n - i + 1)) / BigInt(i)
  return value
}
export function exactPmf(N: number, K: number, n: number, k: number): number {
  return Number(choose(K, k) * choose(N - K, n - k)) / Number(choose(N, n))
}
export function exactTail(N: number, K: number, n: number, k: number): number {
  let numerator = 0n
  for (let x = Math.max(0, k); x <= Math.min(K, n); x++) {
    numerator += choose(K, x) * choose(N - K, n - x)
  }
  return Number(numerator) / Number(choose(N, n))
}
export function enumerateHands<T>(deck: T[], size: number): T[][] {
  const result: T[][] = []
  function visit(start: number, hand: T[]) {
    if (hand.length === size) {
      result.push([...hand])
      return
    }
    for (let i = start; i <= deck.length - (size - hand.length); i++) {
      hand.push(deck[i])
      visit(i + 1, hand)
      hand.pop()
    }
  }
  visit(0, [])
  return result
}
/** Distinct physical sources, one mana per source, exhaustive payment choices. */
export function canPay(sources: string[][], pips: string[], generic = 0): boolean {
  if (sources.length < pips.length + generic) return false
  if (!pips.length) return true
  return sources.some(
    (colors, i) =>
      colors.includes(pips[0]) &&
      canPay(
        sources.filter((_, j) => i !== j),
        pips.slice(1),
        generic
      )
  )
}
