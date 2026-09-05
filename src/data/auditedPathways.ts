import type { LandMetadata, LandManaColor } from '../types/lands'

// Closed Oracle contracts: docs/math/pathways-2026-09-05/card-sources.json.
const faces: Record<string, { other: string; color: LandManaColor }> = {
  'Barkchannel Pathway': { other: 'Tidechannel Pathway', color: 'G' },
  'Tidechannel Pathway': { other: 'Barkchannel Pathway', color: 'U' },
  'Blightstep Pathway': { other: 'Searstep Pathway', color: 'B' },
  'Searstep Pathway': { other: 'Blightstep Pathway', color: 'R' },
  'Branchloft Pathway': { other: 'Boulderloft Pathway', color: 'G' },
  'Boulderloft Pathway': { other: 'Branchloft Pathway', color: 'W' },
  'Brightclimb Pathway': { other: 'Grimclimb Pathway', color: 'W' },
  'Grimclimb Pathway': { other: 'Brightclimb Pathway', color: 'B' },
  'Clearwater Pathway': { other: 'Murkwater Pathway', color: 'U' },
  'Murkwater Pathway': { other: 'Clearwater Pathway', color: 'B' },
  'Cragcrown Pathway': { other: 'Timbercrown Pathway', color: 'R' },
  'Timbercrown Pathway': { other: 'Cragcrown Pathway', color: 'G' },
  'Darkbore Pathway': { other: 'Slitherbore Pathway', color: 'B' },
  'Slitherbore Pathway': { other: 'Darkbore Pathway', color: 'G' },
  'Hengegate Pathway': { other: 'Mistgate Pathway', color: 'W' },
  'Mistgate Pathway': { other: 'Hengegate Pathway', color: 'U' },
  'Needleverge Pathway': { other: 'Pillarverge Pathway', color: 'R' },
  'Pillarverge Pathway': { other: 'Needleverge Pathway', color: 'W' },
  'Riverglide Pathway': { other: 'Lavaglide Pathway', color: 'U' },
  'Lavaglide Pathway': { other: 'Riverglide Pathway', color: 'R' },
}

/** Both names and face metadata must agree with the closed, untapped one-mana contracts. */
export function auditedPathwayColors(land: LandMetadata): LandManaColor[] | null {
  const name = land.name.split(' // ')[0]
  const face = faces[name]
  if (
    !face ||
    land.category !== 'pathway' ||
    !land.isMDFC ||
    (land.name !== name && land.name !== `${name} // ${face.other}`) ||
    land.isCreatureLand ||
    land.hasChannel ||
    land.otherFace !== face.other ||
    land.isFetch ||
    land.producesAny ||
    land.producesAnyForCreaturesOnly ||
    (land.producesAmount ?? 1) !== 1 ||
    land.etbBehavior.type !== 'always_untapped' ||
    land.basicLandTypes?.length
  )
    return null
  const colors = [face.color, faces[face.other].color]
  // Seed metadata describes one face; Scryfall produced_mana may describe the union.
  if (!land.produces.includes(face.color) || land.produces.some((c) => !colors.includes(c)))
    return null
  return colors
}
