import { useTheme } from '@mui/material/styles'
import React, { useCallback, useEffect, useState } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'

export const ONBOARDING_KEY = 'manatuner-onboarding-completed'

const steps: Step[] = [
  {
    target: 'textarea[placeholder*="Paste your decklist"]',
    content: 'Paste your MTG decklist here. Supports MTGA, Moxfield, and TappedOut formats.',
    disableBeacon: true,
    placement: 'bottom',
    spotlightClicks: true,
  },
  {
    target: 'button[class*="MuiButton"][class*="contained"]',
    content: 'Click "Analyze Manabase" to run Frank Karsten\'s mathematical analysis on your deck.',
    placement: 'bottom',
    spotlightClicks: true,
  },
  {
    target: '[data-testid="analysis-results"]',
    content:
      'Your analysis results will appear here with tabs: Castability, Mulligan, Analysis, Manabase, and Blueprint.',
    placement: 'left',
    isFixed: true,
    spotlightClicks: true,
  },
]

// Steps simplifiés pour avant l'analyse (seulement les 2 premiers)
const preAnalysisSteps: Step[] = [
  {
    target: 'textarea[placeholder*="Paste your decklist"]',
    content: 'Welcome to ManaTuner! Paste your MTG decklist here — or click Try Example anytime.',
    disableBeacon: true,
    placement: 'bottom',
    title: '📝 Step 1: Your Deck',
    spotlightClicks: true,
  },
  {
    target: 'button[class*="MuiButton"][class*="contained"]',
    content:
      "Click Analyze Manabase (or Try Example first). You'll see castability %, Health Score, land breakdown, and recommendations.",
    placement: 'bottom',
    title: '🔬 Step 2: Analyze',
    spotlightClicks: true,
  },
]

/** Deep-link visitors already have intent — don't block them with a tour. */
export function hasAnalyzerDeepLinkParams(
  search = typeof window !== 'undefined' ? window.location.search : ''
): boolean {
  const params = new URLSearchParams(search)
  return params.has('sample') || params.has('format')
}

/** Primary analyzer CTAs that should dismiss the tour without forcing Skip. */
export function isPrimaryAnalyzerCtaLabel(text: string): boolean {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.includes('Try Example') || t.includes('Analyze Manabase') || t === 'Analyzing...'
}

/**
 * Inject a belt-and-suspenders CSS rule. react-joyride hardcodes
 * `pointer-events: auto` on the overlay via inline styles, so props alone
 * cannot make CTAs clickable when the overlay is present.
 */
