import { expect, it, vi } from 'vitest'
import { physicalManaProbability } from '../../src/services/castability/physicalManaEngine'
import { landService } from '../../src/services/landService'
import type { LandMetadata } from '../../src/types/lands'
import { exactTail } from './oracle'
const gate: LandMetadata = {
  ...landService.getLandSync('Plains')!,
  name: 'Selesnya Guildgate',
  category: 'utility',
  produces: ['G', 'W'],
  etbBehavior: { type: 'always_tapped' },
  basicLandTypes: undefined,
  scryfallData: {
    oracleText: 'This land enters tapped.\n{T}: Add {G} or {W}.',
    typeLine: 'Land — Gate',
    layout: 'normal',
  },
}
function result(lands: LandMetadata[], turn: number) {
  return physicalManaProbability(
    { deckSize: 40, totalLands: lands.length, physicalLands: lands, landColorSources: {} },
    { mv: 1, generic: 0, pips: { W: 1 } },
    turn,
    [],
    'DRAW'
  )
}
it('plain Guildgates enter tapped: independent T1 and T2 hypergeometric oracles', () => {
  const lands = [...Array(8).fill(landService.getLandSync('Plains')!), ...Array(2).fill(gate)]
  const t1 = result(lands, 1)
  expect(t1.status).toBe('exact')
  if (t1.status === 'exact') expect(t1.p2).toBeCloseTo(exactTail(40, 8, 8, 1), 11)
  const t2 = result(Array(10).fill(gate), 2)
  expect(t2.status).toBe('exact')
  if (t2.status === 'exact') expect(t2.p2).toBeCloseTo(exactTail(40, 10, 8, 1), 11)
})
it.each([
  { scryfallData: undefined },
  {
    scryfallData: {
      ...gate.scryfallData,
      oracleText: gate.scryfallData!.oracleText + '\nSacrifice a creature.',
    },
  },
  { produces: ['U'] },
  { etbBehavior: { type: 'always_untapped' } },
])('does not broaden unsupported utility lands or inconsistent metadata: %j', (override) => {
  expect(result([{ ...gate, ...override } as LandMetadata], 1).status).toBe('unsupported')
})

it('Scryfall modern wording is parsed as tapped before exact payment', async () => {
  const scryfall = await import('../../src/services/scryfall')
  const fixtures = await import('../fixtures/probability-recovery/limited.json')
  const card = fixtures.default.find((c) => c.name === 'Selesnya Guildgate')!
  const spy = vi.spyOn(scryfall, 'fetchLandData').mockResolvedValue(card as any)
  try {
    const parsed = await landService.detectLand(card.name)
    expect(parsed?.etbBehavior.type).toBe('always_tapped')
    expect(result([parsed!], 1)).toMatchObject({ status: 'exact', p2: 0 })
  } finally {
    spy.mockRestore()
  }
})
