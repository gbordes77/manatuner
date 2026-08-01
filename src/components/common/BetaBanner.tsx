import CloseIcon from '@mui/icons-material/Close'
import FeedbackIcon from '@mui/icons-material/Feedback'
import { Alert, Box, Chip, Container, IconButton, Link, Typography } from '@mui/material'
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

  const dismiss = () => {
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
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'),
        borderBottom: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'),
        py: 0.25,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Alert
          severity="info"
          onClose={dismiss}
          closeText="Dismiss feedback banner"
          sx={{
            bgcolor: 'transparent',
            border: 'none',
            py: 0.25,
            px: 0.5,
            minHeight: 'auto',
            alignItems: 'center',
            '& .MuiAlert-message': {
              py: 0,
              px: 0,
              width: '100%',
            },
            '& .MuiAlert-action': {
              pt: 0,
              pr: 0.5,
              alignItems: 'center',
            },
          }}
          icon={false}
          action={
            <IconButton
              aria-label="Dismiss feedback banner"
              size="small"
              onClick={dismiss}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} flexWrap="wrap">
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: 'medium', fontSize: '0.8rem' }}
            >
              Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
            </Typography>
            <Chip
              icon={<FeedbackIcon />}
              label="Give Feedback"
              variant="outlined"
              size="small"
              clickable
              component={Link}
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                height: '22px',
                fontSize: '0.75rem',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  fontSize: '0.85rem',
                },
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            />
          </Box>
        </Alert>
      </Container>
    </Box>
  )
}
