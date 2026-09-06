import { writeFileSync } from 'node:fs'
import { afterAll, expect, it } from 'vitest'
import { physicalManaProbability } from '../../src/services/castability/physicalManaEngine'
import { landService } from '../../src/services/landService'
import { getProducerFromSeed } from '../../src/data/manaProducerSeed'
import { enumerateHands } from './oracle'
import sources from '../../docs/math/pathways-2026-09-05/card-sources.json'

// Independent identity-based oracle: fixed face chosen on play; one unit per
// permanent; a single audited G elf can be installed with a G source.
// No production payment, grouping, probability or state-transition function used.
type Card = { faces: string[]; tapped?: boolean } | 'elf' | null
function oracle(cards: Card[], pips: string[], generic: number, turn: number, draw: boolean) {
  function wins(opening: number[], draws: number[]): boolean {
    type Permanent = { color: string; ready: boolean; elf: boolean }
    function play(t: number, hand: number[], board: Permanent[]): boolean {
      const h = [...hand, ...(draw || t > 1 ? [draws[draw ? t - 1 : t - 2]] : [])]
      function actions(ids: number[], b: Permanent[], landPlayed: boolean): boolean {
        const pool = b.filter((p) => p.ready).map((p) => p.color)
        let paid = true
        for (const c of pips) {
          const i = pool.indexOf(c)
          if (i < 0) {
            paid = false
            break
          }
          pool.splice(i, 1)
        }
        if (t === turn && paid && pool.length >= generic) return true
        for (const id of ids) {
          const card = cards[id]
          const rest = ids.filter((i) => i !== id)
          if (card && card !== 'elf' && !landPlayed) {
            for (const color of card.faces)
              if (actions(rest, [...b, { color, ready: !card.tapped, elf: false }], true))
                return true
          }
          if (card === 'elf') {
            for (let i = 0; i < b.length; i++) {
              if (!b[i].ready || b[i].color !== 'G') continue
              const next = b.map((p, j) => ({ ...p, ready: j === i ? false : p.ready }))
              if (actions(rest, [...next, { color: 'G', ready: false, elf: true }], landPlayed))
                return true
            }
          }
        }
        return (
          t < turn &&
          play(
            t + 1,
            ids,
            b.map((p) => ({ ...p, ready: true }))
          )
        )
      }
      return actions(h, board, false)
    }
    return play(1, opening, [])
  }
  let successes = 0,
    histories = 0
  for (const hand of enumerateHands(
    cards.map((_, i) => i),
    7
  )) {
    const draws = (prefix: number[]) => {
      if (prefix.length === turn - (draw ? 0 : 1)) {
        histories++
        if (wins(hand, prefix)) successes++
        return
      }
      for (let i = 0; i < cards.length; i++)
        if (!hand.includes(i) && !prefix.includes(i)) draws([...prefix, i])
    }
    draws([])
  }
  return successes / histories
}
const evidence: unknown[] = []
afterAll(() =>
  writeFileSync(`${process.env.MANATUNER_MATH_EVIDENCE_DIR || '/tmp'}/manatuner-pathway-oracle.json`, JSON.stringify(evidence, null, 2))
)
const pathway = landService.getLandSync('Cragcrown Pathway')!
const forest = landService.getLandSync('Forest')!
const elf = { def: getProducerFromSeed('Llanowar Elves')!, copies: 1 }
for (const draw of [false, true])
  for (const turn of [1, 2, 3]) {
    it(`fixed pathways match identity oracle, turn ${turn}, draw=${draw}`, () => {
      const cards: Card[] = [
        { faces: ['R', 'G'] },
        { faces: ['R', 'G'] },
        { faces: ['G'], tapped: true },
        'elf',
        null,
        null,
        null,
        null,
        null,
        null,
      ]
      const deck = {
        deckSize: 10,
        totalLands: 3,
        landColorSources: {},
        physicalLands: [
          pathway,
          pathway,
          { ...forest, etbBehavior: { type: 'always_tapped' as const } },
        ],
      }
      const expected = oracle(cards, ['R', 'G'], 0, turn, draw)
      const result = physicalManaProbability(
        deck,
        { mv: 2, generic: 0, pips: { R: 1, G: 1 } },
        turn,
        [elf],
        draw ? 'DRAW' : 'PLAY'
      )
      const genericProbability = oracle(cards, [], 2, turn, draw)
      const expectedP1 = genericProbability ? expected / genericProbability : 0
      evidence.push({ turn, draw, expected, expectedP1, genericProbability, result })
      expect(result.status).toBe('exact')
      if (result.status === 'exact') {
        expect(result.p2).toBeCloseTo(expected, 12)
        expect(result.p1).toBeCloseTo(expectedP1, 12)
      }
    })
  }
