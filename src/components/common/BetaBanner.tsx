import CloseIcon from '@mui/icons-material/Close'
import FeedbackIcon from '@mui/icons-material/Feedback'
import { Alert, Box, Button, Container, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FEEDBACK_URL } from '../layout/Footer'

/** Bump this when a major release should re-show the banner after dismiss. */
const BANNER_KEY = 'manatuner-feedback-banner-dismissed-v1'

export const BetaBanner: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(BANNER_KEY) !== '1') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      localStorage.setItem(BANNER_KEY, '1')
    } catch {
      /* privacy / private mode — still hide for this session */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Box
      component="aside"
      role="region"
      aria-label="Feedback banner"
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'),
        borderBottom: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'),
        py: 0.5,
        position: 'relative',
        // Above the AppBar, but below drawers and modal dialogs.
        zIndex: (theme) => theme.zIndex.appBar + 1,
        pointerEvents: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          flexWrap="wrap"
          sx={{ position: 'relative', py: 0.25 }}
        >
          <Alert
            severity="info"
            icon={false}
            sx={{
              bgcolor: 'transparent',
              border: 'none',
              py: 0,
              px: 0.5,
              flex: '1 1 auto',
              minWidth: 0,
              justifyContent: 'center',
              '& .MuiAlert-message': {
                py: 0,
                px: 0,
                width: '100%',
                overflow: 'visible',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1.5}
              flexWrap="wrap"
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 'medium', fontSize: '0.8rem' }}
              >
                Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
              </Typography>

              {/* Real <a> Button — Chip+Link was not reliably navigable */}
              <Button
                component="a"
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<FeedbackIcon sx={{ fontSize: '1rem !important' }} />}
                aria-label="Give feedback — opens Tally form in a new tab"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  py: 0.25,
                  px: 1.25,
                  minHeight: 32,
                  borderWidth: 1.5,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 2,
                  textDecoration: 'none',
                  '&:hover': {
                    borderWidth: 1.5,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    textDecoration: 'none',
                  },
                }}
              >
                Give Feedback
              </Button>
            </Box>
          </Alert>

          <IconButton
            aria-label="Dismiss feedback banner"
            size="small"
            onClick={dismiss}
            sx={{
              color: 'text.secondary',
              flexShrink: 0,
              position: { xs: 'static', sm: 'absolute' },
              right: { sm: 0 },
              top: { sm: '50%' },
              transform: { sm: 'translateY(-50%)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  )
}
