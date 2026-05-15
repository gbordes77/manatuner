/**
 * ManaTuner · Tailwind Preset
 * Edition 2.6 · Light theme
 *
 * Usage in a consuming Tailwind project:
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./design-system/tailwind.preset.js')],
 *     content: ['./src/**\/*.{ts,tsx,html}'],
 *   }
 *
 * Dark theme is intentionally NOT included — see BRANDBOOK.md §10.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,

  theme: {
    extend: {
      colors: {
        // ── Mana — canon ────────────────────────────────────────────
        mana: {
          w: '#F8F6D8',
          u: '#0E68AB',
          b: '#150B00',
          r: '#D3202A',
          g: '#00733E',
          c: '#CBC5C0',
          m: '#E9B54C',
        },

        // ── Brand ──────────────────────────────────────────────────
        brand: {
          DEFAULT: '#1565C0',
          deep:    '#0D47A1',
        },

        // ── Surfaces ───────────────────────────────────────────────
        parchment: '#F5F3EE',
        'parchment-deep': '#EDE9E0',
        paper:     '#FFFFFF',

        // ── Ink ────────────────────────────────────────────────────
        ink: {
          DEFAULT:   '#1A1A1A',
          secondary: '#555555',
          tertiary:  '#9A958C',
        },

        // ── Rules ──────────────────────────────────────────────────
        rule: {
          DEFAULT: 'rgba(26, 26, 26, 0.08)',
          soft:    'rgba(26, 26, 26, 0.04)',
        },
      },

      fontFamily: {
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
        // Override the default sans to inherit body
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif:   ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },

      fontSize: {
        // Match the design system scale verbatim
        h1:    ['3rem',    { lineHeight: '1.1',  letterSpacing: '0.005em', fontWeight: '700' }],
        h2:    ['2.5rem',  { lineHeight: '1.15', letterSpacing: '0.005em', fontWeight: '600' }],
        h3:    ['2rem',    { lineHeight: '1.2',                            fontWeight: '600' }],
        h4:    ['1.5rem',  { lineHeight: '1.3',                            fontWeight: '500' }],
        h5:    ['1.25rem', { lineHeight: '1.4',                            fontWeight: '500' }],
        h6:    ['1rem',    { lineHeight: '1.5',                            fontWeight: '500' }],
        body1: ['1rem',    { lineHeight: '1.65' }],
        body2: ['0.875rem',{ lineHeight: '1.55' }],
        tech:  ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },

      letterSpacing: {
        tight:  '-0.005em',
        wide:   '0.04em',
        wider:  '0.14em',
        widest: '0.18em',
      },

      borderRadius: {
        DEFAULT: '12px',
        sm:   '6px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        full: '9999px',
      },

      spacing: {
        xs:    '0.25rem',
        sm:    '0.5rem',
        md:    '1rem',
        lg:    '1.5rem',
        xl:    '2.5rem',
        '2xl': '4rem',
      },

      boxShadow: {
        card:          '0 1px 2px rgba(20,11,0,0.04), 0 4px 16px rgba(20,11,0,0.04)',
        'card-hover':  '0 4px 12px rgba(20,11,0,0.08), 0 16px 40px rgba(20,11,0,0.10)',
        button:        '0 2px 8px rgba(20,11,0,0.10)',
        'button-hover':'0 8px 24px rgba(20,11,0,0.18)',
        focus:         '0 0 0 4px rgba(14,104,171,0.15)',
      },

      backgroundImage: {
        'cta-premium':   'linear-gradient(135deg, #E9B54C 0%, #FFD700 100%)',
        'cta-knowledge': 'linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)',
        'hero-wubrg':
          'linear-gradient(90deg, #F8F6D8 0% 20%, #0E68AB 20% 40%, #150B00 40% 60%, #D3202A 60% 80%, #00733E 80% 100%)',
        parchment:
          "radial-gradient(1200px 600px at 20% -10%, rgba(14,104,171,0.04), transparent 60%), radial-gradient(900px 500px at 110% 30%, rgba(233,181,76,0.05), transparent 55%)",
      },

      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        fast: '180ms',
        base: '320ms',
        slow: '600ms',
      },

      animation: {
        'fade-in':  'dsFadeIn 320ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-up':  'dsFadeUp 600ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-up': 'dsSlideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) both',
      },

      keyframes: {
        dsFadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        dsFadeUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        dsSlideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },

      zIndex: {
        base:    '1',
        raised:  '10',
        sticky:  '100',
        overlay: '1000',
        modal:   '1100',
        toast:   '1200',
      },
    },
  },

  plugins: [
    /**
     * Reduced-motion guard — non-negotiable. Adds a global rule that
     * collapses every animation and transition when the user has
     * `prefers-reduced-motion: reduce` enabled.
     */
    function reducedMotionGuard({ addBase }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            'animation-duration':       '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration':      '0.01ms !important',
            'scroll-behavior':          'auto !important',
          },
        },
      })
    },

    /**
     * Component utilities — `btn-action`, `btn-knowledge`, `btn-default`
     * map directly to the CTA tiers documented in BRANDBOOK.md §2.
     */
    function ctaUtilities({ addComponents }) {
      addComponents({
        '.btn-action': {
          background: 'linear-gradient(135deg, #E9B54C 0%, #FFD700 100%)',
          color: '#5A3E00',
          textShadow: '0 1px 0 rgba(255,255,255,0.3)',
        },
        '.btn-knowledge': {
          background: 'linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)',
          color: '#FFFFFF',
        },
        '.btn-default': {
          background: '#1565C0',
          color: '#FFFFFF',
        },
        '.text-wubrg': {
          backgroundImage:
            'linear-gradient(90deg, #F8F6D8 0% 20%, #0E68AB 20% 40%, #150B00 40% 60%, #D3202A 60% 80%, #00733E 80% 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
          filter: 'saturate(1.05)',
        },
      })
    },
  ],
}
