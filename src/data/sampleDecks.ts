/**
 * Sample decks for Analyzer (?sample=key).
 * Totals must stay legal: limited=40, constructed=60, edh=100.
 */

export const SAMPLE_DECKS: Record<string, { name: string; list: string }> = {
  midrange: {
    name: "Nature's Rhythm (Midrange Combo)",
    list: `4 Llanowar Elves (FDN) 227
4 Gene Pollinator (EOE) 186
4 Spider Manifestation (SPM) 148
4 Badgermole Cub (TLA) 167
4 Nature's Rhythm (TDM) 150
4 Ouroboroid (EOE) 201
4 Brightglass Gearhulk (DFT) 191
2 Archdruid's Charm (MKM) 151
1 Craterhoof Behemoth (TDM) 138
1 Insidious Fungus (DSK) 186
1 Nurturing Pixie (OTJ) 20
1 Meltstrider's Resolve (EOE) 199
2 Seam Rip (EOE) 34
1 Soul-Guide Lantern (EOC) 143
3 Abandoned Air Temple (TLA) 263
4 Hushwood Verge (DSK) 261
4 Temple Garden (ECL) 268
2 Multiversal Passage (SPM) 180
2 Plains (FDN) 295
8 Forest (FDN) 291`,
  },
  aggro: {
    name: 'Mono-Red Aggro',
    list: `4 Heartfire Hero
4 Monstrous Rage
4 Emberheart Challenger
4 Manifold Mouse
4 Lightning Helix
4 Torch the Tower
3 Screaming Nemesis
3 Slickshot Show-Off
3 Hired Claw
2 Cori-Steel Cutter
2 Witchstalker Frenzy
19 Mountain
4 Mishra's Foundry`,
  },
  control: {
    name: 'Azorius Control',
    list: `4 Get Lost
4 Spell Pierce
3 Wedding Announcement
3 No More Lies
3 The Wandering Emperor
2 Sunfall
2 Elspeth, Sun's Champion
2 Siphon Insight
2 Portent of Calamity
2 Memory Deluge
1 Deduce
4 Meticulous Archive
4 Seachrome Coast
4 Restless Anchorage
4 Plains
4 Island
3 Floodfarm Verge
2 Brushland
2 Starting Town
2 Otawara, Soaring City
1 Eiganjo, Seat of the Empire
1 Otherworldly Gaze
1 Mirrex`,
  },
  // 40-card Selesnya Limited deck — representative draft/sealed shape:
  // 17 lands (≈42 % land ratio, higher than Constructed), 2-color fixing
  // via guild-gates, curve peaking T3-T4, lean removal + tricks.
  limited: {
    name: 'Selesnya Limited — 40-card Draft',
    list: `1 Llanowar Elves
1 Elvish Mystic
2 Scavenging Ooze
2 Elvish Visionary
1 Voice of Resurgence
1 Loxodon Smiter
1 Centaur Courser
1 Qasali Pridemage
2 Abzan Battle Priest
2 Dromoka's Command
2 Selesnya Charm
2 Wildsize
1 Path to Exile
1 Banishing Light
1 Collected Company
1 Sundering Growth
1 Oath of Nissa
2 Selesnya Guildgate
8 Plains
7 Forest`,
  },
  // 100-card Atraxa Superfriends / Proliferate — EDH: 38 lands-ish,
  // ramp + fixers, singleton constraint. Commander marked *CMDR*.
  edh: {
    name: "Atraxa, Praetors' Voice — Superfriends (Commander)",
    list: `1 Atraxa, Praetors' Voice *CMDR*
1 Sol Ring
1 Arcane Signet
1 Talisman of Progress
1 Talisman of Hierarchy
1 Talisman of Dominance
1 Chromatic Lantern
1 Cultivate
1 Kodama's Reach
1 Farseek
1 Nature's Lore
1 Three Visits
1 Rhystic Study
1 Mystic Remora
1 Esper Sentinel
1 Guardian Project
1 Beast Whisperer
1 Tezzeret's Gambit
1 Painful Truths
1 Swords to Plowshares
1 Path to Exile
1 Anguished Unmaking
1 Assassin's Trophy
1 Beast Within
1 Counterspell
1 Arcane Denial
1 Cyclonic Rift
1 Toxic Deluge
1 Damnation
1 Wrath of God
1 Supreme Verdict
1 Doubling Season
1 Parallel Lives
1 Hardened Scales
1 The Ozolith
1 Deepglow Skate
1 Evolution Sage
1 Flux Channeler
1 Contagion Engine
1 Vraska, Golgari Queen
1 Teferi, Master of Time
1 Narset, Parter of Veils
1 Elspeth, Sun's Champion
1 Jace, the Mind Sculptor
1 Tamiyo, Field Researcher
1 Nissa, Voice of Zendikar
1 Ajani, the Greathearted
1 Oko, Thief of Crowns
1 Teferi, Time Raveler
1 Oath of Teferi
1 Oath of Kaya
1 Oath of Gideon
1 Oath of Ajani
1 Sage of Hours
1 Spark Double
1 The Great Henge
1 Gideon, Ally of Zendikar
1 Command Tower
1 Exotic Orchard
1 Reflecting Pool
1 Mana Confluence
1 City of Brass
1 Reliquary Tower
1 Bojuka Bog
1 Urborg, Tomb of Yawgmoth
1 Hallowed Fountain
1 Breeding Pool
1 Overgrown Tomb
1 Watery Grave
1 Temple Garden
1 Godless Shrine
1 Fabled Passage
1 Flooded Strand
1 Misty Rainforest
1 Polluted Delta
1 Windswept Heath
1 Marsh Flats
1 Indatha Triome
1 Zagoth Triome
1 Raffine's Tower
1 Glacial Fortress
1 Drowned Catacomb
1 Woodland Cemetery
1 Sunpetal Grove
1 Hinterland Harbor
1 Isolated Chapel
4 Forest
3 Plains
3 Island
4 Swamp`,
  },
}

/** Sum of leading quantities on non-empty decklist lines. */
export function countDeckListCards(list: string): number {
  return list
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .reduce((sum, line) => {
      const m = line.match(/^(\d+)\s*x?\s+/i) || line.match(/^(.+)\s+x(\d+)$/i)
      if (!m) return sum
      if (m[2] && !/^\d/.test(line)) return sum + parseInt(m[2], 10)
      return sum + parseInt(m[1], 10)
    }, 0)
}

/** Expected legal totals per sample key (asserted in unit tests). */
export const SAMPLE_DECK_EXPECTED_TOTALS: Record<string, number> = {
  midrange: 60,
  aggro: 60,
  control: 60,
  limited: 40,
  edh: 100,
}