it('a face used to cast an elf cannot switch color next turn', () => {
  const deck = { deckSize: 10, totalLands: 1, landColorSources: {}, physicalLands: [pathway] }
  const result = physicalManaProbability(deck, { mv: 2, generic: 0, pips: { R: 1, G: 1 } }, 2, [
    elf,
  ])
  expect(result).toMatchObject({ status: 'exact', p2: 0 })
  const green = physicalManaProbability(deck, { mv: 2, generic: 0, pips: { G: 2 } }, 2, [elf])
  expect(green.status).toBe('exact')
  if (green.status === 'exact') expect(green.p2).toBeCloseTo((7 * 6) / (10 * 9), 12)
})
it('one physical pathway cannot pay two pips and is not two cards in the library', () => {
  const deck = { deckSize: 10, totalLands: 1, landColorSources: {}, physicalLands: [pathway] }
  expect(
    physicalManaProbability(deck, { mv: 2, generic: 0, pips: { R: 1, G: 1 } }, 2)
  ).toMatchObject({ status: 'exact', p2: 0 })
  const result = physicalManaProbability(deck, { mv: 1, generic: 0, pips: { G: 1 } }, 1)
  expect(result.status).toBe('exact')
  if (result.status === 'exact') expect(result.p2).toBeCloseTo(7 / 10, 12)
})
for (const card of sources)
  it(`both faces of ${card.name} match the preserved Oracle contract`, () => {
    for (const face of card.faces) {
      const land = landService.getLandSync(face.name)!
      for (const demand of card.faces) {
        const color = demand.oracle_text.match(/Add \{([WUBRG])\}/)![1]
        const result = physicalManaProbability(
          { deckSize: 10, totalLands: 1, landColorSources: {}, physicalLands: [land] },
          { mv: 1, generic: 0, pips: { [color]: 1 } },
          1
        )
        expect(result.status).toBe('exact')
        if (result.status === 'exact') expect(result.p2).toBeCloseTo(0.7, 12)
      }
    }
  })
it('unaudited or tapped MDFC faces remain unsupported, as do fetchs', () => {
  for (const land of [
    { ...pathway, name: 'Unknown pathway' },
    { ...pathway, etbBehavior: { type: 'always_tapped' as const } },
    { ...pathway, otherFace: 'Spell face' },
    landService.getLandSync('Flooded Strand')!,
  ]) {
    expect(
      physicalManaProbability(
        { deckSize: 10, totalLands: 1, landColorSources: {}, physicalLands: [land] },
        { mv: 1, generic: 0, pips: { G: 1 } },
        1
      ).status
    ).toBe('unsupported')
  }
})

it('resource exhaustion yields no partial pathway probability', () => {
  const result = physicalManaProbability(
    { deckSize: 10, totalLands: 1, landColorSources: {}, physicalLands: [pathway] },
    { mv: 1, generic: 0, pips: { R: 1 } },
    1,
    [],
    'PLAY',
    1
  )
  expect(result).toMatchObject({ status: 'unsupported' })
  expect(result).not.toHaveProperty('p2')
})
