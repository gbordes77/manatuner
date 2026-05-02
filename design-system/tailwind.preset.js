/**
 * ManaTuner Design System — Tailwind preset
 * ---------------------------------------------------------------
 * Usage in tailwind.config.js of the target project:
 *
 *   import preset from "./design-system/tailwind.preset.js"
 *   export default { presets: [preset], content: [...] }
 *
 * Dark mode is class-based: <html class="dark">.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    screens: {
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
    },
    extend: {
      colors: {
        mana: {
          white:      "#F8F6D8",
          blue:       "#0E68AB",
          black:      "#150B00",
          red:        "#D3202A",
          green:      "#00733E",
          colorless:  "#CBC5C0",
          multicolor: "#E9B54C",
        },
        manaDark: {
          white:      "#F5F0D0",
          blue:       "#4A9EE8",
          black:      "#3D3D3D",
          red:        "#FF5252",
          green:      "#4CAF50",
          colorless:  "#9E9E9E",
          multicolor: "#FFD700",
        },
        brand: {
          DEFAULT:    "#1565C0",
          light:      "#42A5F5",
          dark:       "#0D47A1",
          secondary:  "#7B1FA2",
        },
        surface: {
          light:      "#F5F3EE",
          paper:      "#FFFFFF",
          dark:       "#0D0D0F",
          paperDark:  "#1A1A1E",
        },
      },
      backgroundImage: {
        "cta-knowledge":       "linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)",
        "cta-knowledge-hover": "linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)",
        "cta-premium":         "linear-gradient(135deg, #E9B54C 0%, #FFD700 50%, #E9B54C 100%)",
        "cta-premium-hover":   "linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FFD700 100%)",
        "hero-wubrg":          "linear-gradient(135deg, #E9B54C 0%, #0E68AB 25%, #9c27b0 50%, #D3202A 75%, #00733E 100%)",
        "bg-primary-light":    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        "bg-secondary":        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      fontFamily: {
        heading: ['Cinzel', 'Playfair Display', 'serif'],
        sans:    ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        h1:    ["3rem",    { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "700" }],
        h2:    ["2.5rem",  { lineHeight: "1.3", letterSpacing: "0.01em", fontWeight: "600" }],
        h3:    ["2rem",    { lineHeight: "1.4", fontWeight: "600" }],
        h4:    ["1.5rem",  { lineHeight: "1.4", fontWeight: "500" }],
        h5:    ["1.25rem", { lineHeight: "1.5", fontWeight: "500" }],
        h6:    ["1rem",    { lineHeight: "1.6", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        "sm-soft":     "0 2px 4px rgba(0,0,0,0.1)",
        "md-soft":     "0 4px 8px rgba(0,0,0,0.12)",
        "lg-soft":     "0 8px 16px rgba(0,0,0,0.15)",
        "xl-soft":     "0 12px 24px rgba(0,0,0,0.18)",
        "btn-hover":   "0 8px 24px rgba(0,0,0,0.15)",
        "card-hover":  "0 12px 32px rgba(0,0,0,0.15)",
        "card-hover-dark": "0 12px 32px rgba(0,0,0,0.4)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      backdropBlur: {
        glass: "10px",
      },
      keyframes: {
        fadeIn:      { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideInUp:   { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulse:       { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        shimmer:     { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        glow:        { "0%,100%": { boxShadow: "0 0 5px rgba(74,144,226,0.3)" }, "50%": { boxShadow: "0 0 20px rgba(74,144,226,0.6)" } },
      },
      animation: {
        fadeIn:    "fadeIn 0.3s ease-out",
        slideInUp: "slideInUp 0.6s ease-out",
        pulse:     "pulse 2s infinite",
        shimmer:   "shimmer 2s infinite",
        glow:      "glow 2s infinite",
      },
    },
  },
};
