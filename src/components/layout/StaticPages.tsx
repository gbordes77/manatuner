import AnalyticsIcon from '@mui/icons-material/Analytics'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CasinoIcon from '@mui/icons-material/Casino'
import FunctionsIcon from '@mui/icons-material/Functions'
import GitHubIcon from '@mui/icons-material/GitHub'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatedContainer } from '../common/AnimatedContainer'
import { FloatingManaSymbols } from '../common/FloatingManaSymbols'
import { SEO } from '../common/SEO'

export const AboutPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <ShowChartIcon sx={{ fontSize: 32 }} />,
      title: 'Frank Karsten Mathematics',
      description: 'Built on the foundational research of Pro Tour Hall of Famer Frank Karsten.',
      color: '#4caf50',
    },
    {
      icon: <CasinoIcon sx={{ fontSize: 32 }} />,
      title: 'Monte Carlo Simulation',
      description: '10,000 hand simulations for accurate mulligan decisions.',
      color: '#9c27b0',
    },
    {
      icon: <FunctionsIcon sx={{ fontSize: 32 }} />,
      title: 'Bellman Equation',
      description: 'Optimal stopping theory for mathematically perfect keep/mulligan thresholds.',
      color: '#ff9800',
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <SEO
        title="About ManaTuner - Open Source MTG Mana Base Tool"
        description="ManaTuner is a free, open source MTG mana base analyzer built on Frank Karsten's research, hypergeometric math, Monte Carlo simulation, and Bellman equations."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'AboutPage',
              '@id': 'https://www.manatuner.app/about#webpage',
              url: 'https://www.manatuner.app/about',
              name: 'About ManaTuner',
              description:
                "ManaTuner is a free, open source MTG mana base analyzer built on Frank Karsten's research, hypergeometric math, Monte Carlo simulation, and Bellman equations.",
              about: { '@id': 'https://www.manatuner.app/#software' },
              mainEntity: { '@id': 'https://www.manatuner.app/#author' },
            },
            {
              '@type': 'Person',
              '@id': 'https://www.manatuner.app/#author',
              name: 'Guillaume Bordes',
              url: 'https://github.com/gbordes77',
              sameAs: ['https://github.com/gbordes77'],
              knowsAbout: [
                'Magic: The Gathering',
                'Hypergeometric distribution',
                'Monte Carlo simulation',
                'Optimal stopping theory',
                'React',
                'TypeScript',
              ],
              worksFor: { '@id': 'https://www.manatuner.app/#organization' },
            },
            {
              '@type': 'Organization',
              '@id': 'https://www.manatuner.app/#organization',
              name: 'ManaTuner',
              url: 'https://www.manatuner.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.manatuner.app/favicon.svg',
              },
              sameAs: ['https://github.com/gbordes77/manatuner'],
              founder: { '@id': 'https://www.manatuner.app/#author' },
            },
          ],
        }}
      />
      {/* Floating mana symbols background */}
      <FloatingManaSymbols />

      {/* Hero Section */}
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
            About ManaTuner
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
            Professional manabase analysis for competitive Magic: The Gathering
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="Free & Open Source"
              sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
            />
            <Chip
              label="Local calculations"
              sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }}
            />
            <Chip
              label="No Account Required"
              sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600 }}
            />
          </Box>
        </Box>
      </AnimatedContainer>

      {/* Mission Section */}
      <Paper
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: '2px solid #1976d2',
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ color: '#1565c0', mb: 2 }}>
          🎯 Our Mission
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          ManaTuner is a comprehensive manabase analysis tool for Magic: The Gathering, meticulously
          crafted to provide tournament-level insights for competitive players and deck builders. We
          believe every player deserves access to the same mathematical tools used by professional
          players.
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight={700}
          sx={{ textAlign: 'center', mb: 4 }}
        >
          Built on Proven Mathematics
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <AnimatedContainer animation="fadeInUp" delay={index * 0.1}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: feature.color,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 40px ${feature.color}30`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Origin Story */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              bgcolor: '#e8f5e9',
              border: '2px solid #4caf50',
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: '#2e7d32', mb: 2 }}>
              📊 Built on Research
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              Our analysis algorithms are based on <strong>Frank Karsten's</strong> groundbreaking
              mathematical research on mana probability and deck construction theory, combined with
              hypergeometric distribution and Monte Carlo methods.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              bgcolor: '#f3e5f5',
              border: '2px solid #9c27b0',
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: '#7b1fa2', mb: 2 }}>
              🙏 Special Thanks
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              Inspired by <strong>Charles Wickham's</strong> pioneering{' '}
              <a
                href="https://project-manabase.firebaseapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#7b1fa2', textDecoration: 'underline' }}
              >
                Project Manabase
              </a>
              . ManaTuner extends his vision with Monte Carlo simulations, Bellman equation
              optimization, and a modern UI. Thank you Charles for lighting the path! 🔥
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* What Makes Us Different */}
      <Paper
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          border: '2px solid #ff9800',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ color: '#e65100', mb: 2 }}>
          ⚡ What Makes Us Different
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
          We combine proven mathematical foundations with modern web technology to deliver real-time
          manabase optimization, interactive visualizations, and actionable recommendations that
          help you build better, more consistent decks.
        </Typography>
      </Paper>

      {/* Links Section */}
      <Box sx={{ mb: 5 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GitHubIcon />}
              href="https://github.com/gbordes77/manatuner"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 2,
                borderRadius: 3,
                borderWidth: 2,
                fontWeight: 600,
                '&:hover': { borderWidth: 2 },
              }}
            >
              View on GitHub
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Final CTA */}
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
          <Typography variant="h4" component="h2" fontWeight={700}>
            Ready to Optimize?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
            Try ManaTuner free — no account required
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/analyzer')}
          startIcon={<AnalyticsIcon />}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
            bgcolor: 'white',
            color: '#1976d2',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Start Analyzing
        </Button>
      </Paper>
    </Container>
  )
}

export const PrivacyPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <SEO
      title="Privacy Policy | ManaTuner"
      description="How ManaTuner stores analyses locally, uses Scryfall and external fonts, and handles deletion, sharing and optional error monitoring."
      path="/privacy"
    />
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Privacy Policy
      </Typography>
    </Box>
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
        Calculations and saved analyses
      </Typography>
      <Typography paragraph>
        ManaTuner calculates results in your browser and saves analyses on this device. No account
        is required. This does not mean the site makes no network requests.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
        External services
      </Typography>
      <Typography paragraph>
        Card lookups send card names, identifiers or search terms to api.scryfall.com to retrieve
        card rules and metadata, including during analysis and card-image lookup. Card images load
        from cards.scryfall.io. These requests can reveal which cards you are looking up; the analysis
        result and saved history are not uploaded by these lookups. Local caches reduce repeat requests.
      </Typography>
      <Typography paragraph>
        Google Fonts (fonts.googleapis.com and fonts.gstatic.com) supplies the display font.
        jsDelivr (cdn.jsdelivr.net) supplies the mana-symbol stylesheet and font. The page also
        preconnects to Scryfall. The site host and external services receive connection information
        such as your IP address and browser request metadata. Their retention practices are not
        controlled by the local Reset button. Loading the site is therefore not fully offline.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
        Browser storage and deletion
      </Typography>
      <Typography paragraph>
        Local storage holds saved analyses, the current deck, preferences and library progress until
        you delete them or your browser clears them. Public card metadata is cached in IndexedDB
        (30 days), land metadata in local storage (30 days), and mana-producer metadata in local
        storage (7 days). Expiration is checked when caches are read; it is not a scheduled erasure.
        Session storage holds temporary navigation and recovery flags for the browser session.
      </Typography>
      <Typography paragraph>
        Reset requests deletion of ManaTuner local and session storage and asynchronously clears its
        IndexedDB cache. This is best effort if browser storage is blocked; it does not verify every
        deletion. Reload after resetting to release in-memory caches. For a broader cleanup, use your
        browser’s site-data controls. Reset does not delete exported files, shared links, browser
        history, third-party logs or copies on other devices. Export a backup first if needed; browser
        storage can also be lost in private browsing or when site data is cleared.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
        Sharing
      </Typography>
      <Typography paragraph>
        Share links encode the deck in the URL fragment. Anyone with the link can recover the deck.
        Copying or sending a link or an exported backup discloses it to its recipients; deleting the
        local analysis does not revoke those copies. Legacy links can contain deck data in the URL
        query, which may reach the hosting service and its logs.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
        Optional error monitoring
      </Typography>
      <Typography paragraph>
        {import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN
          ? 'The Sentry SDK is configured in this build. Delivery depends on network access and the site’s Content Security Policy; configuration alone does not confirm that events are received.'
          : 'Error monitoring is disabled in this build. Sentry initializes only in a production build with a configured DSN.'}
        {' '}There is no session replay configured. The application does not configure audience analytics.
      </Typography>
      <Typography paragraph>
        Before enabling Sentry, the operator must review the actual event payloads with non-sensitive
        fixtures, confirm redaction and retention, verify the permitted monitoring destination in the Content Security Policy, determine the required information and user controls
        with a competent reviewer, and update this policy. Redaction is a safeguard, not a guarantee
        that arbitrary error text contains no sensitive data. This technical description does not
        constitute a declaration of legal compliance.
      </Typography>
    </Paper>
  </Container>
)
