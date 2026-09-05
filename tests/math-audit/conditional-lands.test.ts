import { expect, it } from 'vitest'
import { landService } from '../../src/services/landService'
import { physicalManaProbability } from '../../src/services/castability/physicalManaEngine'
import { enumerateHands } from './oracle'

type Card = {
  name: string
  basic?: boolean
  types?: string[]
  ready: (previous: Card[]) => boolean
}
const always = () => true
const basic = (name: string, type: string): Card => ({
  name,
  basic: true,
  types: [type],
  ready: always,
})
// Independent identity-level oracle: enumerate opening subsets, ordered draws,
// then every possible land-drop schedule. No production probability/payment helpers.
function oracle(lands: Card[], turn: number, required: number): number {
  const ids = Array.from({ length: 10 }, (_, i) => i)
  let yes = 0,
    all = 0
  for (const opening of enumerateHands(ids, 7)) {
    const remaining = ids.filter((i) => !opening.includes(i))
    const draws = (seq: number[], rest: number[]) => {
      if (seq.length < turn - 1) {
        for (const id of rest)
          draws(
            [...seq, id],
            rest.filter((i) => i !== id)
          )
        return
      }
      all++
      function schedule(t: number, played: number[], available: number[]): boolean {
        const hand = t === 1 ? available : [...available, seq[t - 2]]
        const options = [-1, ...hand.filter((i) => i < lands.length)]
        for (const id of options) {
          const untapped = id < 0 ? 0 : Number(lands[id].ready(played.map((i) => lands[i])))
          if (t === turn) {
            if (played.length + untapped >= required) return true
          } else if (
            schedule(
              t + 1,
              id < 0 ? played : [...played, id],
              hand.filter((i) => i !== id)
            )
          )
            return true
        }
        return false
      }
      if (schedule(1, [], opening)) yes++
    }
    draws([], remaining)
  }
  return yes / all
}
const plains = basic('Plains', 'Plains')
const island = basic('Island', 'Island')
const tundra: Card = { name: 'Tundra', types: ['Plains', 'Island'], ready: always }
const fast: Card = { name: 'Seachrome Coast', ready: (p) => p.length <= 2 }
const slow: Card = { name: 'Deserted Beach', ready: (p) => p.length >= 2 }
const check: Card = {
  name: 'Glacial Fortress',
  ready: (p) => p.some((c) => c.types?.some((t) => ['Plains', 'Island'].includes(t))),
}
const battle: Card = {
  name: 'Prairie Stream',
  types: ['Plains', 'Island'],
  ready: (p) => p.filter((c) => c.basic).length >= 2,
}
for (const [label, lands] of [
  ['fast', [fast, fast, plains, island]],
  ['slow', [slow, slow, plains, island]],
  ['check with typed nonbasic', [check, check, tundra, island]],
  ['battle with basics', [battle, plains, island, island]],
  ['battle cannot count typed nonbasics as basics', [battle, tundra, tundra, island]],
] as [string, Card[]][]) {
  for (const turn of [1, 2, 3, 4])
    it(`${label}: turn ${turn} matches exhaustive draw histories and land orders`, () => {
      const physicalLands = lands.map((c) => {
        const metadata = landService.getLandSync(c.name)
        expect(metadata, c.name).not.toBeNull()
        return metadata!
      })
      const result = physicalManaProbability(
        { deckSize: 10, totalLands: lands.length, landColorSources: {}, physicalLands },
        { mv: turn, generic: turn, pips: {} },
        turn,
        [],
        'PLAY',
        2_000_000
      )
      expect(result.status, JSON.stringify(result)).toBe('exact')
      if (result.status === 'exact') expect(result.p2).toBeCloseTo(oracle(lands, turn, turn), 11)
    })
}
