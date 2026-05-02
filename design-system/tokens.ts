/**
 * ManaTuner Design System — TypeScript tokens
 * ---------------------------------------------------------------
 * Plain JS object. Zero dependencies. Import in any TS/JS stack:
 *
 *   import { tokens, lightTheme, darkTheme } from "./tokens"
 *
 * Stays in sync with tokens.json / tokens.css. Update all three
 * together when changing brand values.
 */

export const mana = {
  white: '#F8F6D8',
  blue: '#0E68AB',
  black: '#150B00',
  red: '#D3202A',
  green: '#00733E',
  colorless: '#CBC5C0',
  multicolor: '#E9B54C',
} as const

export const manaDark = {
  white: '#F5F0D0',
  blue: '#4A9EE8',
  black: '#3D3D3D',
  red: '#FF5252',
  green: '#4CAF50',
  colorless: '#9E9E9E',
  multicolor: '#FFD700',
} as const

export const glow = {
  white: 'rgba(248, 246, 216, 0.6)',
  blue: 'rgba(14, 104, 171, 0.6)',
  black: 'rgba(90, 60, 90, 0.6)',
  red: 'rgba(211, 32, 42, 0.6)',
  green: 'rgba(0, 115, 62, 0.6)',
} as const

export const gradients = {
  /** Library / secondary CTA — knowledge & exploration */
  ctaKnowledge: 'linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)',
  ctaKnowledgeHover: 'linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)',
  /** Primary CTA — gold. Use on the single highest-priority action per page. */
  ctaPremium: 'linear-gradient(135deg, #E9B54C 0%, #FFD700 50%, #E9B54C 100%)',
  ctaPremiumHover: 'linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FFD700 100%)',
  /** Hero H1 — gold → WUBRG sweep. Apply via background-clip: text. */
  heroWubrg: [
    'linear-gradient(135deg,',
    '  #E9B54C 0%,',
    '  #0E68AB 25%,',
    '  #9c27b0 50%,',
    '  #D3202A 75%,',
    '  #00733E 100%)',
  ].join('\n'),
  bgPrimaryLight: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  bgSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
} as const

export const lightPalette = {
  primary: { main: '#1565C0', light: '#42A5F5', dark: '#0D47A1' },
  secondary: { main: '#7B1FA2', light: '#BA68C8', dark: '#4A148C' },
  error: { main: '#D3202A' },
  warning: { main: '#E9B54C' },
  info: { main: '#0E68AB' },
  success: { main: '#00733E' },
  background: { default: '#F5F3EE', paper: '#FFFFFF' },
  text: { primary: '#1A1A1A', secondary: '#555555' },
  glass: {
    primary: 'rgba(255, 255, 255, 0.8)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
} as const

export const darkPalette = {
  primary: { main: '#64B5F6', light: '#90CAF9', dark: '#42A5F5' },
  secondary: { main: '#CE93D8', light: '#E1BEE7', dark: '#BA68C8' },
  error: { main: '#FF6B6B' },
  warning: { main: '#FFD54F' },
  info: { main: '#4FC3F7' },
  success: { main: '#69F0AE' },
  background: { default: '#0D0D0F', paper: '#1A1A1E' },
  text: { primary: '#F5F5F5', secondary: '#AAAAAA' },
  glass: {
    primary: 'rgba(255, 255, 255, 0.05)',
    secondary: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
} as const

export const fontFamily = {
  heading: '"Cinzel", "Playfair Display", serif',
  body: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
} as const

export const typography = {
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '0.02em',
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.01em',
  },
  h3: { fontFamily: fontFamily.heading, fontSize: '2rem', fontWeight: 600, lineHeight: 1.4 },
  h4: { fontFamily: fontFamily.heading, fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.4 },
  h5: { fontFamily: fontFamily.body, fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 },
  h6: { fontFamily: fontFamily.body, fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },
  body1: { fontFamily: fontFamily.body, fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  body2: { fontFamily: fontFamily.body, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

export const shadow = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 4px 8px rgba(0,0,0,0.12)',
  lg: '0 8px 16px rgba(0,0,0,0.15)',
  xl: '0 12px 24px rgba(0,0,0,0.18)',
  buttonHover: '0 8px 24px rgba(0,0,0,0.15)',
  cardHover: '0 12px 32px rgba(0,0,0,0.15)',
  cardHoverDark: '0 12px 32px rgba(0,0,0,0.4)',
} as const

export const motion = {
  duration: { fast: '150ms', normal: '250ms', slow: '350ms' },
  easing: { default: 'cubic-bezier(0.4, 0, 0.2, 1)' },
} as const

export const breakpoint = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

export const tokens = {
  mana,
  manaDark,
  glow,
  gradients,
  lightPalette,
  darkPalette,
  typography,
  fontFamily,
  fontWeight,
  spacing,
  radius,
  shadow,
  motion,
  breakpoint,
} as const

export type Tokens = typeof tokens
export default tokens
