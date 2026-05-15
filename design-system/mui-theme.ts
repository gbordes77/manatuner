/**
 * ManaTuner · MUI Theme · Light edition only
 * Edition 2.6
 *
 * Dark theme is intentionally NOT exported here — see BRANDBOOK.md §10.
 * The previous dark surface system had unresolved readability and Safari
 * glass-effect issues. A dark theme will be re-cut once those are fixed
 * structurally rather than patched.
 *
 * Until then: ship light-only, and respect the user's OS preference by
 * keeping the parchment surface across both light and dark OS settings.
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles'
import { tokens } from './tokens'

declare module '@mui/material/styles' {
  interface Palette {
    mana: {
      white: string
      blue: string
      black: string
      red: string
      green: string
      colorless: string
      multicolor: string
    }
    surface: {
      background: string
      backgroundDeep: string
      paper: string
    }
  }

  interface PaletteOptions {
    mana?: Partial<Palette['mana']>
    surface?: Partial<Palette['surface']>
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: tokens.typography.fontFamily.body,
    h1: {
      fontFamily: tokens.typography.fontFamily.display,
      fontSize: tokens.typography.fontSize.h1,
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: '0.005em',
    },
    h2: {
      fontFamily: tokens.typography.fontFamily.display,
      fontSize: tokens.typography.fontSize.h2,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: 1.15,
      letterSpacing: '0.005em',
    },
    h3: {
      fontFamily: tokens.typography.fontFamily.display,
      fontSize: tokens.typography.fontSize.h3,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: tokens.typography.fontFamily.display,
      fontSize: tokens.typography.fontSize.h4,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.snug,
    },
    h5: {
      fontSize: tokens.typography.fontSize.h5,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: tokens.typography.fontSize.h6,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    body1: {
      fontSize: tokens.typography.fontSize.body1,
      lineHeight: tokens.typography.lineHeight.relaxed,
    },
    body2: {
      fontSize: tokens.typography.fontSize.body2,
      lineHeight: 1.55,
    },
    caption: {
      fontFamily: tokens.typography.fontFamily.mono,
      fontSize: tokens.typography.fontSize.tech,
      letterSpacing: '0.04em',
      color: tokens.color.ink.tertiary,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(1200px 600px at 20% -10%, rgba(14,104,171,.04), transparent 60%),
            radial-gradient(900px 500px at 110% 30%, rgba(233,181,76,.05), transparent 55%)
          `,
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: tokens.typography.fontWeight.semibold,
          padding: '10px 24px',
          letterSpacing: '0.005em',
          transition: `all ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
          '&:hover': {
            transform: tokens.motion.transform.buttonLift,
            boxShadow: tokens.shadow.buttonHover,
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: tokens.shadow.button,
        },
        containedPrimary: {
          background: tokens.color.brand.primary,
          '&:hover': {
            background: tokens.color.brand.primaryDeep,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${tokens.color.rule.default}`,
          boxShadow: tokens.shadow.card,
          transition: `all ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
          '&:hover': {
            transform: tokens.motion.transform.cardLift,
            boxShadow: tokens.shadow.cardHover,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
            '&:hover': {
              boxShadow: '0 0 0 4px rgba(14, 104, 171, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(14, 104, 171, 0.15)',
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: tokens.typography.fontWeight.medium,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(245, 243, 238, 0.85)',
          color: tokens.color.ink.primary,
          boxShadow: `0 1px 0 ${tokens.color.rule.default}`,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.body2,
          background: tokens.color.ink.primary,
          padding: '8px 12px',
          borderRadius: tokens.radius.md,
        },
      },
    },
  },
}

/**
 * The ManaTuner light theme.
 *
 * Export name is `lightTheme` for ergonomic parity with the previous dual-theme
 * API; `theme` is the recommended default import. Both refer to the same object.
 */
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: tokens.color.brand.primary,
      light: '#42A5F5',
      dark: tokens.color.brand.primaryDeep,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6A1B9A',
      light: '#9C4DCC',
      dark: '#38006B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: tokens.color.state.error,
    },
    warning: {
      main: tokens.color.state.warning,
      contrastText: '#5A3E00',
    },
    info: {
      main: tokens.color.state.info,
    },
    success: {
      main: tokens.color.state.success,
    },
    background: {
      default: tokens.color.surface.background,
      paper: tokens.color.surface.paper,
    },
    text: {
      primary: tokens.color.ink.primary,
      secondary: tokens.color.ink.secondary,
      disabled: tokens.color.ink.tertiary,
    },
    divider: tokens.color.rule.default,
    mana: tokens.color.mana,
    surface: tokens.color.surface,
  },
})

export const theme = lightTheme
export default lightTheme
