import {
  KARSTEN_REFERENCE_TABLE,
  KARSTEN_REFERENCE_URL,
  KARSTEN_UU_REFERENCE,
  KARSTEN_REFERENCE_SCOPE,
  KARSTEN_MULLIGAN_POLICY,
} from '../data/karstenReference'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalculateIcon from '@mui/icons-material/Calculate'
import CasinoIcon from '@mui/icons-material/Casino'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FunctionsIcon from '@mui/icons-material/Functions'
import ScienceIcon from '@mui/icons-material/Science'
import TimelineIcon from '@mui/icons-material/Timeline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatedContainer } from '../components/common/AnimatedContainer'
import { FloatingManaSymbols } from '../components/common/FloatingManaSymbols'
import { SEO } from '../components/common/SEO'

const MathematicsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <SEO
        title="MTG Manabase Math — Hypergeometric, Karsten, Bellman | ManaTuner"
        description="Understand default mana estimates, supported exact goldfish potential, saved comparisons and heuristic mulligan thresholds, with formulas and research references."
        path="/mathematics"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'The Mathematics Behind MTG Mana Base Optimization',
          description:
            "Hypergeometric distribution, Monte Carlo simulation, and the Bellman equation applied to Magic: The Gathering mana base analysis — based on Frank Karsten's research.",
          image: 'https://www.manatuner.app/og-image-v3.jpg',
          datePublished: '2025-10-01',
          dateModified: '2026-04-13',
          author: {
            '@type': 'Person',
            name: 'Guillaume Bordes',
            url: 'https://github.com/gbordes77',
            sameAs: ['https://github.com/gbordes77'],
          },
          publisher: {
            '@type': 'Organization',
            name: 'ManaTuner',
            url: 'https://www.manatuner.app',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.manatuner.app/favicon.svg',
            },
          },
          mainEntityOfPage: 'https://www.manatuner.app/mathematics',
          citation: [
            {
              '@type': 'ScholarlyArticle',
              name: 'How Many Sources Do You Need to Consistently Cast Your Spells?',
              author: 'Frank Karsten',
              datePublished: '2022',
              publisher: 'ChannelFireball',
              url: 'https://strategy.channelfireball.com/all-strategy/mtg/channelmagic-articles/how-many-lands-do-you-need-to-consistently-hit-your-land-drops/',
            },
          ],
          about: [
            { '@type': 'Thing', name: 'Hypergeometric distribution' },
            { '@type': 'Thing', name: 'Monte Carlo simulation' },
            { '@type': 'Thing', name: 'Bellman equation' },
            { '@type': 'Thing', name: 'Magic: The Gathering manabase' },
          ],
          keywords:
            'mtg mana calculator, hypergeometric distribution, Frank Karsten, Monte Carlo simulation, Bellman equation, mana base probability',
        }}
      />
      <FloatingManaSymbols />

      {/* ================================================================
          SECTION 1 — Hero: Start with the PROBLEM, not the math
          ================================================================ */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Castability opens in Mana estimates by default. Exact goldfish potential is a separate mode
        with a restricted model. Both exclude mulligans and the chance of drawing the target spell;
        neither is conditioned on a hand you entered. Saved comparisons use their own fixed
        lands-only snapshot, described below.
      </Alert>
      <AnimatedContainer animation="fadeInUp">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #9c27b0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Mathematics Behind ManaTuner
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
            Casting your spells on curve isn't luck — it's probability. ManaTuner uses rigorous math
            to estimate what your mana base can deliver.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<FunctionsIcon />}
              label="Exact Draw Probabilities"
              sx={{
                bgcolor: '#e3f2fd',
                '& .MuiTypography-root': { color: 'inherit' },
                color: '#1565c0',
                fontWeight: 600,
              }}
            />
            <Chip
              icon={<CasinoIcon />}
              label="10,000 Simulations"
              sx={{
                bgcolor: '#f3e5f5',
                '& .MuiTypography-root': { color: 'inherit' },
                color: '#7b1fa2',
                fontWeight: 600,
              }}
            />
            <Chip
              icon={<TrendingUpIcon />}
              label="Pro-Level Research"
              sx={{
                bgcolor: '#fff3e0',
                '& .MuiTypography-root': { color: 'inherit' },
                color: '#a83b00',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </AnimatedContainer>

      {/* ================================================================
          SECTION 2 — The Two Questions every deckbuilder faces
          ================================================================ */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AnimatedContainer animation="fadeInUp" delay={0}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  border: '2px solid #1976d2',
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <FunctionsIcon sx={{ color: '#0d47a1', fontSize: 32 }} />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#0d47a1'),
                    }}
                  >
                    How Many Lands?
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Land count changes your chance of hitting land drops on curve. No land count
                  guarantees the right draws every game.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ManaTuner calculates</strong> an estimate of having enough mana each turn,
                  based on your curve.
                </Typography>
              </Paper>
            </AnimatedContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedContainer animation="fadeInUp" delay={0.1}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  border: '2px solid #4caf50',
                  bgcolor: 'rgba(76, 175, 80, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#1b5e20', fontSize: 32 }} />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: (theme) => (theme.palette.mode === 'dark' ? '#a5d6a7' : '#1b5e20'),
                    }}
                  >
                    How Many Sources per Color?
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Having enough lands is only half the puzzle. You need the <em>right colors</em> at
                  the right time. {KARSTEN_UU_REFERENCE}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ManaTuner tells you</strong> source-count guidelines for each color your
                  deck needs under the published assumptions.
                </Typography>
              </Paper>
            </AnimatedContainer>
          </Grid>
        </Grid>
      </Box>

      <Alert severity="warning" sx={{ mb: 4 }}>
        Exact hypergeometric draws do not make every casting estimate exact. Mana estimates
        approximate source overlap and sequencing; exact mode refuses unsupported cases or those
        exceeding its calculation budget. Mulligan thresholds optimize a heuristic score, not win
        rate.
      </Alert>
      {/* ================================================================
          SECTION 3 — Three Engines, Three Questions
          The best section from the old page, kept and promoted
          ================================================================ */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
          >
            How It Works
          </Typography>
          <Typography variant="h4" component="h2" fontWeight={700} color="text.primary">
            <CompareArrowsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Three Engines, Three Questions
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mt: 1 }}
          >
            ManaTuner uses three mathematical models. Each answers a different question about your
            deck.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              tab: 'Castability Tab',
              engine: 'Estimates or supported exact goldfish',
              icon: <FunctionsIcon sx={{ fontSize: 32 }} />,
              question: 'Can I cast this spell on curve?',
              detail:
                'Mana estimates approximate mana availability. Exact goldfish potential checks whether at least one legal sequence exists within its supported model, with foresight of the drawn history. Both assume the target spell is available.',
              color: '#0d47a1',
              bgColor: '#e3f2fd',
              example:
                'Compare the same spell, target turn and settings before interpreting a change.',
            },
            {
              tab: 'Recommendations',
              engine: "Frank Karsten's Research",
              icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
              question: 'How many sources do I need?',
              detail:
                "Based on Frank Karsten's published simulations: targets are conditional on enough lands after London mulligans, at 89 + mana value percent (90–96% for published turns). These are deckbuilding guidelines.",
              color: '#1b5e20',
              bgColor: '#e8f5e9',
              example: 'For a two-mana spell, the published conditional target is 91%.',
            },
            {
              tab: 'Mulligan Tab',
              engine: 'Monte Carlo + Bellman Equation',
              icon: <CasinoIcon sx={{ fontSize: 32 }} />,
              question: 'Should I keep or mulligan?',
              detail:
                'By default, 10,000 sampled hands per kept-hand size from your main deck. Bellman recursion calculates keep thresholds for the selected archetype’s heuristic hand score, not a win probability.',
              color: '#9c27b0',
              bgColor: '#f3e5f5',
              example:
                'Duel: compare keeping seven with a redraw followed by bottoming one. Multiplayer may allow a free first redraw.',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <AnimatedContainer animation="fadeInUp" delay={index * 0.1}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: item.color,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: item.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Chip
                          label={item.tab}
                          size="small"
                          sx={{ fontWeight: 700, bgcolor: item.bgColor, color: item.color }}
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                          {item.engine}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      "{item.question}"
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ flexGrow: 1 }}
                    >
                      {item.detail}
                    </Typography>
                    <Paper sx={{ p: 1.5, bgcolor: item.bgColor, borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight={600} color={item.color}>
                        {item.example}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          SECTION 4 — The FAQ everyone has (promoted from yellow callout)
          ================================================================ */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 3,
          bgcolor: '#fff8e1',
          color: '#263238',
          '& .MuiTypography-root': { color: 'inherit' },
          border: '2px solid #ffc107',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#a83b00" gutterBottom>
          Why do castability estimates differ from Karsten targets?
        </Typography>
        <Typography variant="body1" paragraph>
          The calculation and the reference table measure different events:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#0d47a1') }}
                gutterBottom
              >
                Mana estimates: mana available without mulligans
              </Typography>
              <Typography variant="body2">
                This estimates mana availability from the opening hand and draws through the target
                turn. It assumes the spell is available and applies no mulligan policy. In Estimate
                mode, color, tempo and acceleration calculations include approximations.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#a5d6a7' : '#1b5e20') }}
                gutterBottom
              >
                Karsten: conditional color consistency
              </Typography>
              <Typography variant="body2">
                The published model applies a specified London mulligan policy and conditions on
                drawing enough lands. Its target is 89% plus the mana value in percentage points
                (91% for a two-mana spell). This is a different probability.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          sx={{ mt: 2, fontWeight: 600, color: '#a83b00', textAlign: 'center' }}
        >
          A conditional source target cannot be compared directly with unconditional castability.
        </Typography>
      </Paper>

      {/* ================================================================
          SECTION 5 — Estimate, Exact and saved snapshot contracts
          ================================================================ */}
      <Box id="probabilities" sx={{ mb: 6, scrollMarginTop: '80px' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
          >
            Castability Tab
          </Typography>
          <Typography variant="h4" component="h2" fontWeight={700} color="text.primary">
            Two Ways to Read Your Odds
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '2px solid #4caf50' }}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#a5d6a7' : '#1b5e20') }}
              >
                Mana estimates (default)
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Event:</strong> estimated mana availability from random opening hands and
                draws through the target turn, assuming the spell is already available.
              </Typography>
              <Typography variant="body2" paragraph>
                Realistic includes land-draw uncertainty. Perfect drops conditions on having enough
                lands. Source overlap, color payments and ramp sequencing are approximated using the
                selected ramp and removal settings.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                These are two views within Estimate mode, not the choice between Estimate and Exact.
                Neither evaluates your specific observed hand or includes mulligans.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '2px solid #2196f3' }}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#0d47a1') }}
              >
                Exact goldfish potential (supported cases)
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Event:</strong> at least one legal mana sequence can pay the cost by the
                target turn under the represented resource model. Choices can use the full drawn
                history, so this is an upper bound for play without foresight.
              </Typography>
              <Typography variant="body2" paragraph>
                This mode uses 0% removal and 100% ramp survival, regardless of Estimate settings.
                It excludes mulligans and drawing the target spell. Unsupported mechanics or a
                calculation exceeding the budget produce no percentage, not 0%.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Link href="/analyzer?sample=exact">Try the basic-land exact example</Link>: 24
                Plains and 36 Savannah Lions. This is a synthetic test fixture, not a legal
                tournament decklist.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#e8f5e9',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Saved Analysis, Compare and exports: a fixed snapshot
              </Typography>
              <Typography variant="body2">
                Saved per-spell probabilities use physical-v1 lands-only potential, on the play,
                with no mulligans or ramp and X=2. They exclude drawing the target spell and refuse
                unsupported mechanics. They do not reproduce the interactive Castability settings.
                Compare only calculated rows under this shared contract; unavailable values are not
                zero. Health, Blueprint and Mulligan scores are separate heuristic indices.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ================================================================
          SECTION 6 — Deep Dive (for David and advanced players)
          All accordions collapsed by default — opt-in depth
          ================================================================ */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
          >
            For the Curious
          </Typography>
          <Typography variant="h4" component="h2" fontWeight={700} color="text.primary">
            <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            The Math Under the Hood
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mt: 1 }}
          >
            You don't need to understand any of this to use ManaTuner — but if you're curious,
            here's exactly how it works.
          </Typography>
        </Box>

        {/* Hypergeometric */}
        <Accordion
          sx={{
            borderRadius: '12px !important',
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e3f2fd',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#e3f2fd',
                  '& .MuiTypography-root': { color: 'inherit' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d47a1',
                }}
              >
                <FunctionsIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Hypergeometric Distribution
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  The core formula behind castability
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Imagine a bag with 60 marbles: 14 red and 46 other colors. You grab 7 at random. What
              are the odds you got at least one red? That's what the hypergeometric distribution
              calculates — except the "marbles" are your cards and the "red" ones are your mana
              sources.
            </Typography>

            <Paper
              sx={{
                p: 3,
                my: 3,
                borderRadius: 2,
                bgcolor: '#e3f2fd',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
                textAlign: 'center',
              }}
            >
              <Typography variant="overline" color="#1565c0" fontWeight={700}>
                The Formula
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'monospace', color: '#1565c0', fontWeight: 700 }}
              >
                P(X = k) = C(K,k) × C(N-K,n-k) / C(N,n)
              </Typography>
            </Paper>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                { var: 'N', desc: 'Cards in deck (60)', example: '60' },
                { var: 'K', desc: 'Mana sources you have', example: '14 red sources' },
                { var: 'n', desc: "Cards you've seen", example: '7 (opening hand)' },
                { var: 'k', desc: 'Sources you need', example: '1 red source' },
              ].map((item, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="primary"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {item.var}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {item.desc}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontStyle="italic">
                      {item.example}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper
              sx={{
                p: 2,
                bgcolor: '#e8f5e9',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#2e7d32">
                <strong>Concrete example:</strong> 14 red sources in a 60-card deck, opening hand of
                7 cards. Probability of at least 1 red source = <strong>86.1%</strong>. That means
                roughly 1 in 7 opening hands contain no red source. This draw event differs from
                Karsten’s conditional casting target with its stated mulligan policy.
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Monte Carlo */}
        <Accordion
          sx={{
            borderRadius: '12px !important',
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #f3e5f5',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#f3e5f5',
                  '& .MuiTypography-root': { color: 'inherit' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9c27b0',
                }}
              >
                <CasinoIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Monte Carlo Simulation
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  10,000 samples per kept-hand size
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              The simulator samples 10,000 hands for each kept-hand size from four to seven by
              default. It shuffles the main deck, draws seven, chooses a heuristic subset, and
              evaluates opening-hand quality. Bellman recursion compares keeping with another
              mulligan; this is not a simulation of complete games or win rate.
            </Typography>

            <Grid container spacing={2} sx={{ my: 2 }}>
              {[
                {
                  step: '1',
                  title: 'Shuffle',
                  text: 'Your main-deck cards are randomly shuffled using an unbiased algorithm (Fisher-Yates)',
                },
                {
                  step: '2',
                  title: 'Draw & Decide',
                  text: 'Draw seven, then select a heuristic subset for the kept-hand size.',
                },
                {
                  step: '3',
                  title: 'Score & Compare',
                  text: 'Score first-turn plans under the stated model; compare sampled keep and mulligan values.',
                },
              ].map((item, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '2px solid #f3e5f5',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#9c27b0"
                      sx={{ fontFamily: 'monospace', mb: 0.5 }}
                    >
                      {item.step}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper
              sx={{
                p: 2,
                bgcolor: '#f3e5f5',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#7b1fa2">
                <strong>Why both?</strong> The hypergeometric formula gives exact draw probabilities
                under sampling without replacement. Monte Carlo can check simple draw events against
                those answers. Mulligan results additionally depend on the reward model and sampling
                uncertainty; this does not establish the accuracy of every castability estimate.
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Frank Karsten */}
        <Accordion
          sx={{
            borderRadius: '12px !important',
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e8f5e9',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#e8f5e9',
                  '& .MuiTypography-root': { color: 'inherit' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1b5e20',
                }}
              >
                <TrendingUpIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Frank Karsten's Research
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  The gold standard for mana base construction
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Frank Karsten is a <strong>Magic Pro Tour Hall of Famer</strong> and PhD
              mathematician. His{' '}
              <Link
                href={KARSTEN_REFERENCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600 }}
              >
                2022 research
              </Link>{' '}
              provides this reference for 60 cards with 25 lands. {KARSTEN_REFERENCE_SCOPE}
            </Typography>

            <TableContainer component={Paper} sx={{ my: 3, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#e8f5e9',
                      color: '#263238',
                      '& .MuiTypography-root': { color: 'inherit' },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={700}>Mana Cost</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700}>Turn 1</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700}>Turn 2</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700}>Turn 3</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700}>Turn 4</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {KARSTEN_REFERENCE_TABLE.map((row, i) => (
                    <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{row.cost}</TableCell>
                      <TableCell align="center">
                        <Chip label={row.t1} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={row.t2} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={row.t3} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={row.t4} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="body2" color="text.secondary">
              <strong>How to read this:</strong> {KARSTEN_UU_REFERENCE}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {KARSTEN_MULLIGAN_POLICY}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The table is a color-consistency reference, not a guarantee of land drops or a
              recommendation to remove a particular spell. ManaTuner’s default no-mulligan estimate
              answers a different question.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Bellman Equation */}
        <Accordion
          sx={{
            borderRadius: '12px !important',
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #fff3e0',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#fff3e0',
                  '& .MuiTypography-root': { color: 'inherit' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a83b00',
                }}
              >
                <CalculateIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Bellman Equation (Mulligan Math)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Optimal stopping theory for keep/mulligan decisions
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              The hardest question in a game of Magic: "Is this hand good enough, or should I
              mulligan and risk getting a worse 6-card hand?" Bellman recursion compares keeping
              with continuing under the chosen reward model. Here that reward is a heuristic hand
              score.
            </Typography>
            <Typography variant="body1" paragraph>
              It works backwards from a forced keep at four cards, then computes the continuation
              values for five, six and seven cards using sampled hand scores. The recursion is exact
              for those sample distributions; the scores are not win probabilities.
            </Typography>

            <Paper
              sx={{
                p: 3,
                my: 3,
                borderRadius: 2,
                bgcolor: '#fff3e0',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
                textAlign: 'center',
              }}
            >
              <Typography variant="overline" color="#a83b00" fontWeight={700}>
                The Logic
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'monospace', color: '#a83b00', fontWeight: 700 }}
              >
                Keep if hand score {'>'} continuation value
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The continuation value includes later redraws. London redraws seven, then bottoms
                cards for counted mulligans; a free multiplayer redraw keeps seven.
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                bgcolor: '#fff3e0',
                color: '#263238',
                '& .MuiTypography-root': { color: 'inherit' },
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#a83b00">
                <strong>In practice:</strong> ManaTuner samples 10,000 hands per kept-hand size by
                default and derives thresholds from the selected archetype’s scores. A keep or
                mulligan indication applies to that heuristic model, not to all strategic factors in
                a real game.
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* ================================================================
          SECTION 7 — Practical cheat sheet
          ================================================================ */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
          >
            Quick Reference
          </Typography>
          <Typography variant="h4" component="h2" fontWeight={700} color="text.primary">
            Rules of Thumb
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #1976d2' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#0d47a1') }}
                  gutterBottom
                >
                  <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                  Land Count by Archetype
                </Typography>
                <Typography variant="body2" paragraph>
                  How many lands you need depends on your average mana cost and game plan:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="Aggro: 18-22"
                    size="small"
                    sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 600 }}
                  />
                  <Chip
                    label="Midrange: 22-26"
                    size="small"
                    sx={{
                      bgcolor: '#fff3e0',
                      '& .MuiTypography-root': { color: 'inherit' },
                      color: '#a83b00',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="Control: 26-28"
                    size="small"
                    sx={{
                      bgcolor: '#e3f2fd',
                      '& .MuiTypography-root': { color: 'inherit' },
                      color: '#1565c0',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #9c27b0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#ce93d8' : '#9c27b0') }}
                  gutterBottom
                >
                  <FunctionsIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                  Color Sources Needed
                </Typography>
                <Typography variant="body2" paragraph>
                  Published 60-card targets under Karsten's conditional model:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="1 pip on T1: 14"
                    size="small"
                    sx={{
                      bgcolor: '#f3e5f5',
                      color: '#263238',
                      '& .MuiTypography-root': { color: 'inherit' },
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="2 pips on T2: 21"
                    size="small"
                    sx={{
                      bgcolor: '#f3e5f5',
                      color: '#263238',
                      '& .MuiTypography-root': { color: 'inherit' },
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="3 pips on T3: 23"
                    size="small"
                    sx={{
                      bgcolor: '#f3e5f5',
                      color: '#263238',
                      '& .MuiTypography-root': { color: 'inherit' },
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* ================================================================
          Cross-links + CTA
          ================================================================ */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={() => navigate('/guide')} sx={{ borderRadius: 3 }}>
          Read the User Guide
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/land-glossary')}
          sx={{ borderRadius: 3 }}
        >
          Land Type Glossary
        </Button>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #9c27b0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
          boxShadow: '0 16px 48px rgba(25, 118, 210, 0.3)',
        }}
      >
        <Box>
          <Typography variant="h4" component="h2" fontWeight={700} color="inherit">
            Ready to Fix Your Mana?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
            Paste your decklist and get instant analysis backed by real math.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/analyzer')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
            bgcolor: 'white',
            color: '#0d47a1',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Analyze Your Deck
        </Button>
      </Paper>
    </Container>
  )
}

export default MathematicsPage
