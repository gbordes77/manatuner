import { Box, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import {
  AnalysisResult,
  countActiveWubrgFromSpells,
} from '../../services/deckAnalyzer'

interface ManabaseStatsProps {
  analysisResult: AnalysisResult
  isMobile: boolean
}

const safeNumber = (n: number | undefined | null, fallback = 0): number =>
  Number.isFinite(n as number) ? (n as number) : fallback

export const ManabaseStats: React.FC<ManabaseStatsProps> = ({ analysisResult, isMobile }) => {
  const landRatio = safeNumber(analysisResult.landRatio)
  const averageCMC = safeNumber(analysisResult.averageCMC)
  return (
    <Paper sx={{ p: isMobile ? 2 : 3 }}>
      <Typography
        variant={isMobile ? 'body1' : 'h6'}
        gutterBottom
        sx={{
          fontSize: isMobile ? '1rem' : undefined,
          fontWeight: 'bold',
        }}
      >
        Manabase Statistics
      </Typography>

      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={6} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              color="primary"
              sx={{ fontSize: isMobile ? '1.2rem' : undefined }}
            >
              {analysisResult.totalLands}
            </Typography>
            <Typography
              variant={isMobile ? 'caption' : 'body2'}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
            >
              Total Lands
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              color="primary"
              sx={{ fontSize: isMobile ? '1.2rem' : undefined }}
            >
              {(landRatio * 100).toFixed(1)}%
            </Typography>
            <Typography
              variant={isMobile ? 'caption' : 'body2'}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
            >
              Land Ratio
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              color="primary"
              sx={{ fontSize: isMobile ? '1.2rem' : undefined }}
            >
              {
                // Main spell identity is distinct from mandatory payment colors.
                countActiveWubrgFromSpells(
                  analysisResult.cards.filter((card) => !card.isSideboard && !card.isCommander)
                )
              }
            </Typography>
            <Typography
              variant={isMobile ? 'caption' : 'body2'}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
            >
              Spell Colors (Identity)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              color="primary"
              sx={{ fontSize: isMobile ? '1.2rem' : undefined }}
            >
              {averageCMC.toFixed(1)}
            </Typography>
            <Typography
              variant={isMobile ? 'caption' : 'body2'}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
            >
              Average CMC
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
