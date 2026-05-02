/**
 * ManaTuner Design System — MUI Theme bridge
 * ---------------------------------------------------------------
 * Extends MUI's Palette with `mana` and `glass` namespaces.
 * Drop into a React + MUI project:
 *
 *   import { lightTheme, darkTheme } from "./mui-theme"
 *   <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
 */

import { createTheme, ThemeOptions } from '@mui/material/styles'
import { mana, manaDark, glow, lightPalette, darkPalette, typography as t } from './tokens'

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
      whiteGlow: string
      blueGlow: string
      blackGlow: string
      redGlow: string
      greenGlow: string
    }
    glass: { primary: string; secondary: string; border: string }
  }
  interface PaletteOptions {
    mana?: Partial<Palette['mana']>
    glass?: Partial<Palette['glass']>
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: t.body1.fontFamily,
    h1: t.h1,
    h2: t.h2,
    h3: t.h3,
    h4: t.h4,
    h5: t.h5,
    h6: t.h6,
    body1: t.body1,
    body2: t.body2,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
        contained: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': { boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)' },
            '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.2)' },
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } } },
    MuiAppBar: {
      styleOverrides: {
        root: { borderRadius: 0, backdropFilter: 'blur(10px)' },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    ...lightPalette,
    mana: {
      ...mana,
      whiteGlow: glow.white,
      blueGlow: glow.blue,
      blackGlow: glow.black,
      redGlow: glow.red,
      greenGlow: glow.green,
    },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    ...darkPalette,
    mana: {
      ...manaDark,
      whiteGlow: 'rgba(245, 240, 208, 0.5)',
      blueGlow: 'rgba(74, 158, 232, 0.5)',
      blackGlow: 'rgba(120, 80, 120, 0.5)',
      redGlow: 'rgba(255, 82, 82, 0.5)',
      greenGlow: 'rgba(76, 175, 80, 0.5)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13, 13, 15, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
})

export default lightTheme
