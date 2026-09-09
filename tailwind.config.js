/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark / accent — deep teal-ink (keeps the `navy-*` key so existing classes restyle)
        navy: {
          50: '#eef2f1',
          100: '#d6e0de',
          200: '#adc3bf',
          300: '#7ea099',
          400: '#527b73',
          500: '#345c55',
          600: '#274743',
          700: '#1f3a37',
          800: '#182d2b',
          900: '#122120',
          950: '#0b1615',
        },
        // Warm brass accent (keeps the `gold-*` key)
        gold: {
          50: '#faf5ea',
          100: '#f2e6cd',
          200: '#e6cd9d',
          300: '#d8b06a',
          400: '#c9974a',
          500: '#b98f4c',
          600: '#a0762f',
          700: '#835d29',
          800: '#6b4c27',
          900: '#5a4023',
        },
        cream: '#f8f4ea', // paper
        parchment: '#efe8d7', // paper, one shade deeper
        white: '#ffffff',
        ink: '#171512',
      },
      fontFamily: {
        // Inter for text/UI, Archivo for headings & display
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Archivo', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        // Sharp, minimal — corners barely rounded
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
        md: '3px',
        lg: '3px',
        xl: '4px',
        '2xl': '5px',
        '3xl': '6px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23, 21, 18, 0.04)',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1.25rem', lg: '2rem' },
        screens: { '2xl': '1200px' },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