function ensureNonBlockingOverlayCss() {
  const id = 'manatuner-joyride-nonblocking'
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    /* P0-UX-1: Joyride must never block Try Example / Analyze */
    .react-joyride__overlay {
      pointer-events: none !important;
      cursor: default !important;
    }
    .react-joyride__spotlight {
      pointer-events: none !important;
    }
    .react-joyride__tooltip,
    .react-joyride__tooltip button,
    .react-joyride__tooltip a,
    [data-test-id="button-primary"],
    [data-test-id="button-skip"],
    [data-test-id="button-back"],
    [data-test-id="button-close"] {
      pointer-events: auto !important;
    }
    /* Feedback banner + header/footer feedback links stay clickable during tour */
    [aria-label="Feedback banner"],
    [aria-label="Feedback banner"] a,
    a[href*="tally.so"] {
      pointer-events: auto !important;
      position: relative;
      z-index: 1301;
    }
  `
  document.head.appendChild(style)
}

interface OnboardingProps {
  hasAnalysisResult?: boolean
}

const Onboarding: React.FC<OnboardingProps> = ({ hasAnalysisResult = false }) => {
  const theme = useTheme()
  const [run, setRun] = useState(false)

  const markCompleted = useCallback(() => {
    setRun(false)
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true')
    } catch {
      // private mode / quota — tour simply won't re-run this session
    }
  }, [])

  useEffect(() => {
    ensureNonBlockingOverlayCss()
  }, [])

  useEffect(() => {
    let hasCompleted: string | null = null
    try {
      hasCompleted = localStorage.getItem(ONBOARDING_KEY)
    } catch {
      hasCompleted = null
    }

    if (hasCompleted) return

    // ?sample= / ?format= → no tour (P0: first-visit deep links must not block)
    if (hasAnalyzerDeepLinkParams()) {
      markCompleted()
      return
    }

    // Délai pour laisser le temps au DOM de se charger
    const timer = setTimeout(() => setRun(true), 500)
    return () => clearTimeout(timer)
  }, [markCompleted])

  // After a successful analysis the happy path is done — end tour if still open
  useEffect(() => {
    if (hasAnalysisResult && run) {
      markCompleted()
    }
  }, [hasAnalysisResult, run, markCompleted])

  // Capture-phase: primary CTAs (Try Example / Analyze) auto-dismiss tour so
  // first-click works and LS is marked completed (Skip not required).
  // Uses elementsFromPoint so we still find the CTA when joyride chrome is
  // painted on top; sync-removes the portal so the same click reaches the button.
  useEffect(() => {
    if (!run) return

    const findPrimaryCtaUnderPoint = (x: number, y: number): HTMLButtonElement | null => {
      const stack = document.elementsFromPoint(x, y)
      for (const el of stack) {
        if (!(el instanceof HTMLElement)) continue
        // Don't treat joyride Skip/Next as app CTAs
        if (el.closest('#react-joyride-portal') && el.closest('button')) {
          const inJoyrideBtn = el.closest('button')
          if (inJoyrideBtn && !isPrimaryAnalyzerCtaLabel(inJoyrideBtn.textContent || '')) {
            continue
          }
        }
        const btn = el.closest('button')
        if (btn && isPrimaryAnalyzerCtaLabel(btn.textContent || '')) {
          return btn as HTMLButtonElement
        }
      }
      return null
    }

    const onPointerDownCapture = (e: PointerEvent) => {
      // Ignore pure joyride controls (Skip / Next / Close) — leave them alone
      const raw = e.target as HTMLElement | null
      if (
        raw?.closest(
          '[data-test-id="button-skip"], [data-test-id="button-primary"], [data-test-id="button-back"], [data-test-id="button-close"]'
        )
      ) {
        return
      }

      const cta = findPrimaryCtaUnderPoint(e.clientX, e.clientY)
      if (!cta) return

      // Tear down overlay/tooltip immediately so this pointerdown → click hits CTA
      document.getElementById('react-joyride-portal')?.remove()
      markCompleted()
    }

    document.addEventListener('pointerdown', onPointerDownCapture, true)
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true)
  }, [run, markCompleted])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      markCompleted()
    }
  }

  // Réinitialiser l'onboarding (pour le développement/debug)
  // Appeler window.resetOnboarding() dans la console
  useEffect(() => {
    const w = window as Window & { resetOnboarding?: () => void }
    w.resetOnboarding = () => {
      try {
        localStorage.removeItem(ONBOARDING_KEY)
      } catch {
        /* ignore */
      }
      ensureNonBlockingOverlayCss()
      setRun(true)
    }
  }, [])

  const currentSteps = hasAnalysisResult ? steps : preAnalysisSteps

  return (
    <Joyride
      steps={currentSteps}
      run={run}
      continuous
      showSkipButton
      showProgress
      spotlightClicks
      // Overlay kept for visual cue but neutralized via ensureNonBlockingOverlayCss
      // (inline pointer-events:auto from joyride is overridden with !important).
      disableOverlayClose
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: theme.palette.primary.main,
          textColor: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          arrowColor: theme.palette.background.paper,
          overlayColor: 'rgba(0, 0, 0, 0.35)',
          zIndex: 10000,
        },
        overlay: {
          pointerEvents: 'none',
          cursor: 'default',
        },
        spotlight: {
          pointerEvents: 'none',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
          pointerEvents: 'auto',
        },
        buttonNext: {
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          pointerEvents: 'auto',
        },
        buttonBack: {
          color: theme.palette.text.secondary,
          marginRight: 10,
          pointerEvents: 'auto',
        },
        buttonSkip: {
          color: theme.palette.text.secondary,
          pointerEvents: 'auto',
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px',
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: 1.6,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Got it!',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  )
}

export default Onboarding
