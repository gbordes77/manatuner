import BarChartIcon from '@mui/icons-material/BarChart'
import BoltIcon from '@mui/icons-material/Bolt'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Box, CircularProgress, Tab, Tabs } from '@mui/material'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { AnalysisResult, DeckCard } from '../../services/deckAnalyzer'
import EnhancedRecommendations from '../EnhancedRecommendations'

import { computeAtRiskSpells } from '../../services/spellSummary'

// Lazy-load heavy Recharts components to reduce initial bundle size
const EnhancedCharts = React.lazy(() => import('../EnhancedCharts'))
const EnhancedSpellAnalysis = React.lazy(() => import('../EnhancedSpellAnalysis'))

// Loading fallback for lazy components
const ChartLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
    <CircularProgress size={40} />
  </Box>
)

interface AnalysisTabProps {
  analysisResult: AnalysisResult
  isMobile: boolean
  cards?: DeckCard[]
}

export const AnalysisTab: React.FC<AnalysisTabProps> = memo(
  ({ analysisResult, isMobile, cards }) => {
    const [subTab, setSubTab] = useState(0)
    const atRiskSpells = useMemo(() => computeAtRiskSpells(analysisResult), [analysisResult])

    return (
      <Box>
        {/* Sub-navigation */}
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
            },
          }}
        >
          <Tab
            icon={<BoltIcon />}
            iconPosition="start"
            label="Spells & Tempo"
            data-testid="analysis-subtab-spells"
          />
          <Tab
            icon={<BarChartIcon />}
            iconPosition="start"
            label="Probabilities"
            data-testid="analysis-subtab-probabilities"
          />
          <Tab
            icon={<LightbulbIcon />}
            iconPosition="start"
            label="Recommendations"
            data-testid="analysis-subtab-recommendations"
          />
        </Tabs>

        {/* Spells & Tempo */}
        {subTab === 0 && (
          <Suspense fallback={<ChartLoader />}>
            <EnhancedSpellAnalysis
              spellAnalysis={analysisResult.spellAnalysis}
              model={analysisResult.spellAnalysisModel}
              unsupportedSpellAnalysis={analysisResult.unsupportedSpellAnalysis}
              tempoSpellAnalysis={analysisResult.tempoSpellAnalysis}
              tempoImpactByColor={analysisResult.tempoImpactByColor}
            />
          </Suspense>
        )}

        {/* Probabilities */}
        {subTab === 1 && (
          <Suspense fallback={<ChartLoader />}>
            <EnhancedCharts
              cards={cards}
              analysis={{
                id: 'current-analysis',
                deckId: 'current-deck',
                format: 'modern',
                totalCards: analysisResult.totalCards,
                totalLands: analysisResult.totalLands,
                colorDistribution: analysisResult.colorDistribution,
                manaCurve: analysisResult.manaCurve,
                mulliganAnalysis: analysisResult.mulliganAnalysis,
                overallScore: Math.round(analysisResult.consistency * 100),
                consistency: Math.round(analysisResult.consistency * 100),
                atRiskSpells: atRiskSpells === null ? null : Math.round(atRiskSpells * 100),
                avgCMC: analysisResult.averageCMC,
                recommendations: [],
                probabilities: {
                  turn1: {
                    anyColor: analysisResult.probabilities.turn1.anyColor,
                    specificColors: analysisResult.probabilities.turn1.specificColors,
                    multipleColors: {},
                  },
                  turn2: {
                    anyColor: analysisResult.probabilities.turn2.anyColor,
                    specificColors: analysisResult.probabilities.turn2.specificColors,
                    multipleColors: {},
                  },
                  turn3: {
                    anyColor: analysisResult.probabilities.turn3.anyColor,
                    specificColors: analysisResult.probabilities.turn3.specificColors,
                    multipleColors: {},
                  },
                  turn4: {
                    anyColor: analysisResult.probabilities.turn4.anyColor,
                    specificColors: analysisResult.probabilities.turn4.specificColors,
                    multipleColors: {},
                  },
                  overall: {
                    consistency: analysisResult.consistency,
                    atRiskSpells,
                  },
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }}
            />
          </Suspense>
        )}

        {/* All Recommendations */}
        {subTab === 2 && (
          <EnhancedRecommendations
            recommendations={analysisResult.recommendations}
            analysis={{
              consistency: analysisResult.consistency,
              atRiskSpells,
              landRatio: analysisResult.landRatio,
              avgCMC: analysisResult.averageCMC,
            }}
          />
        )}
      </Box>
    )
  }
)
