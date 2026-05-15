/**
 * ManaTuner Design System · tokens.ts
 * Edition 2.7 · Mirror of manatuner.app production state
 * Extracted 2026-05-15 from src/theme/index.ts + src/styles/index.css
 *
 * Typed token export. Two themes are present (light + dark). The `tokens`
 * default export holds the LIGHT theme; the `darkTokens` export holds the
 * DARK overrides. Mirror, not target — values come from production.
 */

export const tokens = {
  edition: '2.7',
  mode: 'mirror' as const,
  source: 'manatuner.app production state',

  color: {
    mana: {
      white: '#F8F6D8',
      blue: '#0E68AB',
      black: '#150B00',
      red: '#D3202A',
      green: '#00733E',
      colorless: '#CBC5C0',
      multicolor: '#E9B54C',
    },
    manaGlow: {
      white: 'rgba(248, 246, 216, 0.6)',
      blue: 'rgba(14, 104, 171, 0.6)',
      black: 'rgba(90, 60, 90, 0.6)',
      red: 'rgba(211, 32, 42, 0.6)',
      green: 'rgba(0, 115, 62, 0.6)',
    },
    manaCss: {
      w: '#fffbd5',
      u: '#0e68ab',
      b: '#150b00',
      r: '#d3202a',
      g: '#00733e',
      c: '#ccc2c0',
    },
    mtgCss: {
      white: '#FFFBF0',
      blue: '#0E68AB',
      black: '#150B00',
      red: '#D3202A',
      green: '#00733E',
      gold: '#DAA520',
      silver: '#C0C0C0',
      bronze: '#CD7F32',
    },
    brand: {
      primary: '#1565C0',
      primaryLight: '#42A5F5',
      primaryDeep: '#0D47A1',
      secondary: '#7B1FA2',
      secondaryLight: '#BA68C8',
      secondaryDark: '#4A148C',
      themeColorMeta: '#1976d2',
      focusOutline: '#1976d2',
    },
    surface: {
      background: '#F5F3EE',
      paper: '#FFFFFF',
      rawBody: '#fafafa',
    },
    ink: {
      primary: '#1A1A1A',
      secondary: '#555555',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.8)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.2)',
    },
  },

  gradient: {
    heroWubrg:
      'linear-gradient(135deg, #E9B54C 0%, #0E68AB 25%, #9c27b0 50%, #D3202A 75%, #00733E 100%)',
    ctaKnowledge: 'linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)',
    ctaKnowledgeHover: 'linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)',
    bgPrimary: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    bgSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgCard: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    gradientText: 'linear-gradient(45deg, #667eea, #764ba2)',
    loadingSkeleton: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  },

  typography: {
    fontFamily: {
      bodyMui: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      bodyRaw:
        "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      heading: '"Cinzel", "Playfair Display", serif',
      headingCss: "'Poppins', 'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heroHomepage: 800,
    },
    fontSize: {
      h1: '3rem',
      h2: '2.5rem',
      h3: '2rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
      body1: '1rem',
      body2: '0.875rem',
      heroHomepageMobile: '2.5rem',
      heroHomepageDesktop: '3.5rem',
    },
    lineHeight: {
      h1: 1.2,
      h2: 1.3,
      h3: 1.4,
      h4: 1.4,
      h5: 1.5,
      h6: 1.6,
      body1: 1.6,
      body2: 1.5,
    },
    letterSpacing: {
      h1: '0.02em',
      h2: '0.01em',
    },
  },

  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    muiShape: 12,
    muiChip: 8,
    muiCard: 16,
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  shadow: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.12)',
    lg: '0 8px 16px rgba(0,0,0,0.15)',
    xl: '0 12px 24px rgba(0,0,0,0.18)',
    button: '0 4px 12px rgba(0,0,0,0.1)',
    buttonHover: '0 8px 24px rgba(0,0,0,0.15)',
    cardHover: '0 12px 32px rgba(0,0,0,0.15)',
    cardHoverDark: '0 12px 32px rgba(0,0,0,0.4)',
    cardHoverUtil: '0 4px 12px rgba(0,0,0,0.15)',
    libraryCtaBase: '0 2px 14px rgba(14,104,171,0.65), 0 0 18px rgba(125,180,255,0.35)',
    libraryCtaHover: '0 4px 22px rgba(14,104,171,0.85), 0 0 28px rgba(125,180,255,0.65)',
    libraryCtaPulse: '0 2px 14px rgba(14,104,171,0.9), 0 0 34px rgba(180,120,255,0.8)',
  },

  motion: {
    transition: {
      fast: '0.15s ease-out',
      normal: '0.25s ease-out',
      slow: '0.35s ease-out',
      muiButton: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      muiCard: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      muiTextField: 'all 0.2s ease-in-out',
      libraryCta: 'all 0.3s ease',
      cardHoverUtil: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    transform: {
      buttonHover: 'translateY(-2px)',
      cardHover: 'translateY(-4px)',
      libraryCtaHover: 'translateY(-1px)',
    },
    backdropFilter: {
      appBar: 'blur(10px)',
      cardDark: 'blur(10px)',
    },
    keyframes: {
      libraryPulse: 'libraryPulse 2.8s ease-out 0.8s 1',
      loadingSkeleton: 'loading 1.5s infinite',
      fadeIn: 'fadeIn 0.3s ease-out',
      slideIn: 'slideIn 0.3s ease-out',
      pulse: 'pulse 2s infinite',
    },
  },

  fonts: {
    loaded: [
      { family: 'Roboto', weights: '300;400;500;700' },
      { family: 'Cinzel', weights: '400;600;700' },
      { family: 'Mana Font', version: '1.18.0' },
    ],
    referencedButNotLoaded: ['Inter', 'Poppins', 'JetBrains Mono', 'Fira Code', 'Playfair Display'],
  },

  stack: {
    framework: 'React 18 + TypeScript + Vite',
    componentLibrary: 'Material-UI v5',
    tailwind: false,
    iconography: ['@mui/icons-material', 'lucide-react', 'mana-font@1.18.0'],
  },
} as const

export const darkTokens = {
  color: {
    mana: {
      white: '#F5F0D0',
      blue: '#4A9EE8',
      black: '#3D3D3D',
      red: '#FF5252',
      green: '#4CAF50',
      colorless: '#9E9E9E',
      multicolor: '#FFD700',
    },
    manaGlow: {
      white: 'rgba(245, 240, 208, 0.5)',
      blue: 'rgba(74, 158, 232, 0.5)',
      black: 'rgba(120, 80, 120, 0.5)',
      red: 'rgba(255, 82, 82, 0.5)',
      green: 'rgba(76, 175, 80, 0.5)',
    },
    brand: {
      primary: '#64B5F6',
      primaryLight: '#90CAF9',
      primaryDeep: '#42A5F5',
      secondary: '#CE93D8',
      secondaryLight: '#E1BEE7',
      secondaryDark: '#BA68C8',
      themeColorMeta: '#0D0D0F',
    },
    surface: {
      background: '#0D0D0F',
      paper: '#1A1A1E',
    },
    ink: {
      primary: '#F5F5F5',
      secondary: '#AAAAAA',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.05)',
      secondary: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(255, 255, 255, 0.10)',
    },
  },
  status: {
    error: '#FF6B6B',
    warning: '#FFD54F',
    info: '#4FC3F7',
    success: '#69F0AE',
  },
} as const

export type Tokens = typeof tokens
export type DarkTokens = typeof darkTokens
export default tokens
