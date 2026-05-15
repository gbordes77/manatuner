/**
 * ManaTuner · Design Tokens · TypeScript export
 * Edition 2.6 · Light theme
 *
 * Dark theme is intentionally excluded — see BRANDBOOK.md §10.
 * Consume this module as the typed source of truth in React/TS code.
 */

export const tokens = {
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
    brand: {
      primary: '#1565C0',
      primaryDeep: '#0D47A1',
    },
    surface: {
      background: '#F5F3EE',
      backgroundDeep: '#EDE9E0',
      paper: '#FFFFFF',
    },
    ink: {
      primary: '#1A1A1A',
      secondary: '#555555',
      tertiary: '#9A958C',
    },
    rule: {
      default: 'rgba(26, 26, 26, 0.08)',
      soft: 'rgba(26, 26, 26, 0.04)',
    },
    state: {
      error: '#D3202A',
      warning: '#E9B54C',
      info: '#0E68AB',
      success: '#00733E',
      disabled: '#CBC5C0',
    },
  },

  gradient: {
    ctaPremium: 'linear-gradient(135deg, #E9B54C 0%, #FFD700 100%)',
    ctaKnowledge: 'linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)',
    heroWubrg:
      'linear-gradient(90deg, #F8F6D8 0% 20%, #0E68AB 20% 40%, #150B00 40% 60%, #D3202A 60% 80%, #00733E 80% 100%)',
  },

  typography: {
    fontFamily: {
      display: '"Cinzel", "Playfair Display", Georgia, serif',
      body: '"Inter", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
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
      tech: '0.75rem',
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.65,
    },
    letterSpacing: {
      tight: '-0.005em',
      normal: '0',
      wide: '0.04em',
      wider: '0.14em',
    },
  },

  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
    '2xl': '4rem',
  },

  shadow: {
    card: '0 1px 2px rgba(20,11,0,0.04), 0 4px 16px rgba(20,11,0,0.04)',
    cardHover: '0 4px 12px rgba(20,11,0,0.08), 0 16px 40px rgba(20,11,0,0.10)',
    button: '0 2px 8px rgba(20,11,0,0.10)',
    buttonHover: '0 8px 24px rgba(20,11,0,0.18)',
  },

  motion: {
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      fast: '180ms',
      base: '320ms',
      slow: '600ms',
    },
    transform: {
      cardLift: 'translateY(-4px)',
      buttonLift: 'translateY(-2px)',
      arrowNudge: 'translateX(4px)',
    },
  },

  zIndex: {
    base: 1,
    raised: 10,
    sticky: 100,
    overlay: 1000,
    modal: 1100,
    toast: 1200,
  },
} as const

export type Tokens = typeof tokens

export type ManaColor = keyof typeof tokens.color.mana
export type CtaTier = 'premium' | 'knowledge' | 'default'

/**
 * Helper — resolve a CTA tier to its gradient or solid colour.
 * Tier 1 (premium) and Tier 2 (knowledge) return a gradient.
 * Tier 3 (default) returns the solid brand colour.
 */
export const ctaBackground = (tier: CtaTier): string => {
  switch (tier) {
    case 'premium':
      return tokens.gradient.ctaPremium
    case 'knowledge':
      return tokens.gradient.ctaKnowledge
    case 'default':
      return tokens.color.brand.primary
  }
}

export default tokens
